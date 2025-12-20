"use client";

import { useTranslations } from "next-intl";

export function Stats() {
	const t = useTranslations("Home.stats");

	const stats = [
		{
			value: t("stroke.value"),
			label: t("stroke.label"),
			description: t("stroke.description"),
			color: "primary" as const,
			icon: (
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
						strokeWidth={1.5}
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			),
		},
		{
			value: t("time.value"),
			label: t("time.label"),
			description: t("time.description"),
			color: "secondary" as const,
			icon: (
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
						strokeWidth={1.5}
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
		},
		{
			value: t("survival.value"),
			label: t("survival.label"),
			description: t("survival.description"),
			color: "accent" as const,
			icon: (
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
						strokeWidth={1.5}
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			),
		},
	];

	const colorStyles = {
		primary: {
			icon: "bg-primary/10 text-primary",
			value: "text-primary",
			border: "group-hover:border-primary/30",
			glow: "bg-primary/5",
		},
		secondary: {
			icon: "bg-secondary/10 text-secondary",
			value: "text-secondary",
			border: "group-hover:border-secondary/30",
			glow: "bg-secondary/5",
		},
		accent: {
			icon: "bg-accent/10 text-accent",
			value: "text-accent",
			border: "group-hover:border-accent/30",
			glow: "bg-accent/5",
		},
	};

	return (
		<section className="relative py-20 sm:py-28">
			{/* Section Divider Top */}
			<div className="section-divider absolute top-0 inset-x-0" />

			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-b from-bg-elevated/30 via-transparent to-bg-elevated/30" />

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mb-12 text-center sm:mb-16">
					<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
						{t("title")}
					</h2>
					<div className="mx-auto mt-4 flex items-center justify-center gap-2">
						<div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
						<div className="h-1.5 w-1.5 rounded-full bg-primary" />
						<div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
					{stats.map((stat, index) => (
						<div
							key={stat.label}
							className={`card card-accent-bottom group relative overflow-hidden p-6 sm:p-8 ${colorStyles[stat.color].border}`}
							style={{
								animationDelay: `${index * 100}ms`,
							}}
						>
							{/* Hover Glow */}
							<div
								className={`absolute inset-0 ${colorStyles[stat.color].glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
							/>

							{/* Content */}
							<div className="relative">
								{/* Icon */}
								<div
									className={`icon-box h-10 w-10 ${colorStyles[stat.color].icon} mb-6`}
								>
									{stat.icon}
								</div>

								{/* Value */}
								<div
									className={`font-display text-4xl font-bold sm:text-5xl lg:text-6xl ${colorStyles[stat.color].value}`}
								>
									{stat.value}
								</div>

								{/* Label */}
								<h3 className="mt-3 font-display text-base font-semibold text-text sm:text-lg">
									{stat.label}
								</h3>

								{/* Description */}
								<p className="mt-2 text-sm leading-relaxed text-text-muted">
									{stat.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Section Divider Bottom */}
			<div className="section-divider absolute bottom-0 inset-x-0" />
		</section>
	);
}
