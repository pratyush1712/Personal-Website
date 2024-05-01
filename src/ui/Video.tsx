export default function Video({ src, autoPlay, loop, muted }: { src: string; autoPlay: boolean; loop: boolean; muted: boolean }) {
	return (
		<video
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100%",
				objectFit: "cover",
				zIndex: -1
			}}
			preload="metadata"
			controls={false}
			autoPlay={autoPlay}
			loop={loop}
			muted={muted}
		>
			<source src={src} type="video/mp4" />
			<track kind="captions" srcLang="en" src="/" default />
			Your browser does not support the video tag.
		</video>
	);
}
