export interface SearchResult {
  name: string;
  type: "user" | "repository";
  url: string;
}

export type { SearchResult as SearchResultType };
