import * as React from "react";
import videojs from "video.js";

// Styles
import "video.js/dist/video-js.css";

interface IVideoPlayerProps {
	options: videojs.PlayerOptions;
}

const initialOptions: videojs.PlayerOptions = {
	controls: true,
	fluid: true,
	controlBar: {
		volumePanel: {
			inline: false
		}
	}
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options }) => {
	const videoNode = React.useRef<HTMLVideoElement>();
	const player = React.useRef<videojs.Player>();

	React.useEffect(() => {
		if (videoNode.current) {
			player.current = videojs(videoNode.current, {
				...initialOptions,
				...options
			}).ready(function () {
				console.log("onPlayerReady", this);
			});
		}
		return () => {
			if (player.current) {
				player.current.dispose();
			}
		};
	}, [options]);

	return <video ref={videoNode as React.RefObject<HTMLVideoElement>} className="video-js" />;
};

export default VideoPlayer;
