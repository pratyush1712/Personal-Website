"use client";
import React, { useState, useRef, useMemo } from "react";
import {
	Button,
	TextField,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Snackbar,
	Box,
	Divider,
	Grid,
	Tab,
	Tabs,
	Autocomplete,
	Chip
} from "@mui/material";
import { useMutation, gql } from "@apollo/client";
import VideoEditorTools from "./VideoEditorTools";
import VideoJS from "./VideoJS";
import VideoPlayer from "./VideoJS";
import { set } from "mongoose";
import videojs from "video.js";
import { minWidth } from "@mui/system";
import { create } from "domain";

const CREATE_VIDEO = gql`
	mutation CreateVideo($input: NewVideoInput!) {
		createVideo(input: $input) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			videoUrl
		}
	}
`;

const UPDATE_VIDEO = gql`
	mutation UpdateVideo($input: NewVideoInput!, $id: ID!) {
		updateVideo(input: $input, id: $id) {
			id
			title
			details
			access
			image
			createdAt
			updatedAt
			keywords
			tags
			videoUrl
		}
	}
`;

export default function VideoEditor({ video }: { video: any }) {
	const [title, setTitle] = useState(video ? video.title : "");
	const [details, setDetails] = useState(video ? video.details : "");
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tabValue, setTabValue] = useState(0);
	const [videoUrl, setVideoUrl] = useState(video ? video.videoUrl : "");
	const [posterURL, setPosterURL] = useState(video ? video.posterURL : "");

	const videoInputRef = useRef(null);
	const posterInputRef = useRef(null);

	const [createOrUpdateVideo] = useMutation(video ? UPDATE_VIDEO : CREATE_VIDEO, { refetchQueries: ["GetVideos"] });
	const handleSave = async () => {
		if (!title || !details || !videoFile || !posterFile) {
			setError("Please fill all fields, select a video, and a poster image.");
			return;
		}
		setLoading(true);
		await createOrUpdateVideo({
			variables: {
				id: video?.id,
				input: {
					title,
					details,
					videoUrl: videoUrl,
					image: posterURL,
					keywords: [],
					tags: [],
					createdAt: video?.createdAt || new Date().toISOString(),
					updatedAt: new Date().toISOString()
				}
			}
		})
			.then(() => {
				setLoading(false);
				setError(null);
			})
			.catch(err => {
				setLoading(false);
				setError(err.message);
			});
	};

	const handlePosterChange = (e: any) => {
		const file = e?.target?.files?.[0];
		if (!file) return;
		setPosterFile(file);

		const formData = new FormData();
		formData.append("image", file);
		formData.append("type", "poster");

		fetch("/api/images", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(data => setPosterURL(data[0]));
	};

	const handleVideoChange = (e: any) => {
		const file = e?.target?.files?.[0];
		if (!file) return;
		setVideoFile(file);

		const formData = new FormData();
		formData.append("image", file);
		formData.append("type", "video");

		fetch("/api/images", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(data => setVideoUrl(data[0]));
	};

	const handleChangeTab = (event: any, newValue: React.SetStateAction<number>) => {
		setTabValue(newValue);
	};

	const playerRef = React.useRef<{ on: (event: string, callback: () => void) => void } | null>(null);

	return (
		<Paper>
			{/* Navigation Tabs for Video Editor */}
			<Tabs value={tabValue} onChange={handleChangeTab} aria-label="video editor tabs">
				<Tab label="Upload" />
				<Tab label="Record" />
				<Tab label="Edit" />
			</Tabs>

			{/* Main Content Area */}
			<Box p={3}>
				<Typography variant="h5">{video ? "Edit Video" : "New Video"}</Typography>
				<Divider style={{ margin: "20px 0" }} />
				<Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", minWidth: "100%", gap: 3, mb: 3 }}>
					<VideoEditorTools status={status} src={videoUrl} />
					<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", mt: -1.5 }}>
						<TextField
							fullWidth
							label="Title"
							variant="outlined"
							margin="normal"
							defaultValue={title}
							onBlur={e => setTitle(e.target.value)}
						/>
						<TextField
							fullWidth
							label="Description"
							variant="outlined"
							margin="normal"
							maxRows={7}
							minRows={7}
							multiline
							defaultValue={details}
							onBlur={e => setDetails(e.target.value)}
						/>
					</Box>
				</Box>

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Button
							onClick={() => (videoInputRef.current as any)?.click()}
							fullWidth
							variant="outlined"
							color="inherit"
							style={{ marginBottom: 12 }}
						>
							{videoFile ? "Change Video" : "Upload Video"}
						</Button>
						<input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} hidden />

						<Button onClick={() => (posterInputRef.current as any)?.click()} fullWidth variant="outlined" color="inherit">
							{posterFile ? "Change Poster" : "Upload Poster"}
						</Button>
						<input ref={posterInputRef} type="file" accept="image/*" onChange={handlePosterChange} hidden />
					</Grid>
				</Grid>
				{/* Loading and Error Handling */}
				{loading && <CircularProgress />}
				{error && <Alert severity="error">{error}</Alert>}

				<Button color="primary" variant="contained" onClick={handleSave} fullWidth style={{ marginTop: 20 }}>
					Save
				</Button>
			</Box>

			{/* Snackbar for Displaying Errors */}
			<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} message={error} />
		</Paper>
	);
}
