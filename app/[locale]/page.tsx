import { setRequestLocale } from "next-intl/server";
import { CTASection } from "@/components/home/CTASection";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { ValueProposition } from "@/components/home/ValueProposition";

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Hero />
			<Stats />
			<ValueProposition />
			<CTASection />
		</>
	);
}
