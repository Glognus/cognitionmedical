import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Technology" });

	return {
		title: t("hero.tagline"),
		description: t("hero.description"),
	};
}

const approachItems = [
	{
		key: "research",
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
					d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
				/>
			</svg>
		),
	},
	{
		key: "design",
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
	},
	{
		key: "testing",
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
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
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
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
	},
];

const productAreas = [
	{
		key: "navigation",
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
				/>
			</svg>
		),
		color: "primary" as const,
	},
	{
		key: "aspiration",
		icon: (
			<svg
				className="h-8 w-8"
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
];

const colorStyles = {
	primary: {
		icon: "icon-box-primary",
		gradient: "from-primary/10",
		border: "group-hover:border-primary/30",
	},
	secondary: {
		icon: "icon-box-secondary",
		gradient: "from-secondary/10",
		border: "group-hover:border-secondary/30",
	},
	accent: {
		icon: "icon-box-accent",
		gradient: "from-accent/10",
		border: "group-hover:border-accent/30",
	},
};

export default async function TechnologyPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("Technology");

	return (
		<>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24">
				{/* Background */}
				<div className="absolute inset-0">
					<div className="mesh-gradient" />
					<div className="absolute inset-0 pattern-grid opacity-50" />
				</div>

				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl">
						<div className="reveal badge badge-glow">
							<span className="live-dot" />
							<span>{t("hero.tagline")}</span>
						</div>
						<h1 className="reveal reveal-delay-1 mt-6 font-display text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl">
							{t("hero.title")}{" "}
							<span className="text-gradient">{t("hero.titleHighlight")}</span>
						</h1>
						<p className="reveal reveal-delay-2 mt-6 max-w-2xl text-base text-text-muted leading-relaxed sm:text-lg">
							{t("hero.description")}
						</p>
					</div>
				</div>
			</section>

			{/* Product Focus Section */}
			<section className="relative py-20 sm:py-28">
				<div className="section-divider absolute top-0 inset-x-0" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
							{t("products.title")}
						</h2>
						<p className="mt-4 text-base text-text-muted sm:text-lg">
							{t("products.subtitle")}
						</p>
					</div>

					<div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2">
						{productAreas.map((product) => (
							<div
								key={product.key}
								className={`card card-accent-bottom group relative overflow-hidden p-6 sm:p-8 lg:p-10 ${colorStyles[product.color].border}`}
							>
								{/* Background gradient on hover */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${colorStyles[product.color].gradient} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
								/>

								{/* Icon */}
								<div
									className={`relative icon-box h-16 w-16 ${colorStyles[product.color].icon}`}
								>
									{product.icon}
								</div>

								{/* Content */}
								<h3 className="relative mt-6 font-display text-xl font-bold text-text sm:text-2xl">
									{t(`products.items.${product.key}.title`)}
								</h3>
								<p className="relative mt-4 text-sm text-text-muted leading-relaxed sm:text-base">
									{t(`products.items.${product.key}.description`)}
								</p>

								{/* Feature list */}
								<ul className="relative mt-6 space-y-3">
									{[1, 2, 3].map((i) => (
										<li
											key={i}
											className="flex items-center gap-3 text-sm text-text-muted"
										>
											<span
												className={`h-1.5 w-1.5 rounded-full ${
													product.color === "primary"
														? "bg-primary"
														: "bg-secondary"
												}`}
											/>
											{t(`products.items.${product.key}.feature${i}`)}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Approach Section */}
			<section className="relative py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
							{t("approach.title")}
						</h2>
						<p className="mt-4 text-base text-text-muted sm:text-lg">
							{t("approach.subtitle")}
						</p>
					</div>

					<div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
						{approachItems.map((item, index) => (
							<div key={item.key} className="group relative pt-3 pl-3">
								{/* Connector line */}
								{index < approachItems.length - 1 && (
									<div className="absolute top-11 left-full hidden h-px w-full bg-gradient-to-r from-primary/30 to-transparent lg:block" />
								)}

								<div className="card card-accent-bottom relative h-full flex flex-col p-5 sm:p-6 transition-all duration-300 group-hover:border-primary/30">
									{/* Step number */}
									<div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-bg shadow-lg shadow-primary/30">
										{index + 1}
									</div>

									<div className="icon-box icon-box-primary h-12 w-12">
										{item.icon}
									</div>

									<h3 className="mt-4 font-display text-base font-semibold text-text sm:text-lg">
										{t(`approach.items.${item.key}.title`)}
									</h3>
									<p className="mt-2 flex-grow text-sm text-text-muted leading-relaxed">
										{t(`approach.items.${item.key}.description`)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Focus Areas */}
			<section className="relative py-20 sm:py-28">
				<div className="section-divider absolute top-0 inset-x-0" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-display text-2xl font-bold text-text sm:text-3xl lg:text-4xl">
							{t("focus.title")}
						</h2>
						<p className="mt-4 text-base text-text-muted sm:text-lg">
							{t("focus.subtitle")}
						</p>
					</div>

					<div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2">
						{/* Stroke Card */}
						<div className="card card-accent-bottom group relative overflow-hidden p-6 sm:p-8 lg:p-10 group-hover:border-accent/30">
							<div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-all duration-500 group-hover:bg-accent/20" />
							<div className="relative">
								<div className="icon-box icon-box-accent h-14 w-14">
									<svg
										className="h-7 w-7"
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
								</div>
								<h3 className="mt-6 font-display text-xl font-bold text-text sm:text-2xl">
									{t("focus.stroke.title")}
								</h3>
								<p className="mt-4 text-sm text-text-muted leading-relaxed sm:text-base">
									{t("focus.stroke.description")}
								</p>
							</div>
						</div>

						{/* Access Card */}
						<div className="card card-accent-bottom group relative overflow-hidden p-6 sm:p-8 lg:p-10 group-hover:border-secondary/30">
							<div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-secondary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
							<div className="relative">
								<div className="icon-box icon-box-secondary h-14 w-14">
									<svg
										className="h-7 w-7"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
										/>
									</svg>
								</div>
								<h3 className="mt-6 font-display text-xl font-bold text-text sm:text-2xl">
									{t("focus.access.title")}
								</h3>
								<p className="mt-4 text-sm text-text-muted leading-relaxed sm:text-base">
									{t("focus.access.description")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative py-24 sm:py-32 overflow-hidden">
				<div className="absolute inset-0">
					<div className="mesh-gradient opacity-50" />
					<div className="absolute inset-0 pattern-dots" />
				</div>
				<div className="section-divider absolute top-0 inset-x-0" />
				<div className="section-divider absolute bottom-0 inset-x-0" />

				<div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="font-display text-3xl font-bold text-text sm:text-4xl lg:text-5xl text-balance">
						{t("cta.title")}
					</h2>
					<p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg">
						{t("cta.description")}
					</p>

					<div className="mt-10">
						<Link
							href={`/${locale}/contact`}
							className="btn btn-primary btn-lg"
						>
							<span>{t("cta.button")}</span>
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
			</section>
		</>
	);
}
