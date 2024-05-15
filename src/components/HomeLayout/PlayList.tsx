"use client";
import React, { ComponentType, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-bubble-ui/dist/index.css";
import "@/styles/playlist.css";
import songs from "@/utils/songs.json";
import Image from "next/image";
import dynamic from "next/dynamic";

const BubbleUI: ComponentType<any> = dynamic(() =>
	import("react-bubble-ui").then(mod => mod.default as ComponentType<any>)
);

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
	numCols: 7,
	fringeWidth: 160,
	yRadius: 130,
	xRadius: 220,
	cornerRadius: 50,
	showGuides: false,
	compact: true,
	gravitation: 5
};
const ITEMS_PER_LOAD = 20;

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
		}, 4000);

		return () => clearInterval(intervalId);
	}, []);

	const handleBubbleClick = useCallback((url: string | URL | undefined) => {
		window.open(url, "_blank");
	}, []);

	useEffect(() => {
		setDisplayedSongs(randomSongs.slice(0, ITEMS_PER_LOAD));
	}, []);

	const loadMoreSongs = useCallback(() => {
		setDisplayedSongs(prevSongs => {
			const newSongs = randomSongs.slice(randomSongsOffset.current, randomSongsOffset.current + ITEMS_PER_LOAD);
			randomSongsOffset.current += ITEMS_PER_LOAD;
			return prevSongs.map((song, index) => (index % 2 === switchRef.current ? newSongs[index] : song));
		});
		switchRef.current = switchRef.current === 0 ? 1 : 0;
	}, [randomSongs]);

	useEffect(() => {
		// check if the displayed songs are unique
		const ids = displayedSongs.map(song => song.id);
		const uniqueIds = [...new Set(ids)];
		if (ids.length !== uniqueIds.length) {
			console.log(ids);
			console.log(uniqueIds);
			console.log("Duplicate songs found");
		}
	}, [displayedSongs]);

	const songBubbles = useMemo(
		() =>
			displayedSongs.map((song, index) => {
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
						onClick={() => handleBubbleClick(`https://open.spotify.com/track/${song.id}`)}>
						<Image
							loading="lazy"
							onError={e => (e.currentTarget.src = "/images/default.jpg")}
							src={song?.image}
							alt={song?.name}
							width={options.size}
							height={options.size}
							style={{
								borderRadius: "50%",
								transition: "transform 0.3s ease"
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
		<BubbleUI options={options} className="myBubbleUI">
			{songBubbles}
		</BubbleUI>
	);
}
