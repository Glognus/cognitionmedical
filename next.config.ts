import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "host",
						value: "www.cognitionmedical.com",
					},
				],
				destination: "https://cognitionmedical.com/:path*",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},
};

export default withNextIntl(nextConfig);
