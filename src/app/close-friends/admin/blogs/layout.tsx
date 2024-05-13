export const metadata = {
	title: "Dashboard - Blogs",
	description: "Admin dashboard for managing blog content."
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <main>{children}</main>;
}
