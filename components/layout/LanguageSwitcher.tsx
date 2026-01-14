"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";

const localeNames: Record<string, string> = {
	en: "English",
	fr: "Français",
};

export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const currentLocale = useLocale();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLocale = e.target.value;
		router.replace(pathname, { locale: newLocale });
	};

	return (
		<div className="relative">
			<select
				value={currentLocale}
				onChange={handleChange}
				className="h-9 appearance-none rounded-lg border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text transition-all duration-200 hover:border-primary/50 hover:bg-bg-elevated focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
				aria-label="Select language"
			>
				{locales.map((locale) => (
					<option key={locale} value={locale}>
						{localeNames[locale]}
					</option>
				))}
			</select>
			<svg
				className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		</div>
	);
}
