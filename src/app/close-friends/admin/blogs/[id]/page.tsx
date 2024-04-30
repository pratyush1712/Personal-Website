"use client";
import { useQuery, gql } from "@apollo/client";
import { BlogEditor } from "@/components/CloseFriends";

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
	const { data, loading, error } = useQuery(GET_BLOG, { variables: { id: params.id } });

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return <BlogEditor blog={data.blog} />;
}
