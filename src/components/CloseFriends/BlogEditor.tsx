"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Button, Typography } from "@mui/material";

export default function BlogEditor() {
	const [content, setContent] = useState("");

	const handleSubmit = async () => {
		// Example: POST to your API endpoint
		const response = await fetch("/api/blogs/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ content })
		});

		if (response.ok) {
			alert("Blog posted successfully!");
		} else {
			alert("Failed to post blog.");
		}
	};

	return (
		<div>
			<Typography variant="h6">Blog Editor</Typography>
			<ReactQuill theme="snow" value={content} onChange={setContent} />
			<Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
				Post Blog
			</Button>
		</div>
	);
}
