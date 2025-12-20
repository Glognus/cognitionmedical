"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
	if (theme === "system") {
		return getSystemTheme();
	}
	return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
	const [mounted, setMounted] = useState(false);

	// Initialize theme from localStorage
	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		const initialTheme = stored || "system";
		setThemeState(initialTheme);
		setResolvedTheme(resolveTheme(initialTheme));
		setMounted(true);
	}, []);

	// Apply theme to document
	useEffect(() => {
		if (!mounted) return;

		const resolved = resolveTheme(theme);
		setResolvedTheme(resolved);
		document.documentElement.setAttribute("data-theme", resolved);
		localStorage.setItem("theme", theme);
	}, [theme, mounted]);

	// Listen for system theme changes when in system mode
	useEffect(() => {
		if (!mounted || theme !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			const newTheme = e.matches ? "dark" : "light";
			setResolvedTheme(newTheme);
			document.documentElement.setAttribute("data-theme", newTheme);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme, mounted]);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
	}, []);

	// Prevent flash by not rendering until mounted
	if (!mounted) {
		return null;
	}

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
