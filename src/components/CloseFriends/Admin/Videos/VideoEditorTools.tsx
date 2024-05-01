import React from "react";
import { Button, Box, Typography } from "@mui/material";

const VideoEditorTools = ({ status, src }: { status: string; src: string }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<video src={src} style={{ width: "45vw" }} autoPlay controls>
				<source src={src} type="video/mp4" />
			</video>
		</Box>
	);
};

export default VideoEditorTools;
