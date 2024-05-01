"use client";

import { ApolloProvider as Provider } from "@apollo/client";
import client from "./apolloClient";

export const ApolloProvider = ({ children }: { children: React.ReactNode }) => <Provider client={client}>{children}</Provider>;
