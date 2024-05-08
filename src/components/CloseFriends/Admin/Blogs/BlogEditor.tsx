"use client";
import React, { useState, useRef } from "react";
import { Button, TextField, Typography, Paper, CircularProgress, Alert, Select, MenuItem, Menu, Backdrop } from "@mui/material";
import { Autocomplete, Chip, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import Editor from "@/ui/Editor";
import { useMutation, gql } from "@apollo/client";
import Image from "@/ui/Image";
import SunEditorCore from "suneditor/src/lib/core";
import { GET_BLOGS, GET_CONTENTS } from "@/graphql/client/queries";
import { uploadPDF } from "@/utils/upload";
import LoadingComponent from "@/ui/Loading";

const CREATE_BLOG_MUTATION = gql`
	mutation CreateBlog($input: NewBlogInput!) {
		createBlog(input: $input) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			htmlContent
		}
	}
`;

const UPDATE_BLOG_MUTATION = gql`
	mutation UpdateBlog($input: NewBlogInput!, $id: ID!) {
		updateBlog(input: $input, id: $id) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			htmlContent
		}
	}
`;

export default function BlogEditor({ blog }: { blog: any }) {
	const editor = useRef<SunEditorCore>();
	const [content, setContent] = useState(blog?.htmlContent || "");
	const [blogUpdate, setBlogUpdate] = useState(blog);
	const [createBlog, { loading: creating, error: createError }] = useMutation(CREATE_BLOG_MUTATION, {
		refetchQueries: [{ query: GET_BLOGS }, { query: GET_CONTENTS }]
	});
	const [updateBlog, { loading: updating, error: updateError }] = useMutation(UPDATE_BLOG_MUTATION, {
		refetchQueries: [{ query: GET_BLOGS }, { query: GET_CONTENTS }]
	});
	const [clientLoading, setClientLoading] = useState(false);
	const [imageError, setImageError] = useState("");

	const handleImageUpload = async (e: any) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "blog");

		setClientLoading(true);
		setImageError("");

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData
			});
			const data = await response.json();
			if (response.ok) {
				setBlogUpdate({ ...blogUpdate, image: data[0] });
				setClientLoading(false);
			} else {
				throw new Error(data.message || "Failed to upload image");
			}
		} catch (error: Error | any) {
			setClientLoading(false);
			setImageError(error.message);
		}
	};

	const handleSubmit = async () => {
		const input = { ...blogUpdate, htmlContent: content };
		delete input.id;
		delete input.__typename;
		uploadPDF({ editor: editor.current!, blog: blogUpdate });
		if (blog?.id) {
			input.updatedAt = new Date().toISOString();
			await updateBlog({ variables: { input, id: blog.id } });
		} else {
			const date = new Date().toISOString();
			input.createdAt = date;
			input.updatedAt = date;
			if (input?.image === undefined) input["image"] = `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/images/default.jpg`;
			await createBlog({ variables: { input } });
		}
	};

	if (createError || updateError) return <Alert severity="error">Error saving blog: {createError?.message || updateError?.message}</Alert>;

	if (imageError) return <Alert severity="error">{imageError}</Alert>;

	return (
		<Paper elevation={3} sx={{ p: 3, maxWidth: "100%" }}>
			<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={clientLoading || creating || updating}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Typography variant="h4" gutterBottom>
				{blog?.title ?? "New Blog"}
			</Typography>
			<Accordion sx={{ my: 2 }}>
				<AccordionSummary>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							minWidth: "100%",
							justifyContent: "space-between"
						}}
					>
						<Typography>Blog&apos;s General Information</Typography>
						<Typography color="textSecondary" sx={{ pr: 2 }}>
							Click to expand
						</Typography>
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, marginTop: 2, marginBottom: 2 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							{clientLoading ? (
								<CircularProgress size={24} />
							) : (
								<Box sx={{ width: 400, height: 287, position: "relative" }}>
									<Image
										src={blogUpdate?.image || "/images/default.jpg"}
										alt={blogUpdate?.title}
										fill
										style={{ objectFit: "contain" }}
										quality={100}
										onError={() => setBlogUpdate({ ...blogUpdate, image: blogUpdate?.image })}
									/>
								</Box>
							)}
							<Button variant="contained" component="label">
								Upload Image
								<input type="file" hidden onChange={handleImageUpload} />
							</Button>
						</Box>
						{imageError && <Typography color="error">{imageError}</Typography>}
						<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", mt: -2 }}>
							<TextField
								fullWidth
								label="Title"
								variant="outlined"
								margin="normal"
								defaultValue={blogUpdate?.title}
								onBlur={e => setBlogUpdate({ ...blogUpdate, title: e.target.value })}
							/>
							<TextField
								fullWidth
								label="Description"
								variant="outlined"
								margin="normal"
								maxRows={6}
								minRows={6}
								multiline
								defaultValue={blogUpdate?.details}
								onBlur={e => setBlogUpdate({ ...blogUpdate, details: e.target.value })}
							/>
							{/* a select for access level. one of 3 options: public, private, close-friends */}
							<Select
								fullWidth
								variant="outlined"
								label="Access"
								defaultValue={blogUpdate?.access}
								onChange={e => setBlogUpdate({ ...blogUpdate, access: e.target.value })}
							>
								<MenuItem value="public">Public</MenuItem>
								<MenuItem value="private">Private</MenuItem>
								<MenuItem value="close-friends">Close Friends</MenuItem>
							</Select>
							<Box display="flex" gap={2} sx={{ my: 2 }}>
								<Autocomplete
									multiple
									options={[]}
									defaultValue={blogUpdate?.tags}
									freeSolo
									sx={{ maxWidth: "50%", minWidth: "50%" }}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip
												variant="outlined"
												label={option}
												sx={{ borderRadius: 1.5, p: 2 }}
												{...getTagProps({ index })}
												key={index}
											/>
										))
									}
									renderInput={params => <TextField {...params} variant="outlined" label="Tags" placeholder="Add tags" />}
									onChange={(event, newValue) => setBlogUpdate({ ...blogUpdate, tags: newValue })}
								/>
								<Autocomplete
									multiple
									options={[]}
									defaultValue={blogUpdate?.keywords}
									freeSolo
									sx={{ maxWidth: "50%", minWidth: "50%" }}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip
												variant="outlined"
												label={option}
												sx={{ borderRadius: 1.5, p: 2 }}
												{...getTagProps({ index })}
												key={index}
											/>
										))
									}
									renderInput={params => <TextField {...params} variant="outlined" label="Keywords" placeholder="Add keywords" />}
									onChange={(event, newValue) => setBlogUpdate({ ...blogUpdate, keywords: newValue })}
								/>
							</Box>
						</Box>
					</Box>
				</AccordionDetails>
			</Accordion>
			<Divider sx={{ my: 2 }} />
			<Typography variant="h6" gutterBottom>
				Edit Blog Content
			</Typography>
			<Editor defaultValue={blog?.htmlContent} onChange={setContent} editor={editor} />
			<Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
				Save Blog
			</Button>
		</Paper>
	);
}
