"use client";
import React, { useState } from "react";
import { Button, TextField, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { Autocomplete, Chip, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import Editor from "@/ui/Editor";
import { useMutation, gql } from "@apollo/client";
import Image from "next/image";

const CREATE_BLOG_MUTATION = gql`
	mutation CreateBlog($input: NewBlogInput!) {
		createBlog(input: $input) {
			id
			title
			details
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
	const [content, setContent] = useState(blog?.htmlContent || "");
	const [blogUpdate, setBlogUpdate] = useState(blog);
	const [createBlog, { loading: creating, error: createError }] = useMutation(CREATE_BLOG_MUTATION, {
		refetchQueries: ["GetBlogs"]
	});
	const [updateBlog, { loading: updating, error: updateError }] = useMutation(UPDATE_BLOG_MUTATION, {
		refetchQueries: ["GetBlogs"]
	});
	const [imageLoading, setImageLoading] = useState(false);
	const [imageError, setImageError] = useState("");

	const handleImageUpload = async (e: any) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("image", file);
		formData.append("type", "blog");

		setImageLoading(true);
		setImageError("");

		try {
			const response = await fetch("/api/images", {
				method: "POST",
				body: formData
			});
			const data = await response.json();
			if (response.ok) {
				setBlogUpdate({ ...blogUpdate, image: data[0] });
				setImageLoading(false);
			} else {
				throw new Error(data.message || "Failed to upload image");
			}
		} catch (error: Error | any) {
			setImageLoading(false);
			setImageError(error.message);
		}
	};

	const handleSubmit = async () => {
		const input = { ...blogUpdate, htmlContent: content };
		delete input.id;
		delete input.__typename;

		if (blog?.id) {
			input.updatedAt = new Date().toISOString();
			await updateBlog({ variables: { input, id: blog.id } });
		} else {
			const date = new Date().toISOString();
			input.createdAt = date;
			input.updatedAt = date;
			await createBlog({ variables: { input } });
		}
	};

	if (creating || updating) return <CircularProgress color="inherit" />;
	if (createError || updateError)
		return <Alert severity="error">Error saving blog: {createError?.message || updateError?.message}</Alert>;

	if (imageLoading) return <CircularProgress />;
	if (imageError) return <Alert severity="error">{imageError}</Alert>;

	return (
		<Paper elevation={3} sx={{ p: 3, maxWidth: "100%" }}>
			<Typography variant="h4" gutterBottom>
				{blog?.title ?? "New Blog"}
			</Typography>
			<Accordion sx={{ my: 2 }}>
				<AccordionSummary>
					<Box sx={{ display: "flex", alignItems: "center", minWidth: "100%", justifyContent: "space-between" }}>
						<Typography>Blog&apos;s General Information</Typography>
						<Typography color="textSecondary" sx={{ pr: 2 }}>
							Click to expand
						</Typography>
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, marginTop: 2, marginBottom: 2 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							{imageLoading ? (
								<CircularProgress size={24} />
							) : (
								blogUpdate?.image && (
									<Box sx={{ width: 400, height: 287, position: "relative" }}>
										<Image
											src={blogUpdate?.image}
											alt={blogUpdate?.title}
											layout="fill"
											objectFit="contain"
											quality={100}
											blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCABrAGsDASIAAhEBAxEB/8QAGwAAAwEBAQEBAAAAAAAAAAAAAgMEBQEABgf/xAAhEAADAQACAgMBAQEAAAAAAAAAAQIDESEEMRIyQSITUf/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwQABf/EAB4RAQEBAQABBQEAAAAAAAAAAAABAhExAxIhMkFR/9oADAMBAAIRAxEAPwD7M8eOP0c5Pt+mfsX7Mz9mdXJa9hR7Br2dj2AVmRXmR5FebGjlCPUcTOUwgRqQ7/pbqyHdgBn7E4/Zk/ICPtgafCCFaUcon2ZBsyvaiHVgroRT7Ch9i6fYUMXp5FuTK82Q5MrzY0o8UpnKYKYNUMXherIN2V6sh3Zxai2ZPyN2om+QqVr7h0J0o87E3YypWtEWtD9aI9aEowun2FDEuuwoon1WRdmyqKIM6KooeU3FSo5VC1RyqGLYDWiHeinWiDegpaiTaiZ12HvfskenYGXeuV9w7E3Rx0KuhmrhetEetDdbI9bJ6p5HHfYUWSVp2Fnp2Z/d8tGctPOimKM7KyuLLSjxWqOVQpUcqhyWB1oh3r2Ua0Qb37OR1EXk37JPmH5WnfBL8xbr+MW52vu3QnSjroTpRRt4TrZn76cFO9mV5W3BHauM9rl7JP2Fnum/ZDzy+WFLJeyNucxt46clmdmJ423D4Zp5X0UwGscXKz1UJmj1UVRsDrRn+RfTKtaM3yr4TBUdZZ3la/0S/wCjO7V8tGxYcz4ZbmSv0BsRoxrZPqxmiRH5FcJmNtfyts0vMviWZNEdeWn05yde5CTF8hywVXNOh8NM0fG05SMySrx74rj/AKNhezsa010eqhMV0E30U4y6hetdGV5l/hobV0ZPkPm2LonEV/ZghX9mCPGHXl97RPr6Hv0T6+jmiMnz3/LM2jR8/wBGdRK+WmfUIUghSChnybI/J8NCJHR+B9P7NefDRzfQxvoVl6Qx+izPpNu+mZWvbZqeR6Zlafomi/iW/swQr+zBGjzteX//2Q=="
											placeholder="blur"
											onError={() => setBlogUpdate({ ...blogUpdate, image: blogUpdate?.image })}
										/>
									</Box>
								)
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
									renderInput={params => (
										<TextField {...params} variant="outlined" label="Keywords" placeholder="Add keywords" />
									)}
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
			<Editor defaultValue={blog?.htmlContent} onChange={setContent} />
			<Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
				Save Blog
			</Button>
		</Paper>
	);
}
