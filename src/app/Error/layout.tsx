import "@/app/globals.css";

export const metadata = {
	title: "Error Page",
	description: "An error occurred"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
