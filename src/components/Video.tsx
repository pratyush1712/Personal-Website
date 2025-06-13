"use client";

import { useEffect, useRef, forwardRef } from "react";

interface VideoProps {
	/** Base filename (without extension) under /public/founders/ */
	id: string;
	/** Fallback text for unsupported browsers */
	alt: string;
	/** Optional poster image URL (will default to `/founders/${id}.jpg`) */
	poster?: string;
	/** Additional Tailwind classes on container */
	className?: string;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(({ id, alt, poster, className = "" }: VideoProps, ref) => {
	const internalRef = useRef<HTMLVideoElement>(null);
	const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalRef;
	const posterSrc = poster ?? `/founders/${id}.jpg`;

	useEffect(() => {
		const vid = videoRef.current;
		if (!vid) return;

		const onPlay = () => {};

		vid.addEventListener("play", onPlay);
		return () => {
			vid.removeEventListener("play", onPlay);
		};
	}, [id, videoRef]);

	return (
		<div className={`relative aspect-video w-full ${className}`}>
			<video
				ref={videoRef}
				controls
				autoPlay
				preload="metadata"
				poster={posterSrc}
				controlsList="nodownload nofullscreen noremoteplayback"
				className="w-full h-full rounded-2xl shadow-lg object-cover bg-black">
				<source src={`/founders/${id}.mp4`} type="video/mp4" />
				<track src={`/founders/captions.vtt`} kind="subtitles" srcLang="en" label="English" default />
				<p className="sr-only">{alt}</p>
			</video>
		</div>
	);
});

Video.displayName = "Video";
export default Video;
