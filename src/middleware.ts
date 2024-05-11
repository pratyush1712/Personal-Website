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

const closeFriendsEndpoints = ["/blog/", "/video/", "/admin", "/sitemap.xml"];

const portfolioEndpoints = pages.map(page => `/${page.route}`);

const replaceDomain = (url: string, newDomain: string): URL => {
	const newUrl = new URL(url, newDomain);
	console.log("New URL", newUrl.href);
	return newUrl;
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

	/* Development, Staging, and Preview routing handling */
	// Protect the /admin route in all environments
	if (url.pathname.includes("/admin")) {
		if (!session || session.email !== "pratyushsudhakar03@gmail.com") {
			// Redirect to /login if the user is not authenticated
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	/* Production routing handling */
	const isProduction = process.env.NODE_ENV === "production";
	if (!isProduction) return NextResponse.next();
	console.log("Production environment");

	const prodBaseURL = "https://pratyushsudhakar.com";
	const prodPrivateURL = "https://private.pratyushsudhakar.com";

	if (normalizedHostname === prodBaseURL.split("://")[1]) {
		// Redirect all /close-friends/* requests to private.pratyushsudhakar.com/*
		if (url.pathname.startsWith("/close-friends") || url.pathname.startsWith("/login") || url.pathname.includes("/admin")) {
			const newPath = url.pathname.replace("/close-friends", "");
			console.log("Redirecting to private domain", newPath);
			return NextResponse.redirect(replaceDomain(newPath, prodPrivateURL));
		}
	} else if (normalizedHostname === prodPrivateURL.split("://")[1]) {
		// Rewrite all /* requests from /close-friends/*
		// redirect the / to /dashboard
		if (url.pathname === "/") {
			const newPath = `/close-friends${url.search}`;
			console.log(`Rewriting from ${newPath} to ${url.href}`);
			return NextResponse.rewrite(new URL(newPath, url.href));
		} else if (url.pathname === "/search") {
			console.log("Rewriting /search? from /close-friends?");
			const params = url.search;
			return NextResponse.rewrite(new URL("/close-friends" + params, url.href));
		} else if (closeFriendsEndpoints.some(endpoint => url.pathname.includes(endpoint)) || url.pathname === "/") {
			const newPath = `/close-friends${url.pathname}${url.search}`;
			console.log(`Rewriting from ${newPath} to ${url.href}`);
			return NextResponse.rewrite(new URL(newPath, url.href));
		} else if (portfolioEndpoints.some(endpoint => url.pathname.includes(endpoint))) {
			// redirect to main domain
			return NextResponse.redirect(replaceDomain(url.pathname, prodBaseURL));
		} else if (url.pathname === "/dashboard/sitemap.xml") {
			// redirect to main domain
			return NextResponse.rewrite(new URL("/close-friends/sitemap.xml", url.href));
		}
	}

	return NextResponse.next();
}