import { TextField, FormControl, InputLabel, Select, MenuItem, Box, OutlinedInput, Chip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface FiltersProps {
	searchTerm: string;
	sortKey: string;
	filterKey: string;
	tagFilterKeys: string[];
	onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSortChange: (event: SelectChangeEvent) => void;
	onFilterChange: (event: SelectChangeEvent) => void;
	onTagFilterChange: (event: SelectChangeEvent<string[]>) => void;
}

const tags = ["exclusive", "featured", "new", "popular"];

export default function Filters({
	searchTerm,
	sortKey,
	filterKey,
	tagFilterKeys,
	onSearchChange,
	onSortChange,
	onFilterChange,
	onTagFilterChange
}: FiltersProps) {
	return (
		<Box sx={{ display: "flex", flexDirection: "row", my: 2 }}>
			<TextField
				label="Search Features"
				variant="outlined"
				fullWidth
				value={searchTerm}
				onChange={onSearchChange}
				sx={{ flex: "1 1 auto", mr: 1 }}
			/>
			<FormControl fullWidth sx={{ flex: "1 1 auto", mr: 1 }}>
				<InputLabel id="sort-label">Sort By</InputLabel>
				<Select labelId="sort-label" value={sortKey} label="Sort By" onChange={onSortChange}>
					<MenuItem value="createdAt">Created At</MenuItem>
					<MenuItem value="title">Title</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ flex: "1 1 auto", mr: 1 }}>
				<InputLabel id="category-label">Filter By Category</InputLabel>
				<Select labelId="category-label" value={filterKey} label="Filter By Category" onChange={onFilterChange}>
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="blog">Blog</MenuItem>
					<MenuItem value="video">Video</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ flex: "1 1 auto" }}>
				<InputLabel id="tag-label">Filter By Tags</InputLabel>
				<Select
					labelId="tag-label"
					multiple
					value={tagFilterKeys}
					onChange={onTagFilterChange}
					input={<OutlinedInput label="Filter By Tags" />}
					renderValue={selected => (
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
							{(selected as string[]).map(value => (
								<Chip key={value} label={value} variant="outlined" />
							))}
						</Box>
					)}
				>
					{tags.map(tag => (
						<MenuItem key={tag} value={tag}>
							{tag}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}
