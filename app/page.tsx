"use client";

import AutoComplete from "./components/AutoComplete";

export default function Home() {
  interface SearchResult {
    name: string;
    type: "user" | "repository";
  }

  const { REACT_APP_GITHUB_API_KEY } = process.env;

  const githubApiEndpoint: string =
    "https://api.github.com/search?type=users+repositories";

  const onAutoCompleteItemClick = (item: SearchResult) => {
    window.open(`https://github.com/${item.name}`, "_blank");
  };

  const getAutoCompleteItemLabel = (item: SearchResult) => {
    return `${item.type === "user" ? "User" : "Repository"}: ${item.name}`;
  };

  const onSearch = async (query: string) => {
    try {
      const response = await fetch(`${githubApiEndpoint}&q=${query}`, {
        headers: {
          Authorization: `token ${REACT_APP_GITHUB_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      const users = data.items
        .filter((item: any) => item.type === "User")
        .map((item: any) => {
          return { name: item.login, type: "user" };
        });

      const repositories = data.items
        .filter((item: any) => item.type === "Repository")
        .map((item: any) => {
          return { name: item.name, type: "repository" };
        });

      return [...users, ...repositories];
    } catch (error) {
      throw error;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Search GitHub</h1>

      <div className="flex-grow max-w-5xl w-full text-sm lg:flex">
        <AutoComplete
          handleRequest={onSearch}
          onItemClick={onAutoCompleteItemClick}
          itemLabelFn={getAutoCompleteItemLabel}
        />
      </div>

      <div className="flex-row-reverse max-w-5xl w-full font-mono text-sm lg:flex">
        <a
          href="https://github.com/L3VU5"
          target="_blank"
          rel="noopener noreferrer"
        >
          By @PawelJedrasik
        </a>
      </div>
    </main>
  );
}
