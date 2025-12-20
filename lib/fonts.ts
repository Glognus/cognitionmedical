import { DM_Sans, Outfit } from "next/font/google";

export const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
	weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});
