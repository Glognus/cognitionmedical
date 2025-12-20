"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ContactForm() {
	const t = useTranslations("Contact.form");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(false);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// For demo purposes, always succeed
		setIsSubmitting(false);
		setIsSuccess(true);
	};

	const handleReset = () => {
		setIsSuccess(false);
		setError(false);
	};

	if (isSuccess) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center">
				{/* Success Icon */}
				<div className="relative mb-6">
					<div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl" />
					<div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
						<svg
							className="h-8 w-8 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				</div>

				{/* Success Message */}
				<h3 className="font-display text-xl font-bold text-text">{t("success")}</h3>
				<p className="mt-2 max-w-sm text-sm text-text-muted">{t("successDescription")}</p>

				{/* Reset Button */}
				<button type="button" onClick={handleReset} className="btn btn-secondary btn-sm mt-6">
					{t("sendAnother") || "Send another message"}
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Name & Email Row */}
			<div className="grid gap-5 sm:grid-cols-2">
				{/* Name */}
				<div>
					<label htmlFor="name" className="input-label">
						{t("name")}
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						placeholder={t("namePlaceholder")}
						className="input"
						autoComplete="name"
					/>
				</div>

				{/* Email */}
				<div>
					<label htmlFor="email" className="input-label">
						{t("email")}
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						placeholder={t("emailPlaceholder")}
						className="input"
						autoComplete="email"
					/>
				</div>
			</div>

			{/* Subject */}
			<div>
				<label htmlFor="subject" className="input-label">
					{t("subject")}
				</label>
				<input
					type="text"
					id="subject"
					name="subject"
					required
					placeholder={t("subjectPlaceholder")}
					className="input"
				/>
			</div>

			{/* Message */}
			<div>
				<label htmlFor="message" className="input-label">
					{t("message")}
				</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					required
					placeholder={t("messagePlaceholder")}
					className="input resize-none"
				/>
			</div>

			{/* Error Message */}
			{error && (
				<div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4">
					<svg
						className="h-5 w-5 shrink-0 text-accent"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<p className="text-sm text-accent">{t("error")}</p>
				</div>
			)}

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isSubmitting}
				className={cn(
					"btn btn-primary btn-lg w-full",
					isSubmitting && "cursor-not-allowed opacity-70",
				)}
			>
				{isSubmitting ? (
					<>
						<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<span>{t("sending")}</span>
					</>
				) : (
					<>
						<span>{t("submit")}</span>
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</>
				)}
			</button>
		</form>
	);
}
