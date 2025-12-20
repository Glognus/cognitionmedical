"use client";

import { useTranslations } from "next-intl";

const icons = {
	innovation: (
		<svg
			className="h-6 w-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
			/>
		</svg>
	),
	expertise: (
		<svg
			className="h-6 w-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
			/>
		</svg>
	),
	precision: (
		<svg
			className="h-6 w-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
			/>
		</svg>
	),
};

export function ValueProposition() {
	const t = useTranslations("Home.value");

	const items = [
		{
			key: "innovation" as const,
			icon: icons.innovation,
			color: "primary" as const,
		},
		{
			key: "expertise" as const,
			icon: icons.expertise,
			color: "secondary" as const,
		},
		{
			key: "precision" as const,
			icon: icons.precision,
			color: "accent" as const,
		},
	];

	const colorStyles = {
		primary: {
			icon: "icon-box-primary",
			gradient: "from-primary/10",
			line: "bg-primary",
			number: "text-primary/10",
		},
		secondary: {
			icon: "icon-box-secondary",
			gradient: "from-secondary/10",
			line: "bg-secondary",
			number: "text-secondary/10",
		},
		accent: {
			icon: "icon-box-accent",
			gradient: "from-accent/10",
			line: "bg-accent",
			number: "text-accent/10",
		},
	};

	return (
		<section className="relative py-20 sm:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 text-base text-text-muted sm:text-lg">{t("subtitle")}</p>
				</div>

				{/* Value Cards */}
				<div className="mt-14 grid gap-6 sm:mt-20 lg:grid-cols-3">
					{items.map((item, index) => (
						<div
							key={item.key}
							className="card card-accent-bottom group relative overflow-hidden p-6 sm:p-8"
						>
							{/* Background gradient on hover */}
							<div
								className={`absolute inset-0 bg-gradient-to-br ${colorStyles[item.color].gradient} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
							/>

							{/* Number indicator */}
							<div
								className={`absolute -top-2 right-2 sm:-top-4 sm:-right-2 font-display text-[80px] sm:text-[120px] font-bold leading-none ${colorStyles[item.color].number} select-none pointer-events-none`}
							>
								{index + 1}
							</div>

							{/* Icon */}
							<div className={`relative icon-box h-12 w-12 ${colorStyles[item.color].icon}`}>
								{item.icon}
							</div>

							{/* Content */}
							<h3 className="relative mt-6 font-display text-lg font-bold text-text sm:text-xl">
								{t(`items.${item.key}.title`)}
							</h3>
							<p className="relative mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
								{t(`items.${item.key}.description`)}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
