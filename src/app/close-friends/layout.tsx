import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import "@/styles/scrollbar.css";
import "@/styles/editor.css";
import { Hotkeys } from "@/ui/Keyboard";

export const metadata = {
	title: "Pratyush's Personal Blog and Video Sharing Platform",
	description: "A personal blog and video sharing platform for my close friends",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<Hotkeys />
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_PRIVATE_GOOGLE_ID!} />
			<body>{children}</body>
		</html>
	);
}
