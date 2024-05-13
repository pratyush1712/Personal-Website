import { Inter } from "next/font/google";
import "@/app/globals.css";
import { BlogLayout } from "@/components/CloseFriends";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main>
			<BlogLayout>{children}</BlogLayout>
		</main>
	);
}
