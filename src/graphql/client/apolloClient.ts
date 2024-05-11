import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
	return new ApolloClient({
		ssrMode: typeof window === "undefined",
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL,
			fetchOptions: { cache: "no-store" },
			credentials: "same-origin"
		})
	});
});
