import React from "react";
import { Box } from "@mui/material";

export default function FinalProjectVideo() {
	return (
		<Box
			component="iframe"
			src="/videos/project.mp4"
			title="Project Video"
			alignSelf={"center"}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			sx={{
				minWidth: "56.5% !important",
				minHeight: "60vh",
				padding: "0px 0",
				border: "5px solid #fff"
			}}
		/>
	);
}
