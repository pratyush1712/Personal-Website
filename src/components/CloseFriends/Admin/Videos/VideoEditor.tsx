"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button, TextField, Typography, Paper, CircularProgress, Alert, Snackbar, Box, Divider } from "@mui/material";
import { useMutation, gql } from "@apollo/client";
import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder";

const CREATE_VIDEO_MUTATION = gql`
	mutation CreateVideo($input: NewVideoInput!) {
		createVideo(input: $input) {
			id
			title
			details
			image
			createdAt
			keywords
			tags
			videoUrl
			playbackId
		}
	}
`;

const UPDATE_VIDEO_MUTATION = gql`
	mutation UpdateVideo($id: ID!, $input: NewVideoInput!) {
		updateVideo(id: $id, input: $input) {
			id
			title
			details
			image
			createdAt
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: true });

	const [createVideo, { data: createData }] = useMutation(CREATE_VIDEO_MUTATION);
	const [updateVideo, { data: updateData }] = useMutation(UPDATE_VIDEO_MUTATION);

	const handleVideoUpload = async (videoFile: File) => {
		if (videoFile) {
			const formData = new FormData();
			formData.append("image", videoFile);
			formData.append("type", "video");
			const response = await fetch("/api/images", {
				method: "POST",
				body: formData
			});
			const data = await response.json();
			return data;
		}
	};

	const handleSave = async () => {
		if (!title || !details || !videoFile) {
			setError("Please fill all fields and select a video.");
			return;
		}
		try {
			setLoading(true);
			const uploadResult = await handleVideoUpload(videoFile);
			const response = await (video ? updateVideo : createVideo)({
				variables: {
					id: video?.id,
					input: { title, details, videoUrl: uploadResult?.url, playbackId: uploadResult?.playbackId }
				}
			});
			console.log("GraphQL response:", response);
		} catch (e) {
			console.error("Saving error:", e);
			setError("Failed to save video.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Paper>
			<Box p={2}>
				<Typography variant="h5" gutterBottom>
					{video ? "Edit Video" : "New Video"}
				</Typography>
				<Divider />
				<Box mt={2}>
					<TextField
						fullWidth
						label="Title"
						value={title}
						onChange={e => setTitle(e.target.value)}
						variant="outlined"
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Details"
						value={details}
						multiline
						rows={4}
						onChange={e => setDetails(e.target.value)}
						variant="outlined"
						margin="normal"
					/>
					<input
						ref={videoInputRef}
						type="file"
						accept="video/*"
						onChange={e => e.target.files && setVideoFile(e.target.files[0])}
						hidden
					/>
					<Button variant="outlined" onClick={() => videoInputRef.current?.click()} fullWidth>
						{videoFile ? "Change Video" : "Upload Video"}
					</Button>
					<ReactMediaRecorder
						video
						render={({ status, startRecording, stopRecording, mediaBlobUrl, previewStream }) => {
							console.log("status:", status);
							console.log("mediaBlobUrl:", mediaBlobUrl);
							console.log("previewStream:", previewStream);
							return (
								<Box mt={2}>
									<Typography variant="h6">Video Preview</Typography>
									<Box sx={{ display: "flex", gap: 4, py: 3 }}>
										<Button variant="contained" onClick={startRecording}>
											Start Recording
										</Button>
										<Button variant="contained" onClick={stopRecording}>
											Stop Recording
										</Button>
									</Box>
									<video src={mediaBlobUrl} controls />
								</Box>
							);
						}}
					/>
					{loading && <CircularProgress />}
					{error && <Alert severity="error">{error}</Alert>}
				</Box>
				<Box mt={2}>
					<Button color="primary" variant="contained" onClick={handleSave} fullWidth>
						Save
					</Button>
				</Box>
			</Box>
			<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} message={error} />
		</Paper>
	);
}
