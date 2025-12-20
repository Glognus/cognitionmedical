import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { outfit, dmSans } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme";
import "@/app/globals.css";

// FOUC prevention script - runs before React hydration
const themeScript = `
(function() {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme;
    if (stored === 'light') theme = 'light';
    else if (stored === 'dark') theme = 'dark';
    else theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export const metadata: Metadata = {
	title: {
		default: "Cognition Medical | Neurovascular Innovation",
		template: "%s | Cognition Medical",
	},
	description:
		"Cognition Medical develops cutting-edge interventional medical devices for neurovascular treatment. Our team of experts from MIT, Harvard, and leading medical institutions advances stroke care.",
	keywords: [
		"neurovascular",
		"stroke treatment",
		"medical devices",
		"interventional neuroradiology",
		"thrombectomy",
	],
	authors: [{ name: "Cognition Medical Corp." }],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://cognitionmedical.com",
		siteName: "Cognition Medical",
		title: "Cognition Medical | Neurovascular Innovation",
		description:
			"Developing cutting-edge interventional medical devices for neurovascular treatment and stroke care.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Cognition Medical | Neurovascular Innovation",
		description:
			"Developing cutting-edge interventional medical devices for neurovascular treatment and stroke care.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
		notFound();
	}

	setRequestLocale(locale);
	const messages = await getMessages();

	return (
		<html
			lang={locale}
			className={`${outfit.variable} ${dmSans.variable}`}
			suppressHydrationWarning
		>
			<head>
				<script
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
			</head>
			<body className="min-h-screen bg-bg antialiased">
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						<div className="relative flex min-h-screen flex-col">
							{/* Global gradient mesh background */}
							<div className="gradient-mesh fixed inset-0 -z-10" />
							<div className="noise fixed inset-0 -z-10" />
							<Header />
							<main className="flex-1">{children}</main>
							<Footer />
						</div>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
