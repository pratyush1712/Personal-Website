"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { NextSSRApolloClient, ApolloNextAppProvider, NextSSRInMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";

function makeClient() {
	const httpLink = new HttpLink({
		uri: "/api/graphql",
		fetchOptions: { cache: "no-store" },
		credentials: "same-origin"
	});

	const authLink = setContext(async (request, { headers }) => {
		const mutation = !request?.operationName?.includes("Get");
		return { headers: { ...headers, mutation } };
	});

	return new NextSSRApolloClient({
		ssrMode: typeof window === "undefined",
		cache: new NextSSRInMemoryCache(),
		link: typeof window === "undefined" ? ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), httpLink]) : authLink.concat(httpLink)
	});
}

export default function ApolloWrapper({ children }: React.PropsWithChildren) {
	return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
