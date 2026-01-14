"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const currentLocale = useLocale();
	const otherLocale = currentLocale === "en" ? "fr" : "en";

	const handleSwitch = () => {
		router.replace(pathname, { locale: otherLocale });
	};

	return (
		<button
			type="button"
			onClick={handleSwitch}
			className="group relative flex h-9 items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-bg-elevated"
		>
			<span
				className={cn(
					"transition-colors duration-200",
					currentLocale === "en" ? "text-primary" : "text-text-subtle",
				)}
			>
				EN
			</span>
			<span className="text-text-subtle">/</span>
			<span
				className={cn(
					"transition-colors duration-200",
					currentLocale === "fr" ? "text-primary" : "text-text-subtle",
				)}
			>
				FR
			</span>
		</button>
	);
}
