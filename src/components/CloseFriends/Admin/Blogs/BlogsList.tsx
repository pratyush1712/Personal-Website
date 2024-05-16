"use client";
import { Content } from "@/types";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, Card, CardActions, CardContent, CardMedia, TextField } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Loading from "@/ui/Loading";
import { GET_BLOGS, DELETE_BLOG_MUTATION, GET_CONTENTS } from "@/graphql/client/queries";

export default function BlogList() {
	const { data, loading, error } = useQuery(GET_BLOGS);
	const [deleteBlog] = useMutation(DELETE_BLOG_MUTATION, {
		refetchQueries: [{ query: GET_BLOGS }, { query: GET_CONTENTS }]
	});
	const [open, setOpen] = useState<boolean>(false);
	const [currentBlogId, setCurrentBlogId] = useState<number | null>(null);
	const [searchResults, setSearchResults] = useState<Content[]>([]);
	const [query, setQuery] = useState<string>("");

	useEffect(() => {
		if (data && data.blogs) {
			const fuse = new Fuse(data.blogs, {
				keys: ["title", "details", "tags", "keywords"],
				includeScore: true,
				threshold: 0.3
			});
			const results = fuse.search(query).map(result => result.item);
			setSearchResults(query ? results : data.blogs);
		}
	}, [data, query]);

	const handleOpen = (id: number) => {
		setCurrentBlogId(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async () => {
		await deleteBlog({ variables: { id: currentBlogId } });
		// refetch();
		handleClose();
	};

	const truncate = (input: string) => (input.length > 100 ? `${input.substring(0, 50)}...` : input);

	if (loading) return <Loading />;
	if (error) return <p>Error loading blogs: {error.message}</p>;

	return (
		<Box sx={{ width: "100%" }}>
			<TextField
				id="search-bar"
				fullWidth
				label="Search Blogs"
				variant="outlined"
				value={query}
				onChange={(e: any) => setQuery(e.target.value)}
				margin="normal"
			/>
			{searchResults.map(blog => (
				<Card key={blog.id} sx={{ display: "flex", marginBottom: 2, position: "relative" }}>
					<CardMedia
						component="img"
						sx={{ width: 160, objectFit: "cover" }}
						image={blog.image}
						alt={blog.title}
						onError={e => (e.currentTarget.src = "/images/default.jpg")}
					/>
					<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
						<CardContent sx={{ flex: "1 0 auto" }}>
							<Typography variant="h5" gutterBottom>
								{blog.title}{" "}
								{blog?.access === "private" && (
									<Typography variant="body2" color="error">
										[Private]
									</Typography>
								)}
							</Typography>
							<Typography variant="body2">{truncate(blog.details)}</Typography>
							<Typography variant="caption" color="textSecondary">
								Created: {new Date(blog.createdAt).toLocaleDateString()}
								{" | "}
								Last Updated: {new Date(blog?.updatedAt ?? "").toLocaleDateString()}
							</Typography>
							<Typography variant="caption" display="block">
								Tags: {blog.tags.join(", ")}
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: "flex-end", position: "absolute", right: 10, gap: 1 }}>
							<Link href={`${window.location.href}/${blog.id}`} passHref>
								<Button size="small">Edit</Button>
							</Link>
							<Button size="small" color="error" onClick={() => handleOpen(blog.id)}>
								Delete
							</Button>
						</CardActions>
					</Box>
					<Divider orientation="vertical" flexItem />
				</Card>
			))}

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Are you sure you want to delete this blog?</DialogTitle>
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
						Add Blog
					</Button>
				</Link>
			</Box>
		</Box>
	);
}
