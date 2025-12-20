"use client";

import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const cycleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	return (
		<button
			type="button"
			onClick={cycleTheme}
			className={cn(
				"group relative flex h-9 w-9 items-center justify-center rounded-xl",
				"border border-border bg-bg-card/80 transition-all duration-300",
				"hover:border-primary/40 hover:bg-bg-hover",
			)}
			aria-label={`Current theme: ${theme}. Click to cycle.`}
			title={theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
		>
			{/* Sun Icon - Light mode */}
			<svg
				className={cn(
					"absolute h-4 w-4 transition-all duration-300",
					theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
				)}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>

			{/* Moon Icon - Dark mode */}
			<svg
				className={cn(
					"absolute h-4 w-4 transition-all duration-300",
					theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
				)}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>

			{/* System Icon - Auto mode */}
			<svg
				className={cn(
					"absolute h-4 w-4 transition-all duration-300",
					theme === "system" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
				)}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>

			{/* Glow effect */}
			<div
				className={cn(
					"absolute -inset-1 rounded-xl bg-primary/20 opacity-0 blur-lg transition-opacity duration-500",
					"group-hover:opacity-100",
				)}
			/>
		</button>
	);
}
