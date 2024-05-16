"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-bubble-ui/dist/index.css";
import "@/styles/playlist.css";
import songs from "@/utils/songs.json";
import Image from "next/image";
import { Container, Typography } from "@mui/material";
import { FaSpotify } from "react-icons/fa";
import BubbleUI from "./Play";

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
				bottom: "0%",
				left: "5%",
				width: "max-content",
				py: 2,
				px: 0,
				backgroundColor: "#333",
				alignItems: "center",
				borderLeft: "1px solid #1db954",
				borderBottom: "1px solid #1db954"
			}}>
			<Typography
				variant="body2"
				sx={{
					color: "white",
					px: 0,
					mx: 0
				}}>
				My Spotify Playlist. Scroll to see more songs...
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
	// const switchRef = useRef<number>(0);
	const randomSongsOffset = useRef<number>(0);
	const randomSongs = useMemo(() => shuffle(songs), []);
	const [displayedSongs, setDisplayedSongs] = useState<any[]>(randomSongs.slice(0, ITEMS_PER_LOAD));

	const handleBubbleClick = useCallback((url: string | URL | undefined) => {
		window.open(url, "_blank");
	}, []);

	useEffect(() => {
		setDisplayedSongs(randomSongs.slice(0, ITEMS_PER_LOAD));
	}, [randomSongs]);

	const loadMore = useCallback(
		(prev: any) => {
			randomSongsOffset.current += ITEMS_PER_LOAD;
			if (randomSongsOffset.current >= randomSongs.length) {
				randomSongsOffset.current = 0;
				return [...prev.slice(ITEMS_PER_LOAD, prev.length), ...shuffle(prev.slice(0, ITEMS_PER_LOAD))];
			}
			const newSongs = randomSongs.slice(randomSongsOffset.current, randomSongsOffset.current + ITEMS_PER_LOAD);
			return [
				...prev,
				...newSongs.map((song, index) => {
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
							<Typography
								variant="subtitle2"
								sx={{
									position: "absolute",
									paddingLeft: "auto",
									paddingRight: "auto",
									height: "auto",
									backgroundColor: "rgba(30, 30, 30, 0.9)",
									textAlign: "center",
									left: 0
								}}>
								{song?.name} By: {song?.artist}
							</Typography>
						</div>
					);
				})
			];
		},
		[randomSongs, handleBubbleClick, hoverIndex, hoverTimeoutId]
	);

	// const loadMoreSongs = useCallback(() => {
	// 	setDisplayedSongs(prevSongs => {
	// 		const newSongs = randomSongs.slice(randomSongsOffset.current, randomSongsOffset.current + ITEMS_PER_LOAD);
	// 		randomSongsOffset.current += ITEMS_PER_LOAD;
	// 		return prevSongs.map((song, index) => (index % 2 === switchRef.current ? newSongs[index] : song));
	// 	});
	// 	switchRef.current = switchRef.current === 0 ? 1 : 0;
	// }, [randomSongs]);

	// useEffect(() => {
	// 	const intervalId = setInterval(() => {
	// 		if (hoverRef.current === -1) loadMoreSongs();
	// 	}, 7000);

	// 	return () => clearInterval(intervalId);
	// }, [loadMoreSongs]);

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
							position: "relative",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.5s ease",
							cursor: "pointer"
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
						<Typography
							variant="subtitle2"
							sx={{
								position: "absolute",
								paddingLeft: "auto",
								paddingRight: "auto",
								height: "auto",
								backgroundColor: "rgba(30, 30, 30, 0.9)",
								textAlign: "center",
								left: 0
							}}>
							{song?.name} By: {song?.artist}
						</Typography>

						<div className="tooltip" style={{ zIndex: 15 }}>
							{song?.name} By: {song?.artist}
						</div>
					</div>
				);
			}),
		[displayedSongs, hoverIndex, handleBubbleClick, hoverTimeoutId]
	);

	return (
		<Container sx={{ position: "relative", height: "100%" }}>
			<PlaylistLabel />
			<BubbleUI options={options} className="myBubbleUI" style={{ zIndex: -1 }} loadMore={loadMore}>
				{songBubbles}
			</BubbleUI>
		</Container>
	);
}
