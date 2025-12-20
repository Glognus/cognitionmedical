import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Team" });

	return {
		title: t("hero.tagline"),
		description: t("hero.description"),
	};
}

const teamMembers = {
	founders: [
		{ key: "alexis", image: "/images/team/alexis-turjman.avif" },
		{ key: "francis", image: "/images/team/francis-turjman.avif" },
	],
	clinicalAdvisors: [
		{ key: "elad", image: "/images/team/elad-levy.avif" },
		{ key: "elazer", image: "/images/team/elazer-edelman.png" },
	],
	advisors: [
		{ key: "robert", image: "/images/team/robert-mellen.png" },
		{ key: "katharine", image: "/images/team/katharine-stohlman.jpg" },
	],
	legal: [{ key: "casey", image: "/images/team/casey-mcglynn.png" }],
};

const colorStyles = {
	primary: {
		ring: "group-hover:ring-primary/30",
		dot: "bg-primary",
		label: "text-primary",
	},
	secondary: {
		ring: "group-hover:ring-secondary/30",
		dot: "bg-secondary",
		label: "text-secondary",
	},
	accent: {
		ring: "group-hover:ring-accent/30",
		dot: "bg-accent",
		label: "text-accent",
	},
};

function TeamMemberCard({
	memberKey,
	image,
	t,
	color = "primary",
}: {
	memberKey: string;
	image: string;
	t: (key: string) => string;
	color?: "primary" | "secondary" | "accent";
}) {
	return (
		<div className="group">
			{/* Square Image with ring effect */}
			<div
				className={`relative aspect-square overflow-hidden rounded-xl bg-bg-elevated ring-1 ring-border transition-all duration-500 ${colorStyles[color].ring} group-hover:ring-2`}
			>
				<Image
					src={image}
					alt={t(`members.${memberKey}.name`)}
					fill
					className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
				/>
				{/* Subtle gradient overlay on hover */}
				<div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			</div>

			{/* Compact Content */}
			<div className="mt-2.5">
				<h3 className="font-display text-sm font-semibold text-text leading-tight">
					{t(`members.${memberKey}.name`)}
				</h3>
				<p className={`mt-0.5 text-[11px] font-medium ${colorStyles[color].label}`}>
					{t(`members.${memberKey}.role`)}
				</p>
				<p className="mt-1.5 text-xs text-text-muted leading-relaxed">
					{t(`members.${memberKey}.bio`)}
				</p>
				<p className="mt-1.5 text-[10px] text-text-subtle leading-relaxed">
					{t(`members.${memberKey}.credentials`)}
				</p>
			</div>
		</div>
	);
}

function TeamSection({
	title,
	members,
	t,
	color = "primary",
}: {
	title: string;
	members: { key: string; image: string }[];
	t: (key: string) => string;
	color?: "primary" | "secondary" | "accent";
}) {
	const gridCols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

	return (
		<div className="mt-12 first:mt-0 sm:mt-16">
			{/* Centered Section Header */}
			<div className="mb-6 flex items-center justify-center gap-4 sm:mb-8">
				<div className="h-px w-12 bg-gradient-to-r from-transparent to-border sm:w-20" />
				<h3 className="font-display text-xs font-semibold uppercase tracking-widest text-text-muted">
					{title}
				</h3>
				<div className="h-px w-12 bg-gradient-to-l from-transparent to-border sm:w-20" />
			</div>

			{/* Compact Grid */}
			<div className={`grid gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 ${gridCols}`}>
				{members.map((member) => (
					<TeamMemberCard
						key={member.key}
						memberKey={member.key}
						image={member.image}
						t={t}
						color={color}
					/>
				))}
			</div>
		</div>
	);
}

export default async function TeamPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("Team");

	return (
		<>
			{/* Compact Hero Section - Centered */}
			<section className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
				{/* Background */}
				<div className="absolute inset-0">
					<div className="mesh-gradient" />
					<div className="absolute inset-0 pattern-grid opacity-30" />
				</div>

				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<div className="reveal badge badge-glow inline-flex">
							<div className="live-dot" />
							<span>{t("hero.tagline")}</span>
						</div>
						<h1 className="reveal reveal-delay-1 mt-4 font-display text-3xl font-bold leading-[1.15] text-text sm:text-4xl lg:text-5xl">
							{t("hero.title")} <span className="text-gradient">{t("hero.titleHighlight")}</span>
						</h1>
						<p className="reveal reveal-delay-2 mx-auto mt-4 max-w-2xl text-sm text-text-muted leading-relaxed sm:text-base">
							{t("hero.description")}
						</p>
					</div>
				</div>
			</section>

			{/* Team Grid - Condensed */}
			<section className="relative pb-16 sm:pb-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{/* All team members in a more condensed layout */}
					<div className="space-y-0">
						<TeamSection
							title={t("sections.founders")}
							members={teamMembers.founders}
							t={t}
							color="primary"
							columns={2}
						/>
						<TeamSection
							title={t("sections.clinicalAdvisors")}
							members={teamMembers.clinicalAdvisors}
							t={t}
							color="secondary"
							columns={2}
						/>
						<TeamSection
							title={t("sections.advisors")}
							members={teamMembers.advisors}
							t={t}
							color="accent"
							columns={2}
						/>
						<TeamSection
							title={t("sections.legal")}
							members={teamMembers.legal}
							t={t}
							color="primary"
							columns={1}
						/>
					</div>
				</div>
			</section>
		</>
	);
}
