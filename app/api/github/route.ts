import { NextResponse } from "next/server";
import { parse, print, visit } from "graphql";
import { MAX_TERM_LENGTH, MIN_TERM_LENGTH, SEARCH_QUERY } from "../../lib/searchQuery";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

// Compare documents by their printed form, so formatting differences do not matter.
// Apollo Client adds __typename fields to every selection set; they are ignored for the comparison.
const canonical = (document: string) =>
  print(
    visit(parse(document), {
      Field: (node) => (node.name.value === "__typename" ? null : undefined),
    })
  );
const ALLOWED_QUERY = canonical(SEARCH_QUERY);

const fail = (message: string, status: number) =>
  NextResponse.json({ errors: [{ message }] }, { status });

/**
 * Thin proxy to the GitHub GraphQL API. The token stays on the server and the route only
 * accepts the one search query used by the app, so it cannot be used as an open relay.
 */
export async function POST(request: Request) {
  // NEXT_PUBLIC_REACT_APP_GITHUB_API_KEY is the legacy name; it is only read here, on the server.
  const token =
    process.env.GITHUB_TOKEN ?? process.env.NEXT_PUBLIC_REACT_APP_GITHUB_API_KEY;
  if (!token) {
    return fail("The GitHub token is not configured on the server.", 503);
  }

  let body: { query?: unknown; variables?: { query?: unknown } };
  try {
    body = await request.json();
  } catch {
    return fail("The request body must be JSON.", 400);
  }

  let isAllowedQuery = false;
  try {
    isAllowedQuery = typeof body?.query === "string" && canonical(body.query) === ALLOWED_QUERY;
  } catch {
    // An unparsable document is treated like any other disallowed one.
  }
  if (!isAllowedQuery) {
    return fail("Only the search query is supported.", 400);
  }

  const term = body.variables?.query;
  if (
    typeof term !== "string" ||
    term.trim().length < MIN_TERM_LENGTH ||
    term.length > MAX_TERM_LENGTH
  ) {
    return fail(
      `The search term must have between ${MIN_TERM_LENGTH} and ${MAX_TERM_LENGTH} characters.`,
      400
    );
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-autocomplete-search",
    },
    // body.query was validated above: it only differs from SEARCH_QUERY by __typename fields.
    body: JSON.stringify({ query: body.query, variables: { query: term } }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!payload) {
    return fail("GitHub returned an unexpected response.", 502);
  }
  return NextResponse.json(payload, { status: response.status });
}
