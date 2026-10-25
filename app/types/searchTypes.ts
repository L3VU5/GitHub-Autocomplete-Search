export interface SearchResult {
  name: string;
  type: "user" | "repository";
  url: string;
  description?: string | null;
  stars?: number;
  avatarUrl?: string | null;
}

export type { SearchResult as SearchResultType };

// Shape of the data returned by SEARCH_QUERY. Nodes can be empty objects when GitHub
// returns something that is not a User or a Repository.
// Every object may also carry the __typename that Apollo Client asks for.
export interface GitHubSearchData {
  users?: {
    __typename?: string;
    edges: Array<{
      __typename?: string;
      node?: {
        __typename?: string;
        login?: string;
        name?: string | null;
        url?: string;
        avatarUrl?: string;
      } | null;
    } | null>;
  };
  repositories?: {
    __typename?: string;
    edges: Array<{
      __typename?: string;
      node?: {
        __typename?: string;
        nameWithOwner?: string;
        description?: string | null;
        url?: string;
        stargazerCount?: number;
        owner?: { __typename?: string; avatarUrl?: string } | null;
      } | null;
    } | null>;
  };
}
