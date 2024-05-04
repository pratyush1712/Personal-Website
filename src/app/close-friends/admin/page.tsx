import { Container, Typography } from "@mui/material";
import { ContentDisplay } from "@/components/CloseFriends";
import Fuse from "fuse.js";
import { Content } from "@/types";
import { getClient } from "@/graphql/client/apolloClient";
import { GET_CONTENTS } from "@/graphql/client/queries";

export const dynamic = "force-dynamic";

const getData = async (
	searchTerm: string | null = "",
	sortKey: string | null = "createdAt",
	filterKey: string | null = "all",
	tagFilterKeys: string[] | null = []
) => {
	const client = getClient();
	const { data } = await client.query({ query: GET_CONTENTS });
	const fuseOptions = {
		keys: ["title", "details", "keywords"],
		includeScore: true,
		threshold: 0.3
	};
	const fuse = new Fuse(data.accessContents, fuseOptions);
	let searchResults = searchTerm ? fuse.search(searchTerm) : data.accessContents;
	if (searchResults[0]?.item) {
		searchResults = searchResults.map((result: { item: Content }) => result.item);
	}

	const filteredFeatures = searchResults
		.filter(
			(content: Content) => filterKey === "all" || content?.__typename?.toLocaleLowerCase().includes(filterKey!)
		)
		.filter(
			(content: Content) => tagFilterKeys?.length === 0 || content.tags.some(tag => tagFilterKeys?.includes(tag))
		)
		.sort((a: Content, b: Content) =>
			sortKey === "createdAt" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0
		);
	return filteredFeatures;
};

export default async function AdminDashboard({
	searchParams
}: {
	searchParams: {
		searchTerm: string | null | undefined;
		sortKey: string | null | undefined;
		filterKey: string | null | undefined;
		tagFilterKeys: string[] | null | undefined;
	};
}) {
	const data = await getData(
		searchParams.searchTerm,
		searchParams.sortKey,
		searchParams.filterKey,
		searchParams.tagFilterKeys
	);
	return (
		<Container maxWidth="lg">
			<Typography variant="h4" sx={{ my: 4 }}>
				Admin Dashboard
			</Typography>
			<ContentDisplay data={data} params={searchParams} admin={true} />
		</Container>
	);
}
