import { DashboardLayout } from "@/components/CloseFriends";
import "../../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Blog and Video Sharing Admin Dashboard",
	description: "Admin dashboard for managing blog and video content.",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<DashboardLayout>{children}</DashboardLayout>
			</body>
		</html>
	);
}
