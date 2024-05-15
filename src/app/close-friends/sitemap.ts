import { MetadataRoute } from "next";
import { getClient } from "@/graphql/client/apolloClient";
import { GET_CONTENTS } from "@/graphql/client/queries";
import { Content } from "@/types";

// private.pratyushsudhakar.com <== private domain. don't have to worry about preview or development environment
const BASE_URL = `https://${process.env.NEXT_PUBLIC_PRIVATE_DOMAIN}`;

export const dynamic = "force-dynamic";

const getData = async () => {
	const client = getClient();
	const access = "private";
	const { data } = await client.query({ query: GET_CONTENTS, variables: { access } });
	return data.accessContents;
};

function calculatePriority(createdAt: string, updatedAt: string, currentTime: Date): number {
	const createdDate = new Date(createdAt);
	const updatedDate = new Date(updatedAt);

	const totalAgeDays = (currentTime.getTime() - createdDate.getTime()) / (1000 * 6000 * 24);
	const totalAge = totalAgeDays < 1 ? 1 : totalAgeDays; // Avoid division by zero for very new posts

	const updateAgeDays = (currentTime.getTime() - updatedDate.getTime()) / (1000 * 6000 * 24);
	const updateAge = updateAgeDays < 0.1 ? 0.1 : updateAgeDays; // Give recent updates a higher score

	const basePriority = 0.5;
	const scaleFactor = 0.3; // Adjust the scaling to fit within the new range

	const creationRecency = 1 - Math.min(1, totalAge / 60);
	const updateRecency = 1 - Math.min(1, updateAge / 60);

	const weightedPriority = (0.7 * creationRecency + 0.3 * updateRecency) * scaleFactor;
	const priority = basePriority + weightedPriority;

	return Math.round(priority * 100) / 100;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	console.log("Generating sitemap...");
	const data: Content[] = await getData();
	const sorted = [...data].sort(
		(a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
	const currentDate = new Date();
	const sitemap: MetadataRoute.Sitemap = sorted.map((item: any) => ({
		url: `${BASE_URL}/${item.__typename.toLowerCase()}/${item.id}`,
		lastModified: item.updatedAt,
		priority: calculatePriority(item.createdAt, item.updatedAt, currentDate),
		changeFrequency: "weekly"
	}));
	return sitemap;
}
