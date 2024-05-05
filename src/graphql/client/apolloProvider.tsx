"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { NextSSRApolloClient, ApolloNextAppProvider, NextSSRInMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";

function makeClient() {
	const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL });

	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache(),
		link: typeof window === "undefined" ? ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), httpLink]) : httpLink
	});
}

export default function ApolloWrapper({ children }: React.PropsWithChildren) {
	return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
