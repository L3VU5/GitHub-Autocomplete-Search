// The only GraphQL document the proxy forwards to GitHub (besides the __typename fields that
// Apollo Client adds on its own).
export const SEARCH_QUERY = /* GraphQL */ `
  query SearchQuery($query: String!) {
    # A USER search also returns organizations, which are a separate type in the schema.
    users: search(query: $query, type: USER, first: 25) {
      edges {
        node {
          ... on User {
            login
            name
            url
            avatarUrl(size: 64)
          }
          ... on Organization {
            login
            name
            url
            avatarUrl(size: 64)
          }
        }
      }
    }
    repositories: search(query: $query, type: REPOSITORY, first: 25) {
      edges {
        node {
          ... on Repository {
            nameWithOwner
            description
            url
            stargazerCount
            owner {
              avatarUrl(size: 64)
            }
          }
        }
      }
    }
  }
`;

export const MIN_TERM_LENGTH = 3;
export const MAX_TERM_LENGTH = 100;
