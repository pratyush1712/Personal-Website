"use client";
import React, { useRef, useState } from "react";
import { Button, TextField, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { Autocomplete, Chip, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(
	async () => {
		const { default: RQ } = await import("react-quill");
		return ({ forwardedRef, ...props }: { forwardedRef: React.RefObject<any>; [key: string]: any }) => (
			<RQ ref={forwardedRef} {...props} />
		);
	},
	{ ssr: false }
);
import "react-quill/dist/quill.snow.css";
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
			keywords
			tags
			htmlContent
		}
	}
`;

export default function BlogEditor({ blog }: { blog: any }) {
	const [content, setContent] = useState(blog?.htmlContent || "");
	const [blogUpdate, setBlogUpdate] = useState(blog);
	const [htmlEditOpen, setHtmlEditOpen] = useState(false);
	const [htmlContent, setHtmlContent] = useState("");
	const quillRef = useRef(null);
	const [createBlog, { loading: creating, error: createError }] = useMutation(CREATE_BLOG_MUTATION);
	const [updateBlog, { loading: updating, error: updateError }] = useMutation(UPDATE_BLOG_MUTATION);

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
			["clean"],
			["code-block"],
			["html"]
		]
	};

	const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "image", "code-block"];

	const handleHtmlEditOpen = () => {
		const editor = (quillRef.current as any).getEditor();
		setHtmlContent(editor.root.innerHTML);
		setHtmlEditOpen(true);
	};

	const handleHtmlEditClose = () => {
		setHtmlEditOpen(false);
	};

	const handleHtmlSave = () => {
		const editor = (quillRef.current as any).getEditor();
		editor.root.innerHTML = htmlContent;
		setContent(editor.root.innerHTML);
		setHtmlEditOpen(false);
	};

	const handleHtmlChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		setHtmlContent(event.target.value);
	};

	const handleSubmit = async () => {
		const input = { ...blogUpdate, htmlContent: content };
		delete input.id;
		delete input.__typename;

		if (blog.id) {
			await updateBlog({ variables: { input, id: blog.id } });
		} else {
			await createBlog({ variables: { input } });
		}
	};

	if (creating || updating) return <CircularProgress color="inherit" />;
	if (createError || updateError)
		return <Alert severity="error">Error saving blog: {createError?.message || updateError?.message}</Alert>;

	return (
		<Paper elevation={3} sx={{ p: 3, maxWidth: "100%" }}>
			<Typography variant="h4" gutterBottom>
				Blog Editor
			</Typography>
			<Typography variant="subtitle1">{blog.title}</Typography>
			<TextField
				fullWidth
				label="Title"
				variant="outlined"
				margin="normal"
				defaultValue={blog.title}
				onBlur={e => setBlogUpdate({ ...blogUpdate, title: e.target.value })}
			/>
			{/* description and image */}
			<TextField
				fullWidth
				label="Description"
				variant="outlined"
				margin="normal"
				defaultValue={blog.details}
				onBlur={e => setBlogUpdate({ ...blogUpdate, details: e.target.value })}
			/>
			<TextField
				fullWidth
				label="Image URL"
				variant="outlined"
				margin="normal"
				defaultValue={blog.image}
				onBlur={e => setBlogUpdate({ ...blogUpdate, image: e.target.value })}
			/>
			{/* image preview next-image*/}
			<Image src={blog.image} alt={blog.title} width={200} height={200} />
			<Box display="flex" gap={2} sx={{ my: 2 }}>
				<Autocomplete
					multiple
					options={[]}
					defaultValue={blogUpdate.tags}
					freeSolo
					sx={{ flexGrow: 1 }}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => (
							<Chip variant="outlined" label={option} sx={{ borderRadius: 1.5, p: 2 }} {...getTagProps({ index })} />
						))
					}
					renderInput={params => <TextField {...params} variant="outlined" label="Tags" placeholder="Add tags" />}
					onChange={(event, newValue) => setBlogUpdate({ ...blogUpdate, tags: newValue })}
				/>
				<Autocomplete
					multiple
					options={[]}
					defaultValue={blogUpdate.keywords}
					freeSolo
					sx={{ flexGrow: 1 }}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => (
							<Chip variant="outlined" label={option} sx={{ borderRadius: 1.5, p: 2 }} {...getTagProps({ index })} />
						))
					}
					renderInput={params => <TextField {...params} variant="outlined" label="Keywords" placeholder="Add keywords" />}
					onChange={(event, newValue) => setBlogUpdate({ ...blogUpdate, keywords: newValue })}
				/>
			</Box>
			<ReactQuill forwardedRef={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} />
			<Button onClick={handleHtmlEditOpen} variant="outlined" sx={{ mt: 2, mr: 1 }}>
				Edit HTML
			</Button>
			<Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
				Save Blog
			</Button>
			<Dialog open={htmlEditOpen} onClose={handleHtmlEditClose} fullWidth maxWidth="md">
				<DialogTitle>Edit HTML</DialogTitle>
				<DialogContent>
					<TextField fullWidth multiline minRows={10} value={htmlContent} onChange={handleHtmlChange} variant="outlined" />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleHtmlEditClose}>Cancel</Button>
					<Button onClick={handleHtmlSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
}
