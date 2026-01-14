"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
	const t = useTranslations("Footer");
	const locale = useLocale();

	const navigation = {
		company: [
			{ name: t("about"), href: "/about" },
			{ name: t("team"), href: "/team" },
			{ name: t("technology"), href: "/technology" },
		],
		contact: [
			{
				name: "info@cognitionmedical.com",
				href: "mailto:info@cognitionmedical.com",
			},
			{ name: "Atlanta, GA", href: "/contact" },
		],
	};

	return (
		<footer className="relative border-t border-border">
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-t from-bg-elevated/50 to-transparent" />

			<div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
					{/* Brand Column */}
					<div className="lg:col-span-5">
						<Link
							href="/"
							className="group inline-block"
							aria-label="Cognition Medical Home"
						>
							<div className="relative">
								<div className="absolute -inset-2 rounded-xl bg-primary/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
								<Logo size="md" />
							</div>
						</Link>

						<p className="mt-6 max-w-sm text-sm leading-relaxed text-text-muted">
							{t("description")}
						</p>
					</div>

					{/* Navigation Columns */}
					<div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-3">
						{/* Company */}
						<div>
							<h3 className="text-xs font-semibold uppercase tracking-wider text-text">
								{t("companyTitle")}
							</h3>
							<ul className="mt-4 space-y-3">
								{navigation.company.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-text-muted transition-colors duration-200 hover:text-primary link-underline"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Contact */}
						<div>
							<h3 className="text-xs font-semibold uppercase tracking-wider text-text">
								{t("contactTitle")}
							</h3>
							<ul className="mt-4 space-y-3">
								{navigation.contact.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-text-muted transition-colors duration-200 hover:text-primary link-underline"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Newsletter or Social (Optional) */}
						<div className="col-span-2 lg:col-span-1">
							<h3 className="text-xs font-semibold uppercase tracking-wider text-text">
								{locale === "en" ? "Connect" : "Connecter"}
							</h3>
							<div className="mt-4">
								<Link
									href="/contact"
									className="btn btn-secondary btn-sm w-full lg:w-auto"
								>
									<span>{t("contactTitle")}</span>
									<svg
										className="h-4 w-4"
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
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
					<p className="text-xs text-text-subtle">
						&copy; {new Date().getFullYear()} Cognition Medical Corp. {t("rights")}
					</p>

					{/* Theme & Language */}
					<div className="flex items-center gap-4">
						<ThemeToggle />
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</footer>
	);
}
