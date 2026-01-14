"use client";

import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

// Dynamically import 3D scene to avoid SSR issues with Three.js
const VascularScene3D = dynamic(
	() => import("./VascularScene3D").then((mod) => mod.VascularScene3D),
	{
		ssr: false,
		loading: () => (
			<div className="h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-r-transparent" />
					<p className="mt-4 text-sm text-text-muted">Loading 3D experience...</p>
				</div>
			</div>
		),
	},
);

export function Hero() {
	const t = useTranslations("Home.hero");
	const locale = useLocale();
	const [shouldLoad3D, setShouldLoad3D] = useState(false);
	const triggerRef = useRef<HTMLDivElement>(null);

	// Load Three.js only when user scrolls near the 3D section
	useEffect(() => {
		const trigger = triggerRef.current;
		if (!trigger) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setShouldLoad3D(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }, // Start loading 200px before visible
		);

		observer.observe(trigger);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<section className="relative min-h-screen overflow-hidden">
				{/* Background Layer */}
				<div className="absolute inset-0">
					{/* Gradient Mesh */}
					<div className="mesh-gradient" />

					{/* Subtle grid pattern */}
					<div className="absolute inset-0 pattern-grid opacity-50" />

					{/* Medical-inspired geometric accent */}
					<div className="absolute top-1/4 right-0 w-[600px] h-[600px] opacity-[0.03]">
						<svg viewBox="0 0 400 400" fill="none" className="w-full h-full" aria-hidden="true">
							<circle
								cx="200"
								cy="200"
								r="180"
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-primary"
							/>
							<circle
								cx="200"
								cy="200"
								r="140"
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-secondary"
							/>
							<circle
								cx="200"
								cy="200"
								r="100"
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-text"
							/>
							<line
								x1="200"
								y1="0"
								x2="200"
								y2="400"
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-text"
							/>
							<line
								x1="0"
								y1="200"
								x2="400"
								y2="200"
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-text"
							/>
						</svg>
					</div>
				</div>

				{/* Main Content */}
				<div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6 lg:px-8">
					<div className="text-center">
						{/* Text Content */}
						<div className="mx-auto max-w-3xl">
							{/* Status Badge */}
							<div className="reveal mb-8">
								<div className="badge badge-glow">
									<span className="live-dot" />
									<span>{t("tagline")}</span>
								</div>
							</div>

							{/* Main Headline */}
							<h1 className="reveal reveal-delay-1 font-display text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl">
								<span className="text-balance">{t("title")}</span>
								<br />
								<span className="text-gradient">{t("titleHighlight")}</span>
							</h1>

							{/* Description */}
							<p className="reveal reveal-delay-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg md:text-xl">
								{t("description")}
							</p>

							{/* CTA Buttons */}
							<div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
								<Link href="/technology" className="btn btn-primary btn-lg">
									<span>{t("cta")}</span>
									<svg
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</Link>
								<Link href="/team" className="btn btn-secondary btn-lg">
									<span>{t("ctaSecondary")}</span>
								</Link>
							</div>

							{/* Trust Indicators */}
							<div className="reveal reveal-delay-4 mt-16">
								<p className="mb-4 text-xs font-medium uppercase tracking-wider text-text-subtle">
									{locale === "en" ? "Expertise from" : "Expertise de"}
								</p>
								<div className="flex flex-wrap items-center justify-center gap-3">
									{["MIT", "Harvard", "Lyon"].map((inst, index) => (
										<div
											key={inst}
											className="group flex items-center gap-2.5 rounded-lg border border-border bg-bg-card/50 px-4 py-2.5 transition-all duration-300 hover:border-border-hover hover:bg-bg-card"
											style={{ animationDelay: `${0.5 + index * 0.1}s` }}
										>
											<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform group-hover:scale-125" />
											<span className="text-sm font-medium text-text-muted">{inst}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-10">
					<div className="flex flex-col items-center gap-2">
						<span className="text-[10px] font-medium uppercase tracking-widest text-text-subtle">
							{locale === "en" ? "Scroll" : "Défiler"}
						</span>
						<div className="flex h-10 w-5 justify-center rounded-full border border-border/50 pt-1.5">
							<div className="h-2 w-2 rounded-full bg-primary animate-scroll-dot" />
						</div>
					</div>
				</div>
			</section>

			{/* Trigger point for lazy loading 3D scene */}
			<div ref={triggerRef} className="h-1" aria-hidden="true" />

			{/* 3D Vascular Journey - Scroll-based animation (lazy loaded) */}
			{shouldLoad3D && <VascularScene3D />}
		</>
	);
}
