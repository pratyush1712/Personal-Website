"use client";
import { Box, Card, CardContent, CardMedia, Container, IconButton, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import songs from "@/utils/songs.json";

function truncateString(str: string, num: number) {
	return str.length <= num ? str : str.slice(0, num) + "...";
}

export default function PlayList() {
	const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const handlePlayPause = () => {
		setIsPlaying(prev => !prev);
	};

	const handleNextSong = () => {
		setCurrentSongIndex(prevIndex => (prevIndex + 1) % songs.length);
	};

	const handlePreviousSong = () => {
		setCurrentSongIndex(prevIndex => (prevIndex - 1 + songs.length) % songs.length);
	};

	useEffect(() => {
		if (containerRef.current) {
			const selectedCard = containerRef.current.children[currentSongIndex] as HTMLElement;
			containerRef.current.scrollTo({
				left: selectedCard.offsetLeft - containerRef.current.clientWidth / 2 + selectedCard.clientWidth / 2,
				behavior: "smooth"
			});
		}
	}, [currentSongIndex]);

	return (
		<Container
			ref={containerRef}
			sx={{
				mt: 4,
				minWidth: "100%",
				display: "flex",
				alignItems: "center",
				position: "relative",
				overflowX: "scroll",
				scrollbarWidth: "none",
				"&::-webkit-scrollbar": { display: "none" },
				transition: "padding-left 0.3s ease"
			}}>
			{songs.map((song, index) => {
				let size = 0.6;
				if (index === currentSongIndex) size = 1;
				else if (index === currentSongIndex - 1 || index === currentSongIndex + 1) size = 0.8;
				else if (index === currentSongIndex - 2 || index === currentSongIndex + 2) size = 0.7;

				return (
					<Box
						key={index}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							mx: 2,
							transition: "transform 0.3s ease",
							transform: `scale(${size})`,
							minWidth: `${size * 200}px`
						}}>
						<Card
							sx={{
								border: currentSongIndex === index ? "2px solid #1db954" : "1px solid #444",
								borderRadius: "50%",
								cursor: "pointer",
								minWidth: `${size * 200}px`,
								minHeight: `${size * 200}px`
							}}
							onClick={() => setCurrentSongIndex(index)}>
							<CardMedia
								component="img"
								sx={{ borderRadius: "50%" }}
								image={song.image}
								alt={song.name}
							/>
						</Card>
						<CardContent sx={{ textAlign: "center", minWidth: "180%" }}>
							<Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#fff" }}>
								{truncateString(song.name, 20)}
							</Typography>
							<Typography variant="caption" sx={{ color: "#bbb" }}>
								{truncateString(song.artist, 20)}
							</Typography>
						</CardContent>
					</Box>
				);
			})}
			{currentSongIndex !== null && (
				<Box
					sx={{
						position: "absolute",
						top: "100%",
						minHeight: "fit-content",
						left: "22%",
						width: "fit-content",
						display: "flex",
						alignItems: "center",
						backgroundColor: "#282828",
						minWidth: "30vw",
						borderRadius: "10px",
						px: 4,
						py: 2,
						zIndex: 999,
						boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
						justifyContent: "space-between"
					}}>
					<IconButton onClick={handlePreviousSong} sx={{ color: "#1db954" }}>
						<FaStepBackward />
					</IconButton>
					<IconButton onClick={handlePlayPause} sx={{ color: "#1db954", mx: 1 }}>
						{isPlaying ? <FaPause /> : <FaPlay />}
					</IconButton>
					<IconButton onClick={handleNextSong} sx={{ color: "#1db954" }}>
						<FaStepForward />
					</IconButton>
				</Box>
			)}
		</Container>
	);
}
