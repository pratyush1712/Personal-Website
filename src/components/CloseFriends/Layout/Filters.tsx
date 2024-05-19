"use client";
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, OutlinedInput, Chip, Icon } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { isBrowser } from "react-device-detect";
import { IoMdSearch } from "react-icons/io";

interface FiltersProps {
	searchTerm: string | null | undefined;
	sortKey: string | null | undefined;
	filterKey: string | null | undefined;
	tagFilterKeys: string[] | null | undefined;
	url: string;
}

export default function Filters({ searchTerm, sortKey, filterKey, tagFilterKeys, url }: FiltersProps) {
	const router = useRouter();
	const [searchTermState, setSearchTermState] = useState<string>(searchTerm! || "");
	const [sortKeyState, setSortKeyState] = useState<string>(sortKey! || "");
	const [filterKeyState, setFilterKeyState] = useState<string>(filterKey! || "");
	const [tagFilterKeysState, setTagFilterKeysState] = useState<string[]>(tagFilterKeys! || []);
	/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
	const [isPending, startTransition] = useTransition();
	const defaultTags = ["exclusive", "featured", "new", "popular"];
	const tags = [...Array.from(tagFilterKeysState), ...defaultTags];

	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTermState(e.target.value);
	};

	const onSortChange = (e: SelectChangeEvent) => {
		setSortKeyState(e.target.value);
	};

	const onFilterChange = (e: SelectChangeEvent) => {
		setFilterKeyState(e.target.value);
	};

	useEffect(() => {
		const URL = new URLSearchParams(url.split("?")[1]);
		URL.delete("searchTerm");
		URL.delete("sortKey");
		URL.delete("filterKey");
		URL.delete("tagFilterKeys");
		if (searchTermState !== "" && searchTermState !== null) URL.set("searchTerm", searchTermState);
		if (sortKeyState !== "createdAt" && sortKeyState !== null) URL.set("sortKey", sortKeyState);
		if (filterKeyState !== "all" && filterKeyState !== null) URL.set("filterKey", filterKeyState);
		if (tagFilterKeysState.length !== 0 && tagFilterKeysState !== null)
			URL.set("tagFilterKeys", tagFilterKeysState?.join(","));
		startTransition(() => {
			router.replace(`${url}?${URL.toString()}`);
		});
	}, [searchTermState, sortKeyState, filterKeyState, tagFilterKeysState, router, url]);

	return (
		<Box sx={{ display: "flex", flexDirection: "row", maxHeight: "30px", gap: 1 }}>
			<TextField
				id="search-bar"
				label="Search Content"
				variant="outlined"
				fullWidth
				value={searchTermState}
				onChange={onSearchChange}
				size="small"
				sx={{ flex: "1 1 auto", maxHeight: "30px" }}
			/>

			{isBrowser && (
				<Box sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 1 }}>
					<FormControl fullWidth size="small" sx={{ flex: "1 1 auto", maxHeight: "30px" }}>
						<InputLabel id="sort-label">Sort By</InputLabel>
						<Select labelId="sort-label" value={sortKeyState} label="Sort By" onChange={onSortChange}>
							<MenuItem value="createdAt">Created At</MenuItem>
							<MenuItem value="title">Title</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth size="small" sx={{ flex: "1 1 auto", maxHeight: "30px" }}>
						<InputLabel id="category-label">Filter By Category</InputLabel>
						<Select
							labelId="category-label"
							value={filterKeyState}
							label="Filter By Category"
							onChange={onFilterChange}>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="blog">Blog</MenuItem>
							<MenuItem value="video">Video</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth size="small" sx={{ flex: "1 1 auto", maxHeight: "30px" }}>
						<InputLabel id="tag-label">Filter By Tags</InputLabel>
						<Select
							labelId="tag-label"
							value={tagFilterKeysState}
							label="Filter By Tags"
							onChange={(event: SelectChangeEvent<string | string[]>) =>
								setTagFilterKeysState(
									Array.isArray(event.target.value) ? event.target.value : [event.target.value]
								)
							}
							input={<OutlinedInput label="Filter By Tags" />}
							renderValue={selected => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{(selected as string[]).map(value => (
										<Chip key={value} label={value} size="small" />
									))}
								</Box>
							)}>
							{tags.map(tag => (
								<MenuItem key={tag} value={tag}>
									{tag}
								</MenuItem>
							))}
							<MenuItem value="all">All</MenuItem>
						</Select>
					</FormControl>
				</Box>
			)}
			<Icon sx={{ height: "30px", alignItems: "center", display: "flex" }}>
				<IoMdSearch size={48} style={{ color: "red", marginTop: "8px" }} />
			</Icon>
		</Box>
	);
}
