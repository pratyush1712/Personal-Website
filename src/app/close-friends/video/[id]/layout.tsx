import "@/app/globals.css";
import { VideoLayout } from "@/components/CloseFriends";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main>
			<VideoLayout>{children}</VideoLayout>
		</main>
	);
}
