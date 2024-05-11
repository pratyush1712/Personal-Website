import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import pages from "./utils/pages";

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

const closeFriendsEndpoints = ["/blog/", "/video/", "/admin"]; // all the endpoints that are under /close-friends
const portfolioEndpoints = pages.map(page => `/${page.route}`); // all the endpoints that are under root

/* -----------------Development, Staging, and Production routing handling ------------------------*/
/*
	Development, Staging, and Preview routing handling:
		1. Protect the /admin route in all environments: only pratyush can access it.
		2. Redirect all /admin requests  to /login if the user is not authenticated.
		3. All the other routes are public.
	
	Production routing handling:
		1. Check the domain: pratyushsudhakar.com vs private.pratyushsudhakar.com.
		2. [private.pratyushsudhakar.com]: all /* routes are rewritten from /close-friends/*, except for /login, /_next, /_vercel, /_static, /api, and public files.
		3. [pratyushsudhakar.com]: all /close-friends/* routes are redirected to [private.pratyushsudhakar.com]/* where the content is rewritten. from /close-friends/* as defined in the previous point.
*/
export default async function middleware(request: NextRequest) {
	const url = request.nextUrl;
	const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	const hostname = request.headers.get("host")!;
	const normalizedHostname = hostname.replace(/:\d+$/, "");

	// Protect the /admin route in all environments
	if (url.pathname.includes("/admin")) {
		if (!session || session.email !== "pratyushsudhakar03@gmail.com") {
			// Redirect to /login if the user is not authenticated
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	/* Production routing handling */
	const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
	if (!isProduction) return NextResponse.next();

	const prodBaseURL = "https://pratyushsudhakar.com";
	const prodPrivateURL = "https://private.pratyushsudhakar.com";

	if (normalizedHostname === prodBaseURL.split("://")[1]) {
		if (url.pathname.startsWith("/close-friends") || url.pathname.startsWith("/login") || url.pathname.includes("/admin")) {
			// Redirect all /close-friends/*, /login, and /admin requests to private domain, except for /sitemap.xml
			if (url.pathname !== "/close-friends/sitemap.xml") {
				const newPath = url.pathname.replace("/close-friends", "");
				return NextResponse.redirect(new URL(newPath, prodPrivateURL));
			}
		}
	} else if (normalizedHostname === prodPrivateURL.split("://")[1]) {
		// Rewrite all /* requests from /close-friends/*
		if (url.pathname === "/") {
			// rewrite / from /close-friends
			const newPath = `/close-friends${url.search}`;
			return NextResponse.rewrite(new URL(newPath, url.href));
		} else if (url.pathname === "/search") {
			// rewrite /search from /close-friends
			const params = url.search;
			return NextResponse.rewrite(new URL("/close-friends" + params, url.href));
		} else if (closeFriendsEndpoints.some(endpoint => url.pathname.includes(endpoint)) || url.pathname === "/") {
			// rewrite all /* requests from /close-friends/*
			const newPath = `/close-friends${url.pathname}${url.search}`;
			return NextResponse.rewrite(new URL(newPath, url.href));
		} else if (portfolioEndpoints.some(endpoint => url.pathname.includes(endpoint))) {
			// redirect all portfolio endpoints to main domain
			return NextResponse.redirect(new URL(url.pathname, prodBaseURL));
		}
	}

	return NextResponse.next();
}
