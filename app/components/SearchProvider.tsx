"use client";

import type { ReactNode } from "react";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

// The browser talks to our own /api/github route; the GitHub token never leaves the server.
const client = new ApolloClient({
  link: new HttpLink({ uri: "/api/github" }),
  cache: new InMemoryCache(),
});

export default function SearchProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
