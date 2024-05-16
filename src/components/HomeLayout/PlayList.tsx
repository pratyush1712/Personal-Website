"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-bubble-ui/dist/index.css";
import "@/styles/playlist.css";
import songs from "@/utils/songs.json";
import Image from "next/image";
import { Container, Typography } from "@mui/material";
import { FaSpotify } from "react-icons/fa";
import BubbleUI from "./Play";
// const BubbleUI: ComponentType<any> = dynamic(() =>
// 	import("react-bubble-ui").then(mod => mod.default as ComponentType<any>)
// );

const shuffle = (array: any[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

const options = {
	size: 180,
	minSize: 50,
	gutter: 20,
	provideProps: false,
	fringeWidth: 160,
	yRadius: 130,
	xRadius: 220,
	cornerRadius: 50,
	showGuides: false,
	compact: true,
	gravitation: 5
};
const ITEMS_PER_LOAD = 20;

function PlaylistLabel() {
	return (
		<Container
			sx={{
				textAlign: "center",
				position: "absolute",
				zIndex: 2,
				top: "30%",
				left: "28%",
				width: "max-content",
				py: 2,
				px: 0,
				alignItems: "center",
				borderRadius: "10px",
				border: "2px solid black",
				backgroundColor: "rgba(29, 185,84, 0.8)"
			}}>
			<Typography
				variant="h4"
				sx={{
					color: "white",
					px: 0,
					mx: 0
				}}>
				My Spotify Playlist
				<FaSpotify
					style={{
						color: "white",
						fontSize: "1.20em",
						marginLeft: "10px",
						verticalAlign: "middle"
					}}
				/>
			</Typography>
		</Container>
	);
}

export default function PlayList() {
	const hoverRef = useRef<number>(-1);
	const [hoverIndex, setHoverIndex] = useState<number>(-1);
	const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | undefined>();
	const switchRef = useRef<number>(0);
	const randomSongsOffset = useRef<number>(0);
	const randomSongs = useMemo(() => shuffle(songs), []);
	const [displayedSongs, setDisplayedSongs] = useState<any[]>(randomSongs.slice(0, ITEMS_PER_LOAD));

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (hoverRef.current === -1) loadMoreSongs();
		}, 7000);

		return () => clearInterval(intervalId);
	}, []);

	const handleBubbleClick = useCallback((url: string | URL | undefined) => {
		window.open(url, "_blank");
	}, []);

	useEffect(() => {
		setDisplayedSongs(randomSongs.slice(0, ITEMS_PER_LOAD));
	}, []);

	const loadMore = useCallback(() => {
		console.log("Loading more songs");
		randomSongsOffset.current += ITEMS_PER_LOAD;
		const newSongs = randomSongs.slice(randomSongsOffset.current, randomSongsOffset.current + ITEMS_PER_LOAD);
		console.log("New songs", newSongs);
		return newSongs.map((song, index) => {
			if (!song || !song.image) {
				console.log("Invalid song", song);
				return null;
			}
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
							hoverRef.current = index;
						}, 600);
						setHoverTimeoutId(timeoutId);
					}}
					onMouseLeave={() => {
						if (hoverTimeoutId) clearTimeout(hoverTimeoutId);
						setHoverIndex(-1);
						hoverRef.current = -1;
					}}
					onClick={() => handleBubbleClick(`https://open.spotify.com/track/${song?.id}`)}>
					<Image
						loading="lazy"
						onError={e => (e.currentTarget.src = "/images/default.jpg")}
						src={song?.image}
						alt={song?.name}
						width={options.size}
						height={options.size}
						style={{
							borderRadius: "50%",
							transition: "transform 0.3s ease",
							border: "3px solid rgba(29, 185,84, 0.8)"
						}}
					/>
					<div className="tooltip">
						{song?.name} By: {song?.artist}
					</div>
				</div>
			);
		});
	}, [randomSongs]);

	const loadMoreSongs = useCallback(() => {
		setDisplayedSongs(prevSongs => {
			const newSongs = randomSongs.slice(randomSongsOffset.current, randomSongsOffset.current + ITEMS_PER_LOAD);
			randomSongsOffset.current += ITEMS_PER_LOAD;
			return prevSongs.map((song, index) => (index % 2 === switchRef.current ? newSongs[index] : song));
		});
		switchRef.current = switchRef.current === 0 ? 1 : 0;
	}, [randomSongs]);

	const songBubbles = useMemo(
		() =>
			displayedSongs.map((song, index) => {
				if (!song || !song.image) {
					console.log("Invalid song", song);
					return null;
				}
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
								hoverRef.current = index;
							}, 600);
							setHoverTimeoutId(timeoutId);
						}}
						onMouseLeave={() => {
							if (hoverTimeoutId) clearTimeout(hoverTimeoutId);
							setHoverIndex(-1);
							hoverRef.current = -1;
						}}
						onClick={() => handleBubbleClick(`https://open.spotify.com/track/${song?.id}`)}>
						<Image
							loading="lazy"
							onError={e => (e.currentTarget.src = "/images/default.jpg")}
							src={song?.image}
							alt={song?.name}
							width={options.size}
							height={options.size}
							style={{
								borderRadius: "50%",
								transition: "transform 0.3s ease",
								border: "3px solid rgba(29, 185,84, 0.8)"
							}}
						/>
						<div className="tooltip">
							{song?.name} By: {song?.artist}
						</div>
					</div>
				);
			}),
		[displayedSongs, hoverIndex, handleBubbleClick, options.size, hoverTimeoutId]
	);

	return (
		<Container sx={{ position: "relative", height: "100%" }}>
			{/* <PlaylistLabel /> */}
			<BubbleUI options={options} className="myBubbleUI" style={{}} loadMore={loadMore}>
				{songBubbles}
			</BubbleUI>
		</Container>
	);
}
