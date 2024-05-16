import "@/app/globals.css";
import { BlogLayout } from "@/components/CloseFriends";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main>
			<BlogLayout>{children}</BlogLayout>
		</main>
	);
}
