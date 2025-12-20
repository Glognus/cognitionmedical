import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cognitionmedical.com";

	const routes = ["", "/technology", "/about", "/team", "/contact"];

	const sitemap: MetadataRoute.Sitemap = [];

	for (const locale of routing.locales) {
		for (const route of routes) {
			sitemap.push({
				url: `${baseUrl}/${locale}${route}`,
				lastModified: new Date(),
				changeFrequency: route === "" ? "weekly" : "monthly",
				priority: route === "" ? 1 : 0.8,
			});
		}
	}

	return sitemap;
}
