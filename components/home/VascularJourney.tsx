"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { VascularNetwork } from "./VascularNetwork";
import { CatheterPath } from "./CatheterPath";

interface ContentPanel {
	key: string;
	icon: React.ReactNode;
	color: "primary" | "secondary" | "accent";
}

const panels: ContentPanel[] = [
	{
		key: "problem",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
		),
		color: "accent",
	},
	{
		key: "solution",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
			</svg>
		),
		color: "primary",
	},
	{
		key: "technology",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
			</svg>
		),
		color: "secondary",
	},
	{
		key: "impact",
		icon: (
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
			</svg>
		),
		color: "primary",
	},
];

const colorStyles = {
	primary: {
		icon: "bg-primary/10 text-primary border-primary/20",
		badge: "bg-primary/10 text-primary border-primary/30",
		line: "bg-primary",
	},
	secondary: {
		icon: "bg-secondary/10 text-secondary border-secondary/20",
		badge: "bg-secondary/10 text-secondary border-secondary/30",
		line: "bg-secondary",
	},
	accent: {
		icon: "bg-accent/10 text-accent border-accent/20",
		badge: "bg-accent/10 text-accent border-accent/30",
		line: "bg-accent",
	},
};

export function VascularJourney() {
	const t = useTranslations("Home.journey");
	const containerRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	// Check for reduced motion preference
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	// Intersection observer for visibility
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 }
		);

		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	// Scroll progress calculation
	const handleScroll = useCallback(() => {
		if (!containerRef.current || !isVisible || prefersReducedMotion) return;

		const container = containerRef.current;
		const rect = container.getBoundingClientRect();
		const containerTop = rect.top;
		const containerHeight = rect.height;
		const viewportHeight = window.innerHeight;

		// Calculate progress based on how much of the container has scrolled past
		const scrolled = viewportHeight - containerTop;
		const totalScrollable = containerHeight + viewportHeight * 0.5;

		const newProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

		// Use requestAnimationFrame for smooth updates
		requestAnimationFrame(() => {
			setProgress(newProgress);
		});
	}, [isVisible, prefersReducedMotion]);

	useEffect(() => {
		if (!isVisible) return;

		// Throttle scroll handler
		let ticking = false;
		const scrollHandler = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", scrollHandler, { passive: true });
		handleScroll(); // Initial calculation

		return () => window.removeEventListener("scroll", scrollHandler);
	}, [isVisible, handleScroll]);

	// Calculate which panel is active
	const activePanel = Math.min(
		Math.floor(progress * panels.length),
		panels.length - 1
	);

	return (
		<section
			ref={containerRef}
			className="relative min-h-[300vh]"
			aria-label="Vascular journey animation"
		>
			{/* Sticky container for the animation */}
			<div className="sticky top-0 h-screen overflow-hidden">
				<div className="absolute inset-0 flex">
					{/* Left side - Vascular animation */}
					<div className="relative w-1/2 h-full flex items-center justify-center">
						{/* Background gradient */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg/50 to-bg" />

						{/* Vascular network SVG */}
						<div className="relative w-full max-w-md h-[80vh]">
							{/* Reduced motion fallback */}
							{prefersReducedMotion ? (
								<div className="flex items-center justify-center h-full">
									<div className="text-center p-8">
										<div className="icon-box icon-box-primary h-16 w-16 mx-auto mb-4">
											<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
											</svg>
										</div>
										<p className="text-text-muted text-sm">
											Neurovascular navigation technology
										</p>
									</div>
								</div>
							) : (
								<>
									<VascularNetwork
										className="absolute inset-0"
										progress={progress}
									/>
									<CatheterPath
										className="absolute inset-0"
										progress={progress}
									/>
								</>
							)}
						</div>
					</div>

					{/* Right side - Content panels */}
					<div className="w-1/2 h-full flex items-center">
						<div className="w-full max-w-lg px-8 lg:px-12">
							{panels.map((panel, index) => {
								const isActive = index === activePanel;
								const isPast = index < activePanel;
								const panelProgress = Math.max(
									0,
									Math.min(1, (progress - index * 0.25) * 4)
								);

								return (
									<div
										key={panel.key}
										className={cn(
											"relative mb-8 p-6 rounded-2xl border transition-all duration-500",
											isActive
												? "bg-bg-card border-border-hover scale-100 opacity-100"
												: isPast
													? "bg-bg-elevated/50 border-border scale-95 opacity-50"
													: "bg-transparent border-transparent scale-95 opacity-30"
										)}
										style={{
											transform: isActive
												? "translateY(0)"
												: isPast
													? "translateY(-8px)"
													: "translateY(8px)",
										}}
									>
										{/* Progress indicator line */}
										<div
											className={cn(
												"absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-500",
												colorStyles[panel.color].line
											)}
											style={{
												opacity: isActive ? 1 : 0.2,
												height: isActive ? `${panelProgress * 100}%` : "0%",
											}}
										/>

										{/* Icon */}
										<div
											className={cn(
												"inline-flex items-center justify-center h-12 w-12 rounded-xl border transition-all duration-300",
												colorStyles[panel.color].icon
											)}
										>
											{panel.icon}
										</div>

										{/* Content */}
										<h3 className="mt-4 font-display text-xl font-bold text-text">
											{t(`panels.${panel.key}.title`)}
										</h3>
										<p className="mt-2 text-sm text-text-muted leading-relaxed">
											{t(`panels.${panel.key}.description`)}
										</p>

										{/* Badge */}
										{isActive && (
											<div
												className={cn(
													"inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full border text-xs font-medium",
													colorStyles[panel.color].badge
												)}
											>
												<span className="live-dot" />
												<span>{t(`panels.${panel.key}.status`)}</span>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Progress indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
					{/* Progress bar */}
					<div className="w-32 h-1 rounded-full bg-border overflow-hidden">
						<div
							className="h-full bg-primary rounded-full transition-all duration-100"
							style={{ width: `${progress * 100}%` }}
						/>
					</div>
					{/* Percentage */}
					<span className="text-xs text-text-muted font-mono">
						{Math.round(progress * 100)}%
					</span>
				</div>

				{/* Scroll hint */}
				{progress < 0.1 && (
					<div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
						<span className="text-xs text-text-subtle">{t("scrollHint")}</span>
						<svg
							className="h-5 w-5 text-text-subtle"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</div>
				)}
			</div>
		</section>
	);
}
