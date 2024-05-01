import { gql } from "@apollo/client";
import { BlogView } from "@/components/CloseFriends";
import { Container } from "@mui/material";
import createClient from "@/graphql/apolloClient";
import { Metadata, ResolvingMetadata } from "next/types";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const data = await getData(params);
	return {
		title: `${data.blog.title}`,
		description: data.blog.details,
		keywords: data.blog.keywords
	};
}

const GET_BLOG = gql`
	query GetBlog($id: ID!) {
		blog(id: $id) {
			id
			title
			details
			image
			createdAt
			updatedAt
			keywords
			tags
			htmlContent
		}
	}
`;

export async function getData(params: { id: string }) {
	const client = createClient();
	const { data } = await client.query({
		query: GET_BLOG,
		variables: { id: params.id }
	});
	return data;
}

export default async function BlogDetails({ params }: { params: { id: string } }) {
	const data = await getData(params);
	return (
		<Container sx={{ minWidth: "100%" }}>
			<BlogView blog={data.blog} />
		</Container>
	);
}
