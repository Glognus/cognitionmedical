"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function CTASection() {
	const t = useTranslations("Home.cta");
	const pathname = usePathname();
	const locale = pathname.split("/")[1] || "en";

	return (
		<section className="relative py-24 sm:py-32 overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0">
				{/* Gradient Mesh */}
				<div className="mesh-gradient opacity-50" />

				{/* Pattern */}
				<div className="absolute inset-0 pattern-dots" />
			</div>

			{/* Border Lines */}
			<div className="section-divider absolute top-0 inset-x-0" />
			<div className="section-divider absolute bottom-0 inset-x-0" />

			<div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
				{/* Icon */}
				<div className="mb-8 flex justify-center">
					<div className="relative">
						{/* Glow */}
						<div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl" />

						{/* Icon Container */}
						<div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-bg-card">
							<svg
								className="h-7 w-7 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Heading */}
				<h2 className="font-display text-3xl font-bold text-text sm:text-4xl lg:text-5xl text-balance">
					{t("title")}
				</h2>

				{/* Description */}
				<p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg">
					{t("description")}
				</p>

				{/* CTA Button */}
				<div className="mt-10">
					<Link
						href={`/${locale}/contact`}
						className="btn btn-primary btn-lg"
					>
						<span>{t("button")}</span>
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

				{/* Trust Note */}
				<p className="mt-8 text-xs text-text-subtle">
					{locale === "en"
						? "Typically respond within 24-48 hours"
						: "Nous répondons généralement sous 24-48 heures"}
				</p>
			</div>
		</section>
	);
}
