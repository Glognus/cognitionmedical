"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Header() {
	const t = useTranslations("Navigation");
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	const locale = pathname.split("/")[1] || "en";

	const navItems = [
		{ href: `/${locale}`, label: t("home") },
		{ href: `/${locale}/technology`, label: t("technology") },
		{ href: `/${locale}/about`, label: t("about") },
		{ href: `/${locale}/team`, label: t("team") },
		{ href: `/${locale}/contact`, label: t("contact") },
	];

	const isActive = (href: string) => {
		if (href === `/${locale}`) {
			return pathname === `/${locale}` || pathname === `/${locale}/`;
		}
		return pathname.startsWith(href);
	};

	return (
		<>
			<header
				className={cn(
					"fixed top-0 left-0 right-0 z-50 transition-all duration-500",
					isScrolled ? "glass-strong py-3" : "py-5",
				)}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<nav className="flex items-center justify-between">
						{/* Logo */}
						<Link
							href={`/${locale}`}
							className="group relative"
							aria-label="Cognition Medical Home"
						>
							<div className="relative">
								{/* Glow effect */}
								<div className="absolute -inset-2 rounded-xl bg-primary/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
								<Logo size="md" />
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden items-center lg:flex">
							{/* Nav Links */}
							<div className="flex items-center rounded-full border border-border bg-bg-card/50 p-1">
								{navItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											"relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
											isActive(item.href)
												? "text-bg bg-primary"
												: "text-text-muted hover:text-text hover:bg-bg-hover",
										)}
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>

						{/* Right Side Actions */}
						<div className="flex items-center gap-3">
							{/* Theme Toggle - Desktop */}
							<div className="hidden sm:block">
								<ThemeToggle />
							</div>

							{/* Language Switcher - Desktop */}
							<div className="hidden sm:block">
								<LanguageSwitcher />
							</div>

							{/* CTA Button - Desktop */}
							<Link href={`/${locale}/contact`} className="btn btn-primary btn-sm hidden lg:flex">
								<span>{t("getInTouch")}</span>
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

							{/* Mobile Menu Button */}
							<button
								type="button"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className={cn(
									"relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-300 lg:hidden",
									isMobileMenuOpen ? "border-primary/30 bg-bg-card" : "border-border bg-bg-card/80",
								)}
								aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
								aria-expanded={isMobileMenuOpen}
							>
								<span
									className={cn(
										"h-0.5 w-5 rounded-full bg-text transition-all duration-300",
										isMobileMenuOpen && "translate-y-2 rotate-45",
									)}
								/>
								<span
									className={cn(
										"h-0.5 w-5 rounded-full bg-text transition-all duration-300",
										isMobileMenuOpen && "opacity-0 scale-0",
									)}
								/>
								<span
									className={cn(
										"h-0.5 w-5 rounded-full bg-text transition-all duration-300",
										isMobileMenuOpen && "-translate-y-2 -rotate-45",
									)}
								/>
							</button>
						</div>
					</nav>
				</div>
			</header>

			{/* Mobile Menu Overlay */}
			<div
				className={cn(
					"fixed inset-0 z-40 lg:hidden transition-all duration-500",
					isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
				)}
			>
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-bg/98 backdrop-blur-2xl"
					onClick={() => setIsMobileMenuOpen(false)}
					onKeyDown={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
					aria-hidden="true"
				/>

				{/* Menu Content */}
				<div className="relative flex h-full flex-col px-6 pt-24 pb-8">
					{/* Navigation Links */}
					<nav className="flex-1">
						<ul className="space-y-1">
							{navItems.map((item, index) => (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setIsMobileMenuOpen(false)}
										className={cn(
											"group flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300",
											isActive(item.href) ? "bg-primary/10" : "hover:bg-bg-card",
										)}
										style={{
											transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
											transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-20px)",
											opacity: isMobileMenuOpen ? 1 : 0,
										}}
									>
										{/* Active Indicator */}
										<span
											className={cn(
												"h-2 w-2 rounded-full transition-colors",
												isActive(item.href) ? "bg-primary" : "bg-border",
											)}
										/>
										<span
											className={cn(
												"font-display text-2xl font-semibold transition-colors",
												isActive(item.href)
													? "text-primary"
													: "text-text-muted group-hover:text-text",
											)}
										>
											{item.label}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Bottom Section */}
					<div
						className="space-y-4 border-t border-border pt-6"
						style={{
							transitionDelay: isMobileMenuOpen ? "300ms" : "0ms",
							transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
							opacity: isMobileMenuOpen ? 1 : 0,
							transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
						}}
					>
						{/* Theme & Language - Mobile */}
						<div className="flex items-center gap-3 rounded-xl bg-bg-card p-4">
							<div className="flex flex-1 items-center justify-between">
								<span className="text-sm text-text-muted">
									{locale === "en" ? "Theme" : "Theme"}
								</span>
								<ThemeToggle />
							</div>
							<div className="h-6 w-px bg-border" />
							<div className="flex flex-1 items-center justify-between">
								<span className="text-sm text-text-muted">
									{locale === "en" ? "Language" : "Langue"}
								</span>
								<LanguageSwitcher />
							</div>
						</div>

						{/* CTA Button - Mobile */}
						<Link
							href={`/${locale}/contact`}
							onClick={() => setIsMobileMenuOpen(false)}
							className="btn btn-primary btn-lg w-full"
						>
							<span>{t("getInTouch")}</span>
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
			</div>
		</>
	);
}
