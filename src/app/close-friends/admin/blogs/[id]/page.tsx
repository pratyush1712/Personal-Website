"use client";
import { useQuery, gql } from "@apollo/client";
import { BlogEditor } from "@/components/CloseFriends";
import { Container } from "@mui/material";

const GET_BLOG = gql`
	query GetBlog($id: ID!) {
		blog(id: $id) {
			id
			title
			details
			image
			createdAt
			keywords
			tags
			htmlContent
		}
	}
`;

export default function BlogDetails({ params }: { params: { id: string } }) {
	if (params.id === "new") {
		return (
			<Container maxWidth="md">
				<BlogEditor blog={null} />
			</Container>
		);
	}
	const { data, loading, error } = useQuery(GET_BLOG, { variables: { id: params.id } });

	if (loading) return <Container maxWidth="md">Loading...</Container>;
	if (error) return <Container maxWidth="md">Error: {error.message}</Container>;

	return (
		<Container maxWidth="md">
			<BlogEditor blog={data.blog} />
		</Container>
	);
}
