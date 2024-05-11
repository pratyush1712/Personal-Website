import { Container, Typography } from "@mui/material";
import { ContentDisplay } from "@/components/CloseFriends";
import Fuse from "fuse.js";
import { Content } from "@/types";
import { getClient } from "@/graphql/client/apolloClient";
import { GET_CONTENTS } from "@/graphql/client/queries";

export const dynamic = "force-dynamic";

const getData = async (searchTerm: string = "", sortKey: string = "createdAt", filterKey: string = "all", tagFilterKeys: string[] = []) => {
	const client = getClient();
	const { data } = await client.query({ query: GET_CONTENTS, variables: { access: "private" } });
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

	const sortFunctionMap: { [key: string]: (a: Content, b: Content) => number } = {
		createdAt: (a: Content, b: Content) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		updatedAt: (a: Content, b: Content) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime(),
		title: (a: Content, b: Content) => a.title.localeCompare(b.title)
	};

	const categoryFilter = (content: Content, filterKey: string) => {
		return filterKey === "all" || content.__typename?.toLowerCase() === filterKey;
	};

	const tagFilter = (content: Content, tagFilterKeys: string[]) => {
		return tagFilterKeys.length === 0 || content.tags.some(tag => tagFilterKeys.includes(tag));
	};

	const filteredFeatures = searchResults
		.filter((content: Content) => categoryFilter(content, filterKey!))
		.filter((content: Content) => tagFilter(content, tagFilterKeys!))
		.sort((a: Content, b: Content) => sortFunctionMap[sortKey!](a, b));
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
		searchParams.searchTerm || "",
		searchParams.sortKey || "createdAt",
		searchParams.filterKey || "all",
		searchParams.tagFilterKeys || []
	);
	return (
		<Container maxWidth="lg">
			<Typography variant="h4" sx={{ mt: 4 }}>
				Admin Dashboard
			</Typography>
			<ContentDisplay data={data} params={searchParams} admin={true} />
		</Container>
	);
}
