"use client";
import { Content } from "@/types";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, Card, CardActions, CardContent, CardMedia, TextField } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Loading from "@/ui/Loading";
import { DELETE_VIDEO_MUTATION, GET_CONTENTS, GET_VIDEOS } from "@/graphql/client/queries";

export default function VideoList() {
	const { data, loading, error } = useQuery(GET_VIDEOS);
	const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION, {
		refetchQueries: [{ query: GET_VIDEOS }, { query: GET_CONTENTS }]
	});
	const [open, setOpen] = useState<boolean>(false);
	const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
	const [searchResults, setSearchResults] = useState<Content[]>([]);
	const [query, setQuery] = useState<string>("");

	useEffect(() => {
		if (data && data.videos) {
			const fuse = new Fuse(data.videos, {
				keys: ["title", "details", "tags", "keywords"],
				includeScore: true,
				threshold: 0.3
			});
			const results = fuse.search(query).map(result => result.item);
			setSearchResults(query ? results : data.videos);
		}
	}, [data, query]);

	const handleOpen = (id: number) => {
		setCurrentVideoId(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async () => {
		await deleteVideo({ variables: { id: currentVideoId } });
		handleClose();
	};

	if (loading) return <Loading />;
	if (error) return <p>Error loading videos: {error.message}</p>;

	return (
		<Box sx={{ width: "100%" }}>
			<TextField
				id="search-bar"
				fullWidth
				label="Search Videos"
				variant="outlined"
				value={query}
				onChange={(e: any) => setQuery(e.target.value)}
				margin="normal"
			/>
			{searchResults.map(video => (
				<Card key={video.id} sx={{ display: "flex", marginBottom: 2, position: "relative" }}>
					<CardMedia component="img" sx={{ width: 160, height: 140 }} image={video.image} alt={video.title} />
					<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
						<CardContent sx={{ flex: "1 0 auto" }}>
							<Typography variant="h5" gutterBottom>
								{video.title}
							</Typography>
							<Typography variant="body2">{video.details}</Typography>
							<Typography variant="caption" color="textSecondary">
								Created: {new Date(video.createdAt).toLocaleDateString()}
								{" | "}
								Last Updated: {new Date(video?.updatedAt ?? "").toLocaleDateString()}
							</Typography>
							<Typography variant="caption" display="block">
								Tags: {video.tags.join(", ")}
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: "flex-end", position: "absolute", right: 10, gap: 1 }}>
							<Link href={`${window.location.href}/${video.id}`} passHref>
								<Button size="small">Edit</Button>
							</Link>
							<Button size="small" color="error" onClick={() => handleOpen(video.id)}>
								Delete
							</Button>
						</CardActions>
					</Box>
					<Divider orientation="vertical" flexItem />
				</Card>
			))}

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Are you sure you want to delete this video?</DialogTitle>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleDelete} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<Link href={`${window.location.href}/new`} passHref>
					<Button variant="contained" color="primary">
						Add Video
					</Button>
				</Link>
			</Box>
		</Box>
	);
}
