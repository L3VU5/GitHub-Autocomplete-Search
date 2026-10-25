import type { GitHubSearchData, SearchResult } from "../types/searchTypes";

const MAX_RESULTS = 50;

export const formatGitHubData = (data: GitHubSearchData | undefined): SearchResult[] => {
  if (!data?.users || !data?.repositories) {
    return [];
  }

  const users: SearchResult[] = [];
  for (const edge of data.users.edges) {
    const node = edge?.node;
    const name = node?.name || node?.login;
    if (node?.url && name) {
      users.push({ name, type: "user", url: node.url, avatarUrl: node.avatarUrl });
    }
  }

  const repositories: SearchResult[] = [];
  for (const edge of data.repositories.edges) {
    const node = edge?.node;
    if (node?.url && node.nameWithOwner) {
      repositories.push({
        name: node.nameWithOwner,
        type: "repository",
        url: node.url,
        description: node.description,
        stars: node.stargazerCount,
        avatarUrl: node.owner?.avatarUrl,
      });
    }
  }

  // GitHub already ranks each list by relevance, so alternate between them instead of
  // sorting by name: the best repository and the best account both end up near the top.
  const merged: SearchResult[] = [];
  for (let i = 0; i < Math.max(users.length, repositories.length); i++) {
    if (repositories[i]) merged.push(repositories[i]);
    if (users[i]) merged.push(users[i]);
  }

  return merged.slice(0, MAX_RESULTS);
};
