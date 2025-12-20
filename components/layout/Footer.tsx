"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function Footer() {
	const t = useTranslations("Footer");
	const pathname = usePathname();
	const locale = pathname.split("/")[1] || "en";

	const navigation = {
		company: [
			{ name: t("about"), href: `/${locale}/about` },
			{ name: t("team"), href: `/${locale}/team` },
			{ name: t("technology"), href: `/${locale}/technology` },
		],
		contact: [
			{
				name: "info@cognitionmedical.com",
				href: "mailto:info@cognitionmedical.com",
			},
			{ name: "Atlanta, GA", href: `/${locale}/contact` },
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
							href={`/${locale}`}
							className="group inline-flex items-center gap-3"
							aria-label="Cognition Medical Home"
						>
							{/* Logo Mark */}
							<div className="relative">
								<div className="absolute -inset-2 rounded-xl bg-primary/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
								<div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-card transition-all duration-300 group-hover:border-primary/40">
									<svg
										viewBox="0 0 24 24"
										className="h-5 w-5"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<circle cx="12" cy="4" r="2" className="fill-primary" />
										<circle
											cx="6"
											cy="12"
											r="1.5"
											className="fill-secondary"
										/>
										<circle
											cx="18"
											cy="12"
											r="1.5"
											className="fill-secondary"
										/>
										<circle cx="12" cy="20" r="2" className="fill-accent" />
										<circle
											cx="12"
											cy="12"
											r="2.5"
											className="fill-primary/80"
										/>
										<path
											d="M12 6.5v3M12 14.5v3M8 11l1.5 1M14.5 12l1.5-1M8 13l1.5-1M14.5 12l1.5 1"
											className="stroke-text-subtle"
											strokeWidth="1"
											strokeLinecap="round"
										/>
									</svg>
								</div>
							</div>
							{/* Logo Text */}
							<div className="flex flex-col">
								<span className="font-display text-lg font-bold tracking-tight text-text">
									Cognition
								</span>
								<span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">
									Medical
								</span>
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
									href={`/${locale}/contact`}
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
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
					<p className="text-xs text-text-subtle">
						&copy; {new Date().getFullYear()} Cognition Medical Corp.{" "}
						{t("rights")}
					</p>
					<div className="flex items-center gap-6">
						<Link
							href={`/${locale}/privacy`}
							className="text-xs text-text-subtle transition-colors hover:text-text"
						>
							{t("privacy")}
						</Link>
						<Link
							href={`/${locale}/terms`}
							className="text-xs text-text-subtle transition-colors hover:text-text"
						>
							{t("terms")}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
