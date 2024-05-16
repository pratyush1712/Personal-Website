"use client";
import React, { useState, useRef } from "react";
import { Button, TextField, Typography, Paper, CircularProgress, Alert, Snackbar, Box } from "@mui/material";
import { Divider, Grid, Tab, Tabs, Autocomplete, Chip, MenuItem, Select, Backdrop } from "@mui/material";
import { useMutation, gql } from "@apollo/client";
import VideoEditorTools from "./VideoEditorTools";
// import VideoJS from "./VideoJS";
// import VideoPlayer from "./VideoJS";
import Image from "@/ui/Image";
import { GET_CONTENTS, GET_VIDEOS } from "@/graphql/client/queries";

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
	const [access, setAccess] = useState<string>(video?.access || "private");
	const [keywords, setKeywords] = useState<string[]>(video ? video.keywords : []);
	const [tags, setTags] = useState<string[]>(video ? video.tags : []);
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tabValue, setTabValue] = useState(0);
	const [videoUrl, setVideoUrl] = useState(video ? video.videoUrl : "");
	const [posterURL, setPosterURL] = useState(video ? video.image : "");

	const videoInputRef = useRef(null);
	const posterInputRef = useRef(null);

	const [createVideo] = useMutation(CREATE_VIDEO, {
		refetchQueries: [{ query: GET_VIDEOS }, { query: GET_CONTENTS }]
	});
	const [updateVideo] = useMutation(UPDATE_VIDEO, {
		refetchQueries: [{ query: GET_VIDEOS }, { query: GET_CONTENTS }]
	});

	const handleSave = async () => {
		if (!title || !details || !(videoFile || videoUrl) || !(posterFile || posterURL)) {
			setError("Please fill all fields, select a video, and a poster image.");
			return;
		}
		setLoading(true);
		const input = {
			title: title,
			details: details,
			access: access,
			keywords: keywords,
			tags: tags,
			videoUrl: videoUrl || "",
			image: posterURL || "",
			createdAt: video?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		const mutation = video ? updateVideo : createVideo;
		await mutation({ variables: { id: video?.id, input } })
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
		setLoading(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "poster");

		fetch("/api/upload", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(data => (setPosterURL(data[0]), setLoading(false)));
	};

	const handleVideoChange = (e: any) => {
		const file = e?.target?.files?.[0];
		if (!file) return;
		setVideoFile(file);
		setLoading(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "video");

		fetch("/api/upload", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(data => (setVideoUrl(data[0]), setLoading(false)));
	};

	const handleChangeTab = (event: any, newValue: React.SetStateAction<number>) => {
		setTabValue(newValue);
	};

	// const playerRef = React.useRef<{ on: (event: string, callback: () => void) => void } | null>(null);

	return (
		<Paper>
			<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Tabs value={tabValue} onChange={handleChangeTab} aria-label="video editor tabs">
				<Tab label="Upload" />
				<Tab label="Record" />
				<Tab label="Edit" />
			</Tabs>

			<Box p={3}>
				<Typography variant="h5">{video ? "Edit Video" : "New Video"}</Typography>
				<Divider style={{ margin: "20px 0" }} />
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-start",
						minWidth: "100%",
						gap: 3,
						mb: 3
					}}>
					<VideoEditorTools src={videoUrl} />
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
							maxRows={5}
							minRows={5}
							multiline
							defaultValue={details}
							onBlur={e => setDetails(e.target.value)}
						/>
						<Select label="Access" value={access} onChange={e => setAccess(e.target.value)} sx={{ mt: 2 }}>
							<MenuItem value="public">Public</MenuItem>
							<MenuItem value="private">Private</MenuItem>
							<MenuItem value="close-friends">Close Friends</MenuItem>
						</Select>
						<Box display="flex" gap={2} sx={{ mt: 2, pr: 2 }}>
							<Autocomplete
								multiple
								id="tags"
								options={[]}
								value={tags}
								sx={{ maxWidth: "50%", minWidth: "50%" }}
								onChange={(event, newValue) => {
									setTags(newValue);
								}}
								freeSolo
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											variant="outlined"
											label={option}
											{...getTagProps({ index })}
											key={index}
										/>
									))
								}
								renderInput={params => <TextField {...params} label="Tags" variant="outlined" />}
							/>
							<Autocomplete
								multiple
								id="keywords"
								options={[]}
								sx={{ maxWidth: "50%", minWidth: "50%" }}
								value={keywords}
								onChange={(event, newValue) => {
									setKeywords(newValue);
								}}
								freeSolo
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											variant="outlined"
											label={option}
											{...getTagProps({ index })}
											key={index}
										/>
									))
								}
								renderInput={params => <TextField {...params} label="Keywords" variant="outlined" />}
							/>
						</Box>
					</Box>
				</Box>

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Button
							onClick={() => (videoInputRef.current as any)?.click()}
							variant="outlined"
							color="inherit"
							sx={{ minWidth: "25%", maxWidth: "25%", mr: 1 }}>
							{videoFile ? "Change Video" : "Upload Video"}
						</Button>
						<input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} hidden />
						<Button
							onClick={() => (posterInputRef.current as any)?.click()}
							variant="outlined"
							color="inherit"
							sx={{ minWidth: "25%", maxWidth: "25%", ml: 1 }}>
							{posterFile ? "Change Poster" : "Upload Poster"}
						</Button>
						<input ref={posterInputRef} type="file" accept="image/*" onChange={handlePosterChange} hidden />
					</Grid>
				</Grid>
				<Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
					<Image src={posterURL} width={300} height={300} alt="poster" />
				</Box>
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
