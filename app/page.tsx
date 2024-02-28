"use client";

import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

import AutoComplete from "./components/AutoComplete";

const githubApiEndpoint: string = "https://api.github.com/graphql";

const client = new ApolloClient({
  uri: githubApiEndpoint,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_API_KEY}`,
  },
});

const GET_USERS_AND_REPOS = gql`
  query SearchQuery($query: String!) {
    users: search(query: $query, type: USER, first: 50) {
      edges {
        node {
          ... on User {
            login
          }
        }
      }
    }
    repositories: search(query: $query, type: REPOSITORY, first: 50) {
      edges {
        node {
          ... on Repository {
            name
          }
        }
      }
    }
  }
`;

export default function Home() {
  interface SearchResult {
    name: string;
    type: "user" | "repository";
  }


  const onAutoCompleteItemClick = (item: SearchResult) => {
    window.open(`https://github.com/${item.name}`, "_blank");
  };

  const getAutoCompleteItemLabel = (item: SearchResult) => {
    return `${item.type === "user" ? "User" : "Repository"}: ${item.name}`;
  };

  return (
    <ApolloProvider client={client}>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold mb-8">
          Search GitHub Users and Repositories
        </h1>

        <div className="flex-grow max-w-5xl w-full text-sm lg:flex">
          <AutoComplete
            requestQuery={GET_USERS_AND_REPOS}
            onItemClick={onAutoCompleteItemClick}
            itemLabelFn={getAutoCompleteItemLabel}
          />
        </div>

        <div className="flex flex-row-reverse max-w-5xl w-full font-mono text-sm">
          <a
            href="https://github.com/L3VU5"
            target="_blank"
            rel="noopener noreferrer"
          >
            By @PawelJedrasik
          </a>
        </div>
      </main>
    </ApolloProvider>
  );
}
