"use client";
import { Container, Typography } from "@mui/material";
import { VideoUploadForm } from "@/components/CloseFriends";
import { Blogs } from "@/components/CloseFriends";
import { ContentList } from "@/components/CloseFriends";

export default function AdminDashboard() {
	return (
		<Container maxWidth="lg">
			<Typography variant="h4" sx={{ mb: 4 }}>
				Admin Dashboard
			</Typography>
			<VideoUploadForm />
			<Blogs />
			<ContentList />
		</Container>
	);
}
