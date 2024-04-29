import Mux from "@mux/mux-node";

import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
	message: string;
};

async function handler(req: Request) {
	const mux = new Mux({
		tokenId: process.env.NEXT_PUBLIC_MUX_ID,
		tokenSecret: process.env.NEXT_PUBLIC_MUX_SECRET
	});

	const resp = await mux.video.liveStreams.create({
		playback_policy: ["public"],
		new_asset_settings: { playback_policy: ["public"] }
	});

	return NextResponse.json(resp);
}

export { handler as GET };
