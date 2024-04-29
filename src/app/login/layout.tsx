import "../globals.css";

export const metadata = {
	title: "Close Friends Login",
	description: "Login page for the Close Friends Dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
