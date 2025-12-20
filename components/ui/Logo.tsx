"use client";

import { useId } from "react";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg";
	showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
	const gradientId = useId();

	const sizeClasses = {
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-14 w-14",
	};

	const textSizes = {
		sm: { title: "text-base", subtitle: "text-[8px]" },
		md: { title: "text-lg", subtitle: "text-[9px]" },
		lg: { title: "text-xl", subtitle: "text-[10px]" },
	};

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			{/* Logo Mark - Circle with Arrow */}
			<div className="relative flex-shrink-0">
				<svg
					viewBox="0 0 100 100"
					className={sizeClasses[size]}
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#F97316" />
							<stop offset="50%" stopColor="#F06B7A" />
							<stop offset="100%" stopColor="#EC4899" />
						</linearGradient>
					</defs>
					{/* Circle with gradient */}
					<circle cx="50" cy="50" r="48" fill={`url(#${gradientId})`} />
				</svg>
			</div>

			{/* Logo Text */}
			{showText && (
				<div className="flex flex-col">
					<span
						className={`font-display font-bold tracking-tight text-text ${textSizes[size].title}`}
					>
						Cognition
					</span>
					<span
						className={`font-semibold uppercase tracking-[0.2em] text-primary ${textSizes[size].subtitle}`}
					>
						Medical
					</span>
				</div>
			)}
		</div>
	);
}

export function LogoIcon({ className = "" }: { className?: string }) {
	const gradientId = useId();

	return (
		<svg
			viewBox="0 0 100 100"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#F97316" />
					<stop offset="50%" stopColor="#F06B7A" />
					<stop offset="100%" stopColor="#EC4899" />
				</linearGradient>
			</defs>
			<circle cx="50" cy="50" r="48" fill={`url(#${gradientId})`} />
		</svg>
	);
}
