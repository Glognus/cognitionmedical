"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface VascularNetworkProps {
	className?: string;
	progress?: number; // 0-1 for animation progress
}

export function VascularNetwork({ className, progress = 0 }: VascularNetworkProps) {
	// Calculate which vessels to highlight based on progress
	const vesselOpacity = useMemo(() => {
		return {
			main: Math.min(progress * 3, 1),
			branch1: Math.max(0, Math.min((progress - 0.15) * 4, 1)),
			branch2: Math.max(0, Math.min((progress - 0.25) * 4, 1)),
			branch3: Math.max(0, Math.min((progress - 0.35) * 4, 1)),
			target: Math.max(0, Math.min((progress - 0.5) * 3, 1)),
		};
	}, [progress]);

	// Blood flow particle positions based on progress
	const particleOffset = useMemo(() => {
		return (progress * 500) % 100;
	}, [progress]);

	return (
		<svg
			viewBox="0 0 400 800"
			className={cn("w-full h-full", className)}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<defs>
				{/* Vessel gradient - dark to represent blood flow */}
				<linearGradient id="vesselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
					<stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.4" />
					<stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.2" />
				</linearGradient>

				{/* Active vessel gradient */}
				<linearGradient id="activeVessel" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
					<stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6" />
					<stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
				</linearGradient>

				{/* Blockage gradient */}
				<radialGradient id="blockageGradient" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
					<stop offset="70%" stopColor="var(--color-accent)" stopOpacity="0.4" />
					<stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
				</radialGradient>

				{/* Blood particle gradient */}
				<radialGradient id="bloodParticle" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
					<stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
				</radialGradient>

				{/* Glow filter for vessels */}
				<filter id="vesselGlow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="4" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* Background vessel wall texture */}
			<g opacity={0.1 + vesselOpacity.main * 0.2}>
				{/* Large background vessels */}
				<ellipse cx="100" cy="200" rx="80" ry="150" stroke="var(--color-border)" strokeWidth="1" />
				<ellipse cx="300" cy="350" rx="60" ry="120" stroke="var(--color-border)" strokeWidth="1" />
			</g>

			{/* Main vessel - aortic arch style */}
			<g style={{ transition: "opacity 0.5s ease" }} opacity={vesselOpacity.main}>
				<path
					d="M200 0
					   C200 100 180 150 180 200
					   S160 280 170 350
					   S185 420 185 500
					   S175 600 180 700
					   L180 800"
					stroke="url(#vesselGradient)"
					strokeWidth="24"
					strokeLinecap="round"
					fill="none"
				/>
				{/* Inner vessel wall */}
				<path
					d="M200 0
					   C200 100 180 150 180 200
					   S160 280 170 350
					   S185 420 185 500
					   S175 600 180 700
					   L180 800"
					stroke="var(--color-bg)"
					strokeWidth="16"
					strokeLinecap="round"
					fill="none"
					opacity="0.5"
				/>
			</g>

			{/* Branch 1 - Left carotid */}
			<g style={{ transition: "opacity 0.5s ease 0.2s" }} opacity={vesselOpacity.branch1}>
				<path
					d="M175 180
					   C140 200 100 220 70 280
					   S40 360 50 420
					   S60 500 40 550"
					stroke="url(#vesselGradient)"
					strokeWidth="16"
					strokeLinecap="round"
					fill="none"
				/>
				<path
					d="M175 180
					   C140 200 100 220 70 280
					   S40 360 50 420
					   S60 500 40 550"
					stroke="var(--color-bg)"
					strokeWidth="10"
					strokeLinecap="round"
					fill="none"
					opacity="0.5"
				/>
			</g>

			{/* Branch 2 - Right carotid */}
			<g style={{ transition: "opacity 0.5s ease 0.3s" }} opacity={vesselOpacity.branch2}>
				<path
					d="M185 200
					   C220 220 260 240 300 280
					   S340 340 350 400
					   S360 480 370 540"
					stroke="url(#vesselGradient)"
					strokeWidth="14"
					strokeLinecap="round"
					fill="none"
				/>
				<path
					d="M185 200
					   C220 220 260 240 300 280
					   S340 340 350 400
					   S360 480 370 540"
					stroke="var(--color-bg)"
					strokeWidth="8"
					strokeLinecap="round"
					fill="none"
					opacity="0.5"
				/>
			</g>

			{/* Branch 3 - Cerebral artery */}
			<g style={{ transition: "opacity 0.5s ease 0.4s" }} opacity={vesselOpacity.branch3}>
				<path
					d="M50 420
					   C30 450 20 480 25 520
					   S35 560 60 590
					   S90 620 100 660"
					stroke="url(#vesselGradient)"
					strokeWidth="10"
					strokeLinecap="round"
					fill="none"
				/>
			</g>

			{/* Catheter navigation path - highlighted when active */}
			{progress > 0.1 && (
				<path
					d="M200 0
					   C200 100 180 150 180 200
					   C140 220 100 240 70 300
					   S40 380 50 440
					   S60 520 60 590"
					stroke="url(#activeVessel)"
					strokeWidth="4"
					strokeLinecap="round"
					fill="none"
					filter="url(#vesselGlow)"
					opacity={progress * 0.8}
					strokeDasharray="10 5"
					style={{
						animation: progress > 0.3 ? "flow 2s linear infinite" : undefined,
					}}
				/>
			)}

			{/* Target blockage area */}
			<g style={{ transition: "opacity 0.8s ease 0.5s" }} opacity={vesselOpacity.target}>
				<ellipse cx="60" cy="590" rx="20" ry="15" fill="url(#blockageGradient)" />
				{/* Blockage indicator */}
				<circle
					cx="60"
					cy="590"
					r="8"
					fill="var(--color-accent)"
					opacity="0.6"
					className={progress > 0.6 ? "animate-pulse" : ""}
				/>
			</g>

			{/* Blood flow particles */}
			{progress > 0.2 && (
				<g opacity={Math.min(progress, 0.8)}>
					{/* Particle 1 */}
					<circle
						cx={180 - Math.sin(particleOffset * 0.05) * 5}
						cy={100 + particleOffset * 3}
						r="3"
						fill="url(#bloodParticle)"
					/>
					{/* Particle 2 */}
					<circle
						cx={180 - Math.sin((particleOffset + 30) * 0.05) * 5}
						cy={100 + ((particleOffset + 30) % 100) * 3}
						r="2"
						fill="url(#bloodParticle)"
					/>
					{/* Particle 3 */}
					<circle
						cx={180 - Math.sin((particleOffset + 60) * 0.05) * 5}
						cy={100 + ((particleOffset + 60) % 100) * 3}
						r="2.5"
						fill="url(#bloodParticle)"
					/>
				</g>
			)}

			{/* Treatment success effect */}
			{progress > 0.85 && (
				<g>
					<circle
						cx="60"
						cy="590"
						r="30"
						fill="none"
						stroke="var(--color-primary)"
						strokeWidth="2"
						opacity={Math.min((progress - 0.85) * 6, 1)}
						style={{
							transform: `scale(${1 + (progress - 0.85) * 3})`,
							transformOrigin: "60px 590px",
							transition: "transform 0.5s ease-out",
						}}
					/>
					<circle
						cx="60"
						cy="590"
						r="20"
						fill="var(--color-primary)"
						opacity={Math.min((progress - 0.9) * 5, 0.3)}
					/>
				</g>
			)}

			<style>{`
				@keyframes flow {
					from { stroke-dashoffset: 0; }
					to { stroke-dashoffset: -30; }
				}
			`}</style>
		</svg>
	);
}
