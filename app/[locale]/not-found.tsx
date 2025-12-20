import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			<div className="relative">
				{/* Decorative background */}
				<div className="absolute inset-0 -z-10 flex items-center justify-center">
					<div className="h-64 w-64 rounded-full bg-gradient-to-br from-secondary-100 to-primary-100 opacity-50 blur-3xl" />
				</div>

				{/* 404 text */}
				<span className="font-heading text-8xl font-black text-primary-900/10 sm:text-9xl">404</span>
			</div>

			<h1 className="mt-4 font-heading text-3xl font-bold text-primary-900 sm:text-4xl">
				Page Not Found
			</h1>
			<p className="mt-4 max-w-md text-neutral-600">
				The page you're looking for doesn't exist or has been moved. Let's get you back on track.
			</p>

			<Link
				href="/"
				className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-900 to-primary-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
			>
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Back to Home
			</Link>
		</div>
	);
}
