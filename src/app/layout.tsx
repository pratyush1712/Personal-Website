import type { Metadata } from "next";
import { Inter } from "next/font/google";
import VSCodeLayout from "@/components/HomeLayout/Layout";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pratyush Sudhakar",
	description: "Personal Website of Pratyush Sudhakar",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID!} />
			<body className={inter.className}>
				<VSCodeLayout options={{ key: "mui" }}>{children}</VSCodeLayout>
			</body>
		</html>
	);
}
