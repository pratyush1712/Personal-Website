"use client";
import { Container, Typography } from "@mui/material";
import { DashboardLayout } from "@/components/CloseFriends";
import { VideoUploadForm } from "@/components/CloseFriends";
import { BlogEditor } from "@/components/CloseFriends";
import { ContentList } from "@/components/CloseFriends";
import { ApolloProvider } from "@apollo/client";
import client from "@/graphql/apolloClient";

export default function AdminDashboard() {
	return (
		<ApolloProvider client={client}>
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
		</ApolloProvider>
	);
}
