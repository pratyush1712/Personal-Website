import { Container, Typography } from "@mui/material";
import { DashboardLayout } from "@/components/CloseFriends";
import { VideoUploadForm } from "@/components/CloseFriends";
import { BlogEditor } from "@/components/CloseFriends";
import { ContentList } from "@/components/CloseFriends";

export const metadata = {
	title: "Blog and Video Sharing Admin Dashboard",
	description: "Admin dashboard for managing blog and video content.",
	authors: { name: "Pratyush Sudhakar", url: "https://pratyushsudhakar.com" },
	icons: "/favicon.ico"
};

export default async function AdminDashboard() {
	return (
		<DashboardLayout>
			<Container maxWidth="lg">
				<Typography variant="h4" sx={{ mb: 4 }}>
					Admin Dashboard
				</Typography>
				<VideoUploadForm />
				<BlogEditor />
				<ContentList />
			</Container>
		</DashboardLayout>
	);
}
