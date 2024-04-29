import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/utils/auth";
import { Container, Typography } from "@mui/material";
import { DashboardLayout } from "@/components/CloseFriends";
import { VideoUploadForm } from "@/components/CloseFriends";
import { BlogEditor } from "@/components/CloseFriends";
import { ContentList } from "@/components/CloseFriends";

export default async function AdminDashboard() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false
			}
		};
	} else if (session.user.email !== "pratyushsudhakar03@gmail.com") {
		return <h1>Unauthorized</h1>;
	}

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
