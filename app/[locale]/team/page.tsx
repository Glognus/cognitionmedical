import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";

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
		gradient: "from-primary/20",
		dot: "bg-primary",
		border: "group-hover:border-primary/30",
	},
	secondary: {
		gradient: "from-secondary/20",
		dot: "bg-secondary",
		border: "group-hover:border-secondary/30",
	},
	accent: {
		gradient: "from-accent/20",
		dot: "bg-accent",
		border: "group-hover:border-accent/30",
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
		<div
			className={`card card-accent-bottom group relative overflow-hidden ${colorStyles[color].border}`}
		>
			{/* Image */}
			<div className="relative aspect-[4/5] overflow-hidden bg-bg-elevated">
				<Image
					src={image}
					alt={t(`members.${memberKey}.name`)}
					fill
					className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
				/>
				{/* Gradient overlay */}
				<div
					className={`absolute inset-0 bg-gradient-to-t ${colorStyles[color].gradient} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
				/>
				{/* Bottom fade */}
				<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-card to-transparent" />
			</div>

			{/* Content */}
			<div className="p-5 sm:p-6">
				<div className="flex items-center gap-2.5">
					<span className={`h-2 w-2 rounded-full ${colorStyles[color].dot}`} />
					<h3 className="font-display text-lg font-bold text-text sm:text-xl">
						{t(`members.${memberKey}.name`)}
					</h3>
				</div>
				<p className="mt-1 text-sm font-medium text-primary">
					{t(`members.${memberKey}.role`)}
				</p>
				<p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
					{t(`members.${memberKey}.bio`)}
				</p>
				<p className="mt-3 text-xs text-text-subtle">
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
	return (
		<div className="mt-16 first:mt-0 sm:mt-20">
			{/* Section Header */}
			<div className="mb-8 flex items-center gap-4 sm:mb-10">
				<div
					className={`h-px flex-1 bg-gradient-to-r from-transparent ${
						color === "primary"
							? "to-primary/20"
							: color === "secondary"
								? "to-secondary/20"
								: "to-accent/20"
					}`}
				/>
				<h3 className="font-display text-lg font-bold text-text sm:text-xl">
					{title}
				</h3>
				<div
					className={`h-px flex-1 bg-gradient-to-l from-transparent ${
						color === "primary"
							? "to-primary/20"
							: color === "secondary"
								? "to-secondary/20"
								: "to-accent/20"
					}`}
				/>
			</div>

			{/* Members Grid */}
			<div
				className={`grid gap-4 sm:gap-6 ${
					members.length === 1
						? "mx-auto max-w-sm"
						: members.length === 2
							? "sm:grid-cols-2 max-w-3xl mx-auto"
							: "sm:grid-cols-2 lg:grid-cols-3"
				}`}
			>
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
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
				{/* Background */}
				<div className="absolute inset-0">
					<div className="mesh-gradient" />
					<div className="absolute inset-0 pattern-grid opacity-50" />
				</div>

				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl">
						<div className="reveal badge">
							<span>{t("hero.tagline")}</span>
						</div>
						<h1 className="reveal reveal-delay-1 mt-6 font-display text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl">
							{t("hero.title")}{" "}
							<span className="text-gradient">{t("hero.titleHighlight")}</span>
						</h1>
						<p className="reveal reveal-delay-2 mt-6 max-w-2xl text-base text-text-muted leading-relaxed sm:text-lg">
							{t("hero.description")}
						</p>
					</div>
				</div>
			</section>

			{/* Team Sections */}
			<section className="relative py-16 sm:py-20">
				<div className="section-divider absolute top-0 inset-x-0" />

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<TeamSection
						title={t("sections.founders")}
						members={teamMembers.founders}
						t={t}
						color="primary"
					/>
					<TeamSection
						title={t("sections.clinicalAdvisors")}
						members={teamMembers.clinicalAdvisors}
						t={t}
						color="secondary"
					/>
					<TeamSection
						title={t("sections.advisors")}
						members={teamMembers.advisors}
						t={t}
						color="accent"
					/>
					<TeamSection
						title={t("sections.legal")}
						members={teamMembers.legal}
						t={t}
						color="primary"
					/>
				</div>
			</section>
		</>
	);
}
