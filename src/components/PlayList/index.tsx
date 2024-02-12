"use client";
import React from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import "@/styles/playlist.css";
import { songs } from "@/utils/songs";
import Iframe from "react-iframe";

export default function PlayList() {
	const options = {
		size: 180, // This might be adjusted based on the bubble size you wish to achieve
		minSize: 50,
		gutter: 8,
		provideProps: true, // Change to true to pass custom props to children
		numCols: 4,
		fringeWidth: 160,
		yRadius: 130,
		xRadius: 220,
		cornerRadius: 50,
		showGuides: false,
		compact: true,
		gravitation: 5
	};

	// Adjust bubble size based on song priority
	const getBubbleSize = (priority: number) => {
		// Example logic: adjust as needed
		const baseSize = 50; // Min size
		const maxSize = 180; // Max size
		return baseSize + (maxSize - baseSize) * (priority / 10); // Assuming priority is on a scale of 1 to 10
	};

	const songBubbles = songs.map((song, index) => (
		<div
			key={index}
			className="bubble"
			style={{
				width: getBubbleSize(song.priority),
				height: getBubbleSize(song.priority),
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
			onMouseOver={e => {
				const target = e.currentTarget.firstChild as HTMLElement;
				if (target) {
					target.style.display = "none";
				}
			}}
			onMouseOut={e => {
				const target = e.currentTarget.firstChild as HTMLElement;
				if (target) {
					target.style.display = "block";
				}
			}}
		>
			<Iframe
				url={song.url}
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
				styles={{ display: "none", border: "none", maxHeight: "80px", borderRadius: "13px", margin: "7px 0px", width: "100%" }}
			/>
			<span>{song?.artist}</span>
		</div>
	));

	return (
		<div className="playlist">
			<BubbleUI options={options} className="myBubbleUI">
				{songBubbles}
			</BubbleUI>
		</div>
	);
}
