import { gql } from "@apollo/client";
import { SEARCH_QUERY } from "../lib/searchQuery";

export const GET_USERS_AND_REPOS = gql(SEARCH_QUERY);
