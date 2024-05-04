"use client";
import React, { ComponentType, useState } from "react";
import "react-bubble-ui/dist/index.css";
import "@/styles/playlist.css";
import songs from "@/utils/songs.json";
import Image from "next/image";
import dynamic from "next/dynamic";

const BubbleUI: ComponentType<any> = dynamic(
	() => import("react-bubble-ui").then(mod => mod.default as ComponentType<any>),
	{}
);
const shuffle = (array: any[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

const randomSongs = shuffle(songs);
const options = {
	size: 180,
	minSize: 50,
	gutter: 20,
	provideProps: false,
	numCols: 7,
	fringeWidth: 160,
	yRadius: 130,
	xRadius: 220,
	cornerRadius: 50,
	showGuides: false,
	compact: true,
	gravitation: 5
};

export default function PlayList() {
	const [hoverIndex, setHoverIndex] = useState<Number>(-1);
	const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | undefined>();

	const handleBubbleClick = (url: string | URL | undefined) => {
		window.open(url, "_blank");
	};

	const songBubbles = randomSongs.map((song, index) => {
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
				onMouseEnter={() => {
					const timeoutId = setTimeout(() => {
						setHoverIndex(index);
					}, 600);
					setHoverTimeoutId(timeoutId);
				}}
				onMouseLeave={() => {
					clearTimeout(hoverTimeoutId);
					setHoverIndex(-1);
				}}
				onClick={() => handleBubbleClick(`https://open.spotify.com/track/${song.id}`)}
			>
				<Image
					loading="lazy"
					src={song.image}
					alt={song.name}
					width={options.size}
					height={options.size}
					style={{
						borderRadius: "50%",
						transition: "transform 0.3s ease"
					}}
				/>
				<div className="tooltip">
					{song.name} By: {song.artist}
				</div>
			</div>
		);
	});

	return (
		<BubbleUI options={options} className="myBubbleUI">
			{songBubbles}
		</BubbleUI>
	);
}
