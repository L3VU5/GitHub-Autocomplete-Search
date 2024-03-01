import { gql } from "@apollo/client";

export const GET_USERS_AND_REPOS = gql`
  query SearchQuery($query: String!) {
    users: search(query: $query, type: USER, first: 50) {
      edges {
        node {
          ... on User {
            name
            url
          }
        }
      }
    }
    repositories: search(query: $query, type: REPOSITORY, first: 50) {
      edges {
        node {
          ... on Repository {
            name
            url
          }
        }
      }
    }
  }
`;
