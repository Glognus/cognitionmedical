import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 180,
	height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #F97316 0%, #F06B7A 50%, #EC4899 100%)",
				borderRadius: "22%",
			}}
		/>,
		{
			...size,
		},
	);
}
