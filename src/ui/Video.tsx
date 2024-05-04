export default function Video({
	src,
	autoPlay = false,
	loop = false,
	muted = false,
	controls = false,
	style = null,
	width = "100vw",
	height = "100%"
}: {
	src: string;
	autoPlay?: boolean;
	loop?: boolean;
	muted?: boolean;
	controls?: boolean;
	style?: React.CSSProperties | null;
	width?: string;
	height?: string;
}) {
	return (
		<video
			style={
				style || {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100%",
					objectFit: "cover",
					zIndex: -1
				}
			}
			preload="metadata"
			controls={controls}
			autoPlay={autoPlay}
			loop={loop}
			width={width}
			height={height}
			muted={muted}
		>
			<source src={src} type="video/mp4" />
			<track kind="captions" srcLang="en" src="/" default />
			Your browser does not support the video tag.
		</video>
	);
}
