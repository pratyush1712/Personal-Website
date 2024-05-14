import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
	return new ApolloClient({
		ssrMode: typeof window === "undefined",
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						accessContents: {
							keyArgs: false,
							read(existing, { args: { offset, limit } }: any) {
								// console.log("existing read", existing);
								// A read function should always return undefined if existing is
								// undefined. Returning undefined signals that the field is
								// missing from the cache, which instructs Apollo Client to
								// fetch its value from your GraphQL server.
								console.log(offset, limit);
								console.log("existing", existing);
								console.log("existing", existing?.slice(offset, offset + limit));
								return existing && existing.slice(offset, offset + limit);
							},

							merge(existing, incoming, { args: { offset = 0 } }: any) {
								console.log(existing, incoming);
								const merged = existing ? existing.slice(0) : [];
								for (let i = 0; i < incoming.length; ++i) {
									merged[offset + i] = incoming[i];
								}
								return merged;
							}
						}
					}
				}
			}
		}),
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL,
			fetchOptions: { cache: "no-store" },
			credentials: "same-origin"
		})
	});
});
