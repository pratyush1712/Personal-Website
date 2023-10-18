import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pratyush Sudhakar",
	description: "Personal Website of Pratyush Sudhakar"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
