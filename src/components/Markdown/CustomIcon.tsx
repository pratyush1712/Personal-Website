"use client";

import { Icon } from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";

export default function CustomIcon(props: any) {
	const sendOutbound = (event: any) => {
		sendGAEvent({ event: "ND Link Clicked", value: props.src });
	};

	return <Icon component="img" src={props.src} onClick={sendOutbound} />;
}
