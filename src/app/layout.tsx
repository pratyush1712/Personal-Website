import type { Metadata } from "next";
import { Inter } from "next/font/google";
import VSCodeLayout from "@/components/Layout";
import GoogleAnalytics from "@/hooks/usePageTracking";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pratyush Sudhakar",
	description: "Personal Website of Pratyush Sudhakar",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<GoogleAnalytics />
				<VSCodeLayout options={{ key: "mui" }}>{children}</VSCodeLayout>
			</body>
		</html>
	);
}
