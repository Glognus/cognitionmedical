import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 32,
	height: 32,
};

export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #F97316 0%, #F06B7A 50%, #EC4899 100%)",
				borderRadius: "50%",
			}}
		/>,
		{
			...size,
		},
	);
}
