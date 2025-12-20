"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CatheterPathProps {
	className?: string;
	progress: number; // 0-1 for scroll progress
}

// Define the path points that the catheter will follow
// These correspond to key positions in the vascular network
const pathPoints = [
	{ x: 200, y: 0, rotation: 0 }, // Entry
	{ x: 195, y: 80, rotation: -2 }, // Into aorta
	{ x: 185, y: 160, rotation: -5 }, // First curve
	{ x: 175, y: 200, rotation: -15 }, // Branch point
	{ x: 140, y: 240, rotation: -35 }, // Turning left
	{ x: 100, y: 280, rotation: -45 }, // Deep into carotid
	{ x: 75, y: 340, rotation: -30 }, // Navigating
	{ x: 60, y: 400, rotation: -10 }, // Approaching target
	{ x: 55, y: 480, rotation: -5 }, // Near target
	{ x: 58, y: 550, rotation: 0 }, // At target
	{ x: 60, y: 590, rotation: 0 }, // Treatment zone
];

function interpolatePath(
	points: typeof pathPoints,
	t: number,
): { x: number; y: number; rotation: number } {
	const clampedT = Math.max(0, Math.min(1, t));
	const segment = clampedT * (points.length - 1);
	const index = Math.floor(segment);
	const localT = segment - index;

	if (index >= points.length - 1) {
		return points[points.length - 1];
	}

	const p1 = points[index];
	const p2 = points[index + 1];

	// Smooth interpolation using ease-out
	const easedT = 1 - (1 - localT) ** 2;

	return {
		x: p1.x + (p2.x - p1.x) * easedT,
		y: p1.y + (p2.y - p1.y) * easedT,
		rotation: p1.rotation + (p2.rotation - p1.rotation) * easedT,
	};
}

export function CatheterPath({ className, progress }: CatheterPathProps) {
	const position = useMemo(() => interpolatePath(pathPoints, progress), [progress]);

	// Calculate trail positions for motion blur effect
	const trailPositions = useMemo(() => {
		return [0.02, 0.04, 0.06].map((offset) => {
			const trailProgress = Math.max(0, progress - offset);
			return interpolatePath(pathPoints, trailProgress);
		});
	}, [progress]);

	// Is catheter actively moving?
	const isMoving = progress > 0.01 && progress < 0.98;

	// Has reached target?
	const atTarget = progress > 0.9;

	return (
		<svg
			viewBox="0 0 400 800"
			className={cn("w-full h-full pointer-events-none", className)}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<defs>
				{/* Catheter gradient */}
				<linearGradient id="catheterBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="var(--color-text-subtle)" />
					<stop offset="50%" stopColor="var(--color-text)" />
					<stop offset="100%" stopColor="var(--color-text-subtle)" />
				</linearGradient>

				{/* Tip glow */}
				<radialGradient id="catheterTipGlow" cx="50%" cy="0%" r="100%">
					<stop offset="0%" stopColor="var(--color-primary)" stopOpacity="1" />
					<stop offset="30%" stopColor="var(--color-primary)" stopOpacity="0.6" />
					<stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
				</radialGradient>

				{/* Trail gradient */}
				<linearGradient id="trailGradient" x1="0%" y1="100%" x2="0%" y2="0%">
					<stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
					<stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.5" />
				</linearGradient>

				{/* Glow filter */}
				<filter id="tipGlowFilter" x="-100%" y="-100%" width="300%" height="300%">
					<feGaussianBlur stdDeviation="3" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>

				{/* Success pulse filter */}
				<filter id="successPulse" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="5" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* Motion trail (when moving) */}
			{isMoving &&
				trailPositions.map((pos, i) => (
					<g
						key={`trail-${i}`}
						transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
						opacity={0.15 - i * 0.04}
					>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="60"
							stroke="var(--color-primary)"
							strokeWidth="3"
							strokeLinecap="round"
						/>
					</g>
				))}

			{/* Catheter group */}
			<g
				transform={`translate(${position.x}, ${position.y}) rotate(${position.rotation})`}
				style={{
					transition: isMoving ? "none" : "transform 0.3s ease-out",
				}}
			>
				{/* Catheter body */}
				<line
					x1="0"
					y1="-5"
					x2="0"
					y2="80"
					stroke="url(#catheterBodyGradient)"
					strokeWidth="4"
					strokeLinecap="round"
				/>

				{/* Inner lumen */}
				<line
					x1="0"
					y1="0"
					x2="0"
					y2="75"
					stroke="var(--color-bg)"
					strokeWidth="1.5"
					strokeLinecap="round"
					opacity="0.3"
				/>

				{/* Radiopaque markers */}
				<rect
					x="-3"
					y="20"
					width="6"
					height="3"
					rx="1"
					fill="var(--color-secondary)"
					opacity="0.8"
				/>
				<rect
					x="-3"
					y="35"
					width="6"
					height="3"
					rx="1"
					fill="var(--color-secondary)"
					opacity="0.8"
				/>
				<rect
					x="-3"
					y="50"
					width="6"
					height="3"
					rx="1"
					fill="var(--color-secondary)"
					opacity="0.8"
				/>

				{/* Catheter tip */}
				<path
					d="M-2.5 -5 Q-2.5 -12 0 -15 Q2.5 -12 2.5 -5"
					stroke="var(--color-primary)"
					strokeWidth="2"
					fill="none"
					filter={isMoving || atTarget ? "url(#tipGlowFilter)" : undefined}
				/>

				{/* Tip highlight */}
				<circle cx="0" cy="-13" r="2.5" fill="var(--color-primary)" />

				{/* Active tip glow */}
				{(isMoving || atTarget) && (
					<ellipse
						cx="0"
						cy="-15"
						rx="8"
						ry="12"
						fill="url(#catheterTipGlow)"
						opacity={atTarget ? 0.8 : 0.5}
					/>
				)}
			</g>

			{/* Success animation when at target */}
			{atTarget && (
				<g transform="translate(60, 590)">
					{/* Expanding rings */}
					<circle
						r="10"
						fill="none"
						stroke="var(--color-primary)"
						strokeWidth="2"
						opacity="0.6"
						className="animate-ping"
						style={{ animationDuration: "1.5s" }}
					/>
					<circle
						r="20"
						fill="none"
						stroke="var(--color-primary)"
						strokeWidth="1"
						opacity="0.4"
						className="animate-ping"
						style={{ animationDuration: "2s", animationDelay: "0.3s" }}
					/>

					{/* Success center glow */}
					<circle r="6" fill="var(--color-primary)" opacity="0.6" filter="url(#successPulse)" />
				</g>
			)}
		</svg>
	);
}
