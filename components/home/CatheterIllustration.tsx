"use client";

import { cn } from "@/lib/utils";

interface CatheterIllustrationProps {
	className?: string;
	progress?: number; // 0-1 for animation progress
	glowing?: boolean;
}

export function CatheterIllustration({
	className,
	progress = 0,
	glowing = false,
}: CatheterIllustrationProps) {
	// Calculate stroke-dashoffset for draw-on animation
	const catheterLength = 200;
	const dashOffset = catheterLength * (1 - Math.min(progress * 1.2, 1));

	return (
		<svg
			viewBox="0 0 40 200"
			className={cn("w-full h-full", className)}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Neurovascular catheter"
		>
			<defs>
				{/* Catheter body gradient */}
				<linearGradient id="catheterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="var(--color-text-subtle)" />
					<stop offset="30%" stopColor="var(--color-text-muted)" />
					<stop offset="50%" stopColor="var(--color-text)" />
					<stop offset="70%" stopColor="var(--color-text-muted)" />
					<stop offset="100%" stopColor="var(--color-text-subtle)" />
				</linearGradient>

				{/* Tip glow gradient */}
				<radialGradient id="tipGlow" cx="50%" cy="0%" r="100%">
					<stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
					<stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.3" />
					<stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
				</radialGradient>

				{/* Marker gradient */}
				<linearGradient id="markerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.6" />
					<stop offset="50%" stopColor="var(--color-secondary)" />
					<stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.6" />
				</linearGradient>

				{/* Inner lumen gradient */}
				<linearGradient id="lumenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="transparent" />
					<stop offset="50%" stopColor="var(--color-bg)" stopOpacity="0.3" />
					<stop offset="100%" stopColor="transparent" />
				</linearGradient>

				{/* Glow filter */}
				<filter id="catheterGlow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="2" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* Tip glow effect (when active) */}
			{glowing && (
				<ellipse
					cx="20"
					cy="8"
					rx="12"
					ry="16"
					fill="url(#tipGlow)"
					className="animate-pulse"
					style={{ opacity: 0.6 + progress * 0.4 }}
				/>
			)}

			{/* Main catheter body - outer wall */}
			<path
				d="M16 195 L16 20 Q16 8 20 4 Q24 8 24 20 L24 195"
				stroke="url(#catheterGradient)"
				strokeWidth="2.5"
				strokeLinecap="round"
				fill="none"
				strokeDasharray={catheterLength}
				strokeDashoffset={dashOffset}
				style={{
					transition: "stroke-dashoffset 0.3s ease-out",
				}}
			/>

			{/* Inner lumen */}
			<path
				d="M18 190 L18 25 Q18 12 20 8 Q22 12 22 25 L22 190"
				stroke="url(#lumenGradient)"
				strokeWidth="1"
				fill="none"
				opacity={Math.min(progress * 1.5, 0.5)}
			/>

			{/* Radiopaque marker 1 - near tip */}
			<rect
				x="15.5"
				y="30"
				width="9"
				height="4"
				rx="1"
				fill="url(#markerGradient)"
				opacity={progress > 0.1 ? 1 : 0}
				style={{
					transition: "opacity 0.3s ease-out",
				}}
			/>

			{/* Radiopaque marker 2 */}
			<rect
				x="15.5"
				y="55"
				width="9"
				height="4"
				rx="1"
				fill="url(#markerGradient)"
				opacity={progress > 0.2 ? 1 : 0}
				style={{
					transition: "opacity 0.3s ease-out 0.1s",
				}}
			/>

			{/* Radiopaque marker 3 */}
			<rect
				x="15.5"
				y="80"
				width="9"
				height="4"
				rx="1"
				fill="url(#markerGradient)"
				opacity={progress > 0.3 ? 1 : 0}
				style={{
					transition: "opacity 0.3s ease-out 0.2s",
				}}
			/>

			{/* Catheter tip - beveled */}
			<path
				d="M17 20 Q17 6 20 2 Q23 6 23 20"
				stroke="var(--color-primary)"
				strokeWidth="2"
				fill="none"
				filter={glowing ? "url(#catheterGlow)" : undefined}
				opacity={progress > 0 ? 1 : 0.3}
				style={{
					transition: "opacity 0.3s ease-out",
				}}
			/>

			{/* Tip highlight */}
			<circle
				cx="20"
				cy="4"
				r="1.5"
				fill="var(--color-primary)"
				opacity={glowing ? 1 : 0.7}
				style={{
					filter: glowing ? "drop-shadow(0 0 4px var(--color-primary))" : undefined,
				}}
			/>

			{/* Hub section (bottom) */}
			<rect
				x="12"
				y="186"
				width="16"
				height="12"
				rx="2"
				fill="var(--color-text-subtle)"
				opacity={progress > 0.5 ? 0.6 : 0}
				style={{
					transition: "opacity 0.3s ease-out 0.3s",
				}}
			/>
		</svg>
	);
}
