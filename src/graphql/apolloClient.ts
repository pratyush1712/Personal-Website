import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL,
	cache: new InMemoryCache()
});

export default client;
