"use client";
import { useQuery, gql } from "@apollo/client";
import { BlogEditor } from "@/components/CloseFriends";
import { Container } from "@mui/material";
import Loading from "@/ui/Loading";
import { GET_BLOG, GET_TAGS } from "@/graphql/client/queries";

export default function BlogDetails({ params }: { params: { id: string } }) {
	const { data, loading, error } = useQuery(GET_BLOG, { variables: { id: params.id } });
	const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_TAGS);
	if (loading || tagsLoading) return <Loading />;
	if (error && params.id !== "new") return <Container maxWidth="md">Error: {error.message}</Container>;
	const tags = tagsData.tags.map((tag: string) => ({
		inputValue: tag,
		title: tag
	}));
	if (params.id === "new") {
		return (
			<Container maxWidth="md">
				<BlogEditor blog={null} tagsData={tags} />
			</Container>
		);
	}

	return (
		<Container maxWidth="md">
			<BlogEditor blog={data.blog} tagsData={tags} />
		</Container>
	);
}
