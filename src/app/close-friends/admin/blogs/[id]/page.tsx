"use client";
import { useQuery } from "@apollo/client";
import { BlogEditor } from "@/components/CloseFriends";
import { Container } from "@mui/material";
import Loading from "@/ui/Loading";
import { GET_BLOG } from "@/graphql/client/queries";

export default function BlogDetails({ params }: { params: { id: string } }) {
	const { data, loading, error } = useQuery(GET_BLOG, { variables: { id: params.id } });
	if (loading) return <Loading />;
	if (error && params.id !== "new") return <Container maxWidth="md">Error: {error.message}</Container>;
	if (params.id === "new") {
		return (
			<Container maxWidth="md">
				<BlogEditor blog={null} />
			</Container>
		);
	}

	return (
		<Container maxWidth="md">
			<BlogEditor blog={data.blog} />
		</Container>
	);
}
