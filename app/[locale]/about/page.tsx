import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "About" });

	return {
		title: t("hero.tagline"),
		description: t("hero.description"),
	};
}

const values = [
	{
		key: "excellence",
		icon: (
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
					d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
				/>
			</svg>
		),
		color: "primary" as const,
	},
	{
		key: "innovation",
		icon: (
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
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
		),
		color: "secondary" as const,
	},
	{
		key: "collaboration",
		icon: (
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
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		),
		color: "accent" as const,
	},
	{
		key: "impact",
		icon: (
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
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/>
			</svg>
		),
		color: "primary" as const,
	},
];

const institutions = [
	{ key: "mit", abbr: "MIT" },
	{ key: "harvard", abbr: "HMS" },
	{ key: "brigham", abbr: "BWH" },
	{ key: "lyon", abbr: "UL" },
];

const colorStyles = {
	primary: {
		icon: "icon-box-primary",
		gradient: "from-primary/10",
		line: "bg-primary",
		border: "group-hover:border-primary/30",
	},
	secondary: {
		icon: "icon-box-secondary",
		gradient: "from-secondary/10",
		line: "bg-secondary",
		border: "group-hover:border-secondary/30",
	},
	accent: {
		icon: "icon-box-accent",
		gradient: "from-accent/10",
		line: "bg-accent",
		border: "group-hover:border-accent/30",
	},
};

export default async function AboutPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("About");

	return (
		<>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
				{/* Background */}
				<div className="absolute inset-0">
					<div className="mesh-gradient" />
					<div className="absolute inset-0 pattern-dots" />
				</div>

				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl">
						<div className="reveal badge">
							<span>{t("hero.tagline")}</span>
						</div>
						<h1 className="reveal reveal-delay-1 mt-6 font-display text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl">
							{t("hero.title")} <span className="text-gradient">{t("hero.titleHighlight")}</span>
						</h1>
						<p className="reveal reveal-delay-2 mt-6 max-w-2xl text-base text-text-muted leading-relaxed sm:text-lg">
							{t("hero.description")}
						</p>
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="relative py-16 sm:py-20">
				<div className="section-divider absolute top-0 inset-x-0" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="card relative overflow-hidden p-8 sm:p-12 lg:p-16">
						{/* Decorative gradient */}
						<div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 rounded-full bg-primary/10 blur-3xl" />
						<div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 rounded-full bg-secondary/10 blur-3xl" />

						<div className="relative mx-auto max-w-3xl text-center">
							<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
								<svg
									className="h-4 w-4 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
								<span className="text-sm font-medium text-primary">{t("mission.label")}</span>
							</div>
							<h2 className="mt-6 font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl text-balance">
								{t("mission.title")}
							</h2>
							<p className="mt-6 text-base text-text-muted leading-relaxed sm:text-lg">
								{t("mission.description")}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Vision Section */}
			<section className="relative py-16 sm:py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
						{/* Left content */}
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2">
								<svg
									className="h-4 w-4 text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								<span className="text-sm font-medium text-secondary">{t("vision.label")}</span>
							</div>
							<h2 className="mt-6 font-display text-2xl font-bold text-text sm:text-3xl">
								{t("vision.title")}
							</h2>
							<p className="mt-6 text-base text-text-muted leading-relaxed sm:text-lg">
								{t("vision.description")}
							</p>

							<div className="mt-8">
								<Link href={`/${locale}/team`} className="btn btn-secondary">
									<span>{t("vision.cta")}</span>
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
							</div>
						</div>

						{/* Right visual */}
						<div className="card relative overflow-hidden p-6 sm:p-8">
							{/* Decorative elements */}
							<div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

							{/* Stats grid */}
							<div className="relative grid grid-cols-2 gap-6">
								<div className="text-center">
									<div className="font-display text-3xl font-bold text-primary sm:text-4xl">
										MIT
									</div>
									<div className="mt-2 text-sm text-text-muted">{t("vision.stats.mit")}</div>
								</div>
								<div className="text-center">
									<div className="font-display text-3xl font-bold text-secondary sm:text-4xl">
										HMS
									</div>
									<div className="mt-2 text-sm text-text-muted">{t("vision.stats.harvard")}</div>
								</div>
								<div className="text-center">
									<div className="font-display text-3xl font-bold text-accent sm:text-4xl">7+</div>
									<div className="mt-2 text-sm text-text-muted">{t("vision.stats.experts")}</div>
								</div>
								<div className="text-center">
									<div className="font-display text-3xl font-bold text-text sm:text-4xl">50+</div>
									<div className="mt-2 text-sm text-text-muted">{t("vision.stats.years")}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="relative py-16 sm:py-20">
				<div className="section-divider absolute top-0 inset-x-0" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
							{t("values.title")}
						</h2>
						<p className="mt-4 text-base text-text-muted sm:text-lg">{t("values.subtitle")}</p>
					</div>

					<div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
						{values.map((value, index) => (
							<div
								key={value.key}
								className={`card card-accent-bottom group relative overflow-hidden p-5 sm:p-6 ${colorStyles[value.color].border}`}
							>
								{/* Background gradient on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${colorStyles[value.color].gradient} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
								/>

								{/* Number indicator */}
								<div className="absolute top-4 right-4 font-display text-4xl font-bold text-text/5">
									0{index + 1}
								</div>

								<div className={`relative icon-box h-12 w-12 ${colorStyles[value.color].icon}`}>
									{value.icon}
								</div>
								<h3 className="relative mt-4 font-display text-base font-semibold text-text sm:text-lg">
									{t(`values.items.${value.key}.title`)}
								</h3>
								<p className="relative mt-2 text-sm text-text-muted leading-relaxed">
									{t(`values.items.${value.key}.description`)}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Institutions Section */}
			<section className="relative py-16 sm:py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
							{t("institutions.title")}
						</h2>
						<p className="mt-4 text-base text-text-muted sm:text-lg">
							{t("institutions.subtitle")}
						</p>
					</div>

					<div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 md:grid-cols-4 sm:gap-6">
						{institutions.map((inst) => (
							<div
								key={inst.key}
								className="card card-interactive group flex flex-col items-center justify-center p-6 sm:p-8"
							>
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
									<span className="font-display text-xl font-bold text-text">{inst.abbr}</span>
								</div>
								<p className="mt-4 text-center text-sm font-medium text-text-muted">
									{t(`institutions.${inst.key}`)}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
