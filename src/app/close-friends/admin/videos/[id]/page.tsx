"use client";
import { useQuery, gql } from "@apollo/client";
import { VideoEditor } from "@/components/CloseFriends";
import { Container } from "@mui/material";

const GET_VIDEO = gql`
	query GetVideo($id: ID!) {
		video(id: $id) {
			id
			title
			details
			image
			access
			createdAt
			updatedAt
			keywords
			tags
			videoUrl
		}
	}
`;

export default function VideoDetails({ params }: { params: { id: string } }) {
	const { data, loading, error } = useQuery(GET_VIDEO, { variables: { id: params.id } });
	if (loading) return <Container maxWidth="md">Loading...</Container>;
	if (error && params.id !== "new") return <Container maxWidth="md">Error: {error.message}</Container>;
	if (params.id === "new") {
		return (
			<Container maxWidth="md">
				<VideoEditor video={null} />
			</Container>
		);
	}

	return (
		<Container maxWidth="md">
			<VideoEditor video={data.video} />
		</Container>
	);
}
