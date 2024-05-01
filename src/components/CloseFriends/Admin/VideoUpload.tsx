"use client";
import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

export default function VideoUploadForm() {
	const [video, setVideo] = useState(null);

	const handleVideoChange = (event: any) => {
		setVideo(event.target.files[0]);
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		if (!video) {
			alert("Please select a video to upload.");
			return;
		}

		const formData = new FormData();
		formData.append("video", video);

		const response = await fetch("/api/videos/upload", {
			method: "POST",
			body: formData
		});

		if (response.ok) {
			alert("Video uploaded successfully!");
		} else {
			alert("Upload failed.");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Typography variant="h6">Upload Video</Typography>
			<TextField type="file" onChange={handleVideoChange} sx={{ mb: 2 }} />
			<Button variant="contained" type="submit">
				Upload
			</Button>
		</form>
	);
}
