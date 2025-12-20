"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();

	const currentLocale = pathname.split("/")[1] || "en";
	const otherLocale = currentLocale === "en" ? "fr" : "en";

	const handleSwitch = () => {
		const newPath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`);
		router.push(newPath);
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
					currentLocale === "en" ? "text-primary" : "text-text-subtle"
				)}
			>
				EN
			</span>
			<span className="text-text-subtle">/</span>
			<span
				className={cn(
					"transition-colors duration-200",
					currentLocale === "fr" ? "text-primary" : "text-text-subtle"
				)}
			>
				FR
			</span>
		</button>
	);
}
