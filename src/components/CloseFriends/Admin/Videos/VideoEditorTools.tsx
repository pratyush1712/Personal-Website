import React from "react";
import { Box } from "@mui/material";

const VideoEditorTools = ({ src }: { src: string }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100%"
			}}>
			<video src={src} style={{ width: "48.2vw" }} autoPlay controls>
				<source src={src} type="video/mp4" />
			</video>
		</Box>
	);
};

export default VideoEditorTools;
