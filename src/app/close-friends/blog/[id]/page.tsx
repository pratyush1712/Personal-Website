import { gql } from "@apollo/client";
import { BlogView } from "@/components/CloseFriends";
import { Container } from "@mui/material";
import { getClient } from "@/graphql/client/apolloClient";
import { Metadata, ResolvingMetadata } from "next/types";
import { getServerSession } from "next-auth";
import { GET_BLOG } from "@/graphql/client/queries";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const data = await getData(params);
	return {
		title: `${data.blog.title}`,
		description: data.blog.details,
		keywords: data.blog.keywords
	};
}

const getData = async (params: { id: string }) => {
	const session = await getServerSession();
	const client = getClient();
	const { data } = await client.query({
		query: GET_BLOG,
		variables: { id: params.id }
	});
	if (!data.blog.access) throw new Error("Unauthorized");
	if (data.blog.access !== "public") {
		if (!session) throw new Error("Unauthorized");
		if (data.blog.access === "private") {
			if (session.user && session.user.email === "pratyushsudhakar03@gmail.com") return data;
			throw new Error("Unauthorized");
		}
		return data;
	}
	return data;
};

export default async function BlogDetails({ params }: { params: { id: string } }) {
	const data = await getData(params);
	return (
		<Container sx={{ minWidth: "100%" }}>
			<BlogView blog={data.blog} />
		</Container>
	);
}
