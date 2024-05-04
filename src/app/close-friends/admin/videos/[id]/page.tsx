"use client";
import { useQuery, gql } from "@apollo/client";
import { VideoEditor } from "@/components/CloseFriends";
import { Container } from "@mui/material";
import Loading from "@/ui/Loading";
import { GET_VIDEO } from "@/graphql/client/queries";

export default function VideoDetails({ params }: { params: { id: string } }) {
	const { data, loading, error } = useQuery(GET_VIDEO, { variables: { id: params.id } });
	if (loading) return <Loading />;
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
