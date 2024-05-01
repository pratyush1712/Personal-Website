"use client";
import { Box, Card, CardContent, CardMedia, Chip, Container, SelectChangeEvent, Typography } from "@mui/material";
import Filters from "./Filters";
import Fuse from "fuse.js";
import { useState, useMemo } from "react";
import { Content } from "@/types";
import { useQuery, gql } from "@apollo/client";

const GET_CONTENTS = gql`
	query GetContents {
		contents {
			id
			title
			details
			image
			createdAt
			keywords
			tags
		}
	}
`;

export default function ContentDisplay() {
	const { data, loading, error } = useQuery(GET_CONTENTS);
	console.log(data);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortKey, setSortKey] = useState<string>("createdAt");
	const [filterKey, setFilterKey] = useState("all");
	const [tagFilterKeys, setTagFilterKeys] = useState<string[]>([]);

	const fuseOptions = {
		keys: ["title", "details", "keywords"],
		includeScore: true,
		threshold: 0.3
	};

	const filteredFeatures = useMemo(() => {
		if (!data) return [];
		const fuse = new Fuse(data.contents, fuseOptions);
		const searchResults = searchTerm ? fuse.search(searchTerm).map(result => result.item) : data.contents;
		return searchResults
			.filter((content: Content) => filterKey === "all" || content.category.includes(filterKey))
			.filter((content: Content) => tagFilterKeys.length === 0 || content.tags.some(tag => tagFilterKeys.includes(tag)))
			.sort((a: Content, b: Content) =>
				sortKey === "createdAt" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : a.id - b.id
			);
	}, [data, searchTerm, sortKey, filterKey, tagFilterKeys]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	return (
		<Container disableGutters>
			<Filters
				searchTerm={searchTerm}
				sortKey={sortKey}
				filterKey={filterKey}
				tagFilterKeys={tagFilterKeys}
				onSearchChange={(event: React.ChangeEvent<{ value: unknown }>) => setSearchTerm(event.target.value as string)}
				onSortChange={(event: SelectChangeEvent) => setSortKey(event.target.value)}
				onFilterChange={(event: SelectChangeEvent) => setFilterKey(event.target.value)}
				onTagFilterChange={(event: SelectChangeEvent<string | string[]>) =>
					setTagFilterKeys(Array.isArray(event.target.value) ? event.target.value : [event.target.value])
				}
			/>
			<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 }}>
				{filteredFeatures.map((feature: Content) => (
					<Card key={feature.id} sx={{ maxWidth: 345, bgcolor: "background.paper" }}>
						<CardMedia component="img" height="140" image={feature.image} alt={feature.title} />
						<CardContent>
							<Typography variant="h5" component="div">
								{feature.title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{feature.details}
							</Typography>
							<Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
								{feature.tags.map(tag => (
									<Chip
										key={tag}
										label={tag}
										variant="outlined"
										sx={{
											borderRadius: 1.5,
											borderColor: "#E50914"
										}}
									/>
								))}
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>
		</Container>
	);
}
