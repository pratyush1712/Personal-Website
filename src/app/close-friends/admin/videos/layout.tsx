export const metadata = {
	title: "Dashboard - Videos",
	description: "Admin dashboard for managing video content."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return <main>{children}</main>;
}
