// export const config = { matcher: ["/close-friends"] };
export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api routes
		 * 2. /_next (Next.js internals)
		 * 3. /_static (inside /public)
		 * 4. all root files inside /public (e.g. /favicon.ico)
		 */
		"/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"
	]
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
	const url = request.nextUrl;
	const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	const hostname = request.headers.get("host")!;
	const normalizedHostname = hostname.replace(/:\d+$/, "");

	// secure the api/graphql route
	if (url.pathname.includes("/api/graphql")) {
		if (!session) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		const method = request.method;
		if (method === "POST" && session.email !== "pratyushsudhakar03@gmail.com") {
			return NextResponse.error();
		}
		return NextResponse.next();
	}

	// if path contains /admin, then check if the user is pratyushsudhakar03@gmail.com
	if (url.pathname.includes("/admin")) {
		if (!session || session.email !== "pratyushsudhakar03@gmail.com") {
			return NextResponse.redirect(new URL("/close-friends", request.url));
		}
	}

	if (normalizedHostname === "localhost") {
		if (url.pathname === "/close-friends") {
			if (!session) {
				return NextResponse.redirect(new URL("/login", request.url));
			}
			return NextResponse.next();
		}
		return NextResponse.next();
	}

	// Handling requests intended for pratyushsudhakar.com
	if (normalizedHostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` && url.pathname === "/close-friends") {
		return NextResponse.redirect(new URL(`https://private.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, request.url));
	}

	// Handling requests intended for private.pratyushsudhakar.com
	if (normalizedHostname === `${process.env.NEXT_PUBLIC_PRIVATE_DOMAIN}`) {
		if (!session && url.pathname !== "/login") {
			return NextResponse.redirect(new URL("/login", url));
		}
		if (
			url.pathname !== "/login" &&
			!url.pathname.startsWith("/_next/") &&
			!url.pathname.startsWith("/_vercel/") &&
			!url.pathname.startsWith("/_static/") &&
			!url.pathname.startsWith("/api/") &&
			// public files
			url.pathname !== "/favicon.ico" &&
			url.pathname !== "/favicon.png" &&
			url.pathname !== "/robots.txt" &&
			url.pathname !== "/sitemap.xml" &&
			url.pathname !== "/manifest.json" &&
			!url.pathname.startsWith("/icons/") &&
			!url.pathname.startsWith("/readmes/") &&
			!url.pathname.startsWith("/videos/") &&
			!url.pathname.startsWith("/images/") &&
			!url.pathname.startsWith("/fonts/") &&
			!url.pathname.startsWith("/css/") &&
			!url.pathname.startsWith("/js/") &&
			!url.pathname.startsWith("/json/") &&
			!url.pathname.startsWith("/pdf/") &&
			!url.pathname.startsWith("/txt/") &&
			!url.pathname.startsWith("/xml/") &&
			!url.pathname.startsWith("/webfonts/") &&
			!url.pathname.startsWith("/webp/") &&
			!url.pathname.startsWith("/svg/") &&
			!url.pathname.startsWith("/audio/") &&
			!url.pathname.startsWith("/webm/") &&
			!url.pathname.startsWith("/mp4/") &&
			!url.pathname.startsWith("/public/")
		) {
			// If authenticated, serve the content from /close-friends. private.pratyushsudhakar.com/* -> pratyushsudhakar.com/close-friends/*
			return NextResponse.rewrite(new URL(`/close-friends${url.pathname}`, url));
		}
	}

	// Proceed with other requests normally
	return NextResponse.next();
}
