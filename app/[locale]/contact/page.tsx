import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Contact" });

	return {
		title: t("hero.tagline"),
		description: t("hero.description"),
	};
}

export default async function ContactPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("Contact");

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
						<div className="reveal badge badge-glow">
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
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
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

			{/* Contact Section */}
			<section className="relative py-16 sm:py-20">
				<div className="section-divider absolute top-0 inset-x-0" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
						{/* Contact Form Card */}
						<div className="card overflow-hidden">
							<div className="border-b border-border bg-bg-elevated/50 px-6 py-5 sm:px-8 sm:py-6">
								<h2 className="font-display text-lg font-bold text-text sm:text-xl">
									{t("form.title")}
								</h2>
								<p className="mt-1 text-sm text-text-muted">{t("form.subtitle")}</p>
							</div>
							<div className="p-6 sm:p-8">
								<ContactForm />
							</div>
						</div>

						{/* Contact Info */}
						<div className="lg:pl-4">
							<h2 className="font-display text-xl font-bold text-text sm:text-2xl">
								{t("info.title")}
							</h2>

							<div className="mt-8 space-y-6">
								{/* Email */}
								<div className="flex items-start gap-4">
									<div className="icon-box icon-box-primary h-11 w-11 shrink-0">
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
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-sm font-medium text-text-subtle">
											{t("info.email.label")}
										</h3>
										<a
											href={`mailto:${t("info.email.value")}`}
											className="mt-1 text-base font-semibold text-text hover:text-primary transition-colors link-underline"
										>
											{t("info.email.value")}
										</a>
									</div>
								</div>

								{/* Address */}
								<div className="flex items-start gap-4">
									<div className="icon-box icon-box-secondary h-11 w-11 shrink-0">
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
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-sm font-medium text-text-subtle">
											{t("info.address.label")}
										</h3>
										<p className="mt-1 text-base font-semibold text-text whitespace-pre-line">
											{t("info.address.value")}
										</p>
									</div>
								</div>
							</div>

							{/* Company Card */}
							<div className="mt-10 card relative overflow-hidden p-6 sm:p-8">
								{/* Background glow */}
								<div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

								<div className="relative flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg-elevated">
										<svg
											viewBox="0 0 24 24"
											className="h-5 w-5"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
										>
											<circle cx="12" cy="4" r="2" className="fill-primary" />
											<circle cx="6" cy="12" r="1.5" className="fill-secondary" />
											<circle cx="18" cy="12" r="1.5" className="fill-secondary" />
											<circle cx="12" cy="20" r="2" className="fill-accent" />
											<circle cx="12" cy="12" r="2.5" className="fill-primary/80" />
											<path
												d="M12 6.5v3M12 14.5v3M8 11l1.5 1M14.5 12l1.5-1M8 13l1.5-1M14.5 12l1.5 1"
												className="stroke-text-subtle"
												strokeWidth="1"
												strokeLinecap="round"
											/>
										</svg>
									</div>
									<div>
										<span className="font-display text-lg font-bold text-text">Cognition</span>
										<span className="ml-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
											Medical
										</span>
									</div>
								</div>
								<p className="relative mt-4 text-sm text-text-muted">Cognition Medical Corp.</p>
								<p className="relative mt-1 text-sm text-text-subtle">{t("info.tagline")}</p>
							</div>

							{/* Response Time Card */}
							<div className="mt-4 card relative overflow-hidden p-5 sm:p-6">
								<div className="flex items-start gap-4">
									<div className="icon-box icon-box-accent h-10 w-10 shrink-0">
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
									</div>
									<div>
										<h3 className="font-medium text-text">{t("info.response.title")}</h3>
										<p className="mt-1 text-sm text-text-muted">{t("info.response.description")}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
