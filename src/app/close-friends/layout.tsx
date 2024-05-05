import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import "@/styles/scrollbar.css";
import "@/styles/editor.css";

export const metadata = {
	title: "Pratyush's Personal Blog and Video Sharing Platform",
	description: "A personal blog and video sharing platform for my close friends",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_PRIVATE_GOOGLE_ID!} />
			<body>{children}</body>
		</html>
	);
}
