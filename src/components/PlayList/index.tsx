"use client";
import React, { useState } from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import "@/styles/playlist.css";
import songs from "@/utils/songs.json";
import Image from "next/image";

export default function PlayList() {
	const [hoverIndex, setHoverIndex] = useState(-1);

	const options = {
		size: 200,
		minSize: 50,
		gutter: 8,
		provideProps: false,
		numRows: 3,
		fringeWidth: 160,
		yRadius: 130,
		xRadius: 220,
		cornerRadius: 50,
		showGuides: false,
		compact: true,
		gravitation: 5
	};

	const handleBubbleClick = (url: string | URL | undefined) => {
		window.open(url, "_blank");
	};

	const songBubbles = songs.map((song, index) => {
		return (
			<div
				key={index}
				className={`bubble ${hoverIndex === index ? "bubble-hover" : ""}`}
				style={{
					width: options.size,
					height: options.size,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: "all 0.5s ease",
					cursor: "pointer",
					position: "relative"
				}}
				onMouseEnter={() => setHoverIndex(index)}
				onMouseLeave={() => setHoverIndex(-1)}
				onClick={() => handleBubbleClick(`https://open.spotify.com/track/${song.id}`)}
			>
				<Image
					src={song.image}
					alt={song.name}
					width={options.size - 25}
					height={options.size - 25}
					style={{
						borderRadius: "50%",
						transition: "transform 0.3s ease",
						zIndex: hoverIndex === index ? -1 : 1
					}}
				/>
			</div>
		);
	});

	return (
		<div className="playlist">
			<BubbleUI options={options} className="myBubbleUI">
				{songBubbles}
			</BubbleUI>
		</div>
	);
}
