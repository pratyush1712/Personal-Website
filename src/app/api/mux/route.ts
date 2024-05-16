import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

async function handler(req: Request) {
	const body = await req.json();

	const mux = new Mux({
		tokenId: process.env.NEXT_PUBLIC_MUX_ID,
		tokenSecret: process.env.NEXT_PUBLIC_MUX_SECRET
	});

	const resp = await mux.video.liveStreams.create({
		playback_policy: ["public"],
		new_asset_settings: { playback_policy: ["public"] }
	});

	return NextResponse.json({ resp, body });
}

export { handler as GET };
