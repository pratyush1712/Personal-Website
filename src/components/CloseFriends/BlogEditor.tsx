"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Button, Typography } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client";

const GET_BLOGS = gql`
	query GetBlogs {
		blogs {
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

export default function BlogEditor() {
	const { data: blogsData, loading: blogsLoading, error: blogsError } = useQuery(GET_BLOGS);
	const [createBlog, { data, loading, error }] = useMutation(CREATE_BLOG_MUTATION);
	const [content, setContent] = useState("");

	useEffect(() => {
		if (blogsData) {
			console.log("Blog created:", blogsData);
		}
	}, [blogsData]);

	if (blogsLoading) return <p>Loading...</p>;
	if (blogsError) return <p>Error fetching blogs: {blogsError.message}</p>;
	console.log("blogsData:", blogsData);

	const handleSubmit = async () => {
		try {
			const input = {
				title: "New Blog Title",
				details: "New Blog Details",
				htmlContent: content,
				keywords: ["new", "blog"],
				tags: ["new", "blog"],
				image: `https://source.unsplash.com/random?sig=${Math.random() * 100}`,
				createdAt: new Date().toISOString()
			};
			const result = await createBlog({ variables: { input } });
			console.log("Blog created:", result.data.createBlog);
		} catch (e) {
			console.error("Error creating blog:", e);
		}
	};

	// show the blogs map
	return (
		<div>
			<Typography variant="h5" sx={{ mb: 4 }}>
				Blog Editor
			</Typography>
			{blogsData.blogs.map((blog: any) => (
				<div key={blog.id}>
					<Typography variant="h6">{blog.title}</Typography>
					<Typography variant="body1">{blog.details}</Typography>
					<img src={blog.image} alt={blog.title} style={{ width: "100px" }} />
					<div dangerouslySetInnerHTML={{ __html: blog.htmlContent }} />
				</div>
			))}
			<ReactQuill theme="snow" value={content} onChange={setContent} />
			<Button onClick={handleSubmit} variant="contained" color="primary">
				Save Blog
			</Button>
		</div>
	);
}
