import VideoLayout from "@/components/Video/Layout";
import "@/app/globals.css";

export const metadata = {
	title: "CS 4701 Final Project Video",
	description: "Predictive Analysis of Depression based on Actigraphy Data"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<VideoLayout>{children}</VideoLayout>
			</body>
		</html>
	);
}
