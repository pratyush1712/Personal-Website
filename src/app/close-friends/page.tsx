"use client";
import React, { useState, useMemo } from "react";
import { Container, Card, CardContent, CardMedia, Typography, Box, SelectChangeEvent, Chip } from "@mui/material";
import { Content } from "@/types";
import { Filters } from "@/components/CloseFriends";
import Fuse from "fuse.js";

const randomWords = [
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor, eros nec tincidunt luctus, nisl justo bibendum eros, nec fermentum orci elit nec sapien.",
	"Nullam at nulla in nunc facilisis aliquam quis quis lorem.Nullam nec nunc nec justo ultricies fermentum.",
	"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed non odio nec mi tincidunt blandit.",
	"Nulla facilisi. Nullam nec nunc nec justo ultricies fermentum. Nulla facilisi. Nullam nec nunc nec justo ultricies fermentum.",
	"Nullam nec nunc nec justo ultricies fermentum. Nulla facilisi. Nullam nec nunc nec justo ultricies fermentum."
];
const tags = ["exclusive", "featured", "new", "popular"];

const contents: Content[] = [...Array(20)].map((_, index) => ({
	id: index,
	title: `Feature ${index + 1}`,
	details: randomWords[index % randomWords.length],
	image: `https://source.unsplash.com/random?sig=${index}`,
	category: Math.random() > 0.5 ? "blog" : "video",
	createdAt: new Date().toISOString(),
	keywords: ["feature", "close friends"],
	tags: tags.filter(() => Math.random() > 0.5)
}));

export default function CloseFriends() {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortKey, setSortKey] = useState<string>("createdAt");
	const [filterKey, setFilterKey] = useState("all");
	const [tagFilterKeys, setTagFilterKeys] = useState<string[]>([]);

	const fuseOptions = {
		keys: ["title", "details", "keywords"],
		includeScore: true,
		threshold: 0.3
	};

	const fuse = new Fuse(contents, fuseOptions);

	const filteredFeatures = useMemo(() => {
		const searchResults = searchTerm ? fuse.search(searchTerm).map(result => result.item) : contents;
		return searchResults
			.filter(content => filterKey === "all" || content.category.includes(filterKey))
			.filter(content => tagFilterKeys.length === 0 || content.tags.some(tag => tagFilterKeys.includes(tag)))
			.sort((a, b) => (sortKey === "createdAt" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : a.id - b.id));
	}, [contents, searchTerm, sortKey, filterKey, tagFilterKeys]);

	return (
		<Container maxWidth="md" sx={{ minWidth: "100%" }}>
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
				{filteredFeatures.map((feature, index) => (
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
									<Chip key={tag} label={tag} variant="outlined" />
								))}
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>
		</Container>
	);
}
