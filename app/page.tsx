"use client";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Search from "./components/GitHubSearch";

const githubApiEndpoint: string = "https://api.github.com/graphql";

const client = new ApolloClient({
  uri: githubApiEndpoint,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_API_KEY}`,
  },
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <main className="flex min-h-screen flex-col items-center p-24">
        <Header />

        <div className="flex-grow max-w-5xl w-full text-sm lg:flex">
          <Search />
        </div>

        <Footer />
      </main>
    </ApolloProvider>
  );
}
