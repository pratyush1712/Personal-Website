import { gql } from "@apollo/client";
import { VideoDisplay } from "@/components/CloseFriends";
import { Container } from "@mui/material";
import { getClient } from "@/graphql/client/apolloClient";
import { Metadata, ResolvingMetadata } from "next/types";
import { getServerSession } from "next-auth";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const data = await getData(params);
	return {
		title: `${data.video.title}`,
		description: data.video.details,
		keywords: data.video.keywords
	};
}

const GET_VIDEO = gql`
	query GetVideo($id: ID!) {
		video(id: $id) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			videoUrl
		}
	}
`;

const getData = async (params: { id: string }) => {
	const session = await getServerSession();
	const client = getClient();
	const { data } = await client
		.query({
			query: GET_VIDEO,
			variables: { id: params.id }
		})
		.catch(err => {
			console.log(`Failed to fetch video: ${err}`);
			throw new Error(err);
		});
	let access: string;
	if (!data.video.access) access = "private";
	else access = data.video.access;

	if (access !== "public") {
		if (!session) throw new Error("Unauthorized");
		if (access === "private") {
			if (session.user && session.user.email === "pratyushsudhakar03@gmail.com") return data;
			throw new Error("Unauthorized");
		}
		return data;
	}
	return data;
};

export default async function VideoDetails({ params }: { params: { id: string } }) {
	const data = await getData(params);
	return (
		<Container sx={{ minWidth: "100%" }}>
			<VideoDisplay video={data.video} />
		</Container>
	);
}
