import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
  type FetchResult,
} from "@apollo/client";

import AutoComplete from "../app/components/AutoComplete";
import { GET_USERS_AND_REPOS } from "../app/queries/searchQueries";
import type { GitHubSearchData } from "../app/types/searchTypes";
import { formatGitHubData } from "../app/utils/helpers";

const searchResult: GitHubSearchData = {
  users: {
    __typename: "SearchResultItemConnection",
    edges: [
      {
        __typename: "SearchResultItemEdge",
        node: {
          __typename: "User",
          login: "reactjs",
          name: "React",
          url: "https://github.com/reactjs",
          avatarUrl: "https://avatars/reactjs",
        },
      },
    ],
  },
  repositories: {
    __typename: "SearchResultItemConnection",
    edges: [
      {
        __typename: "SearchResultItemEdge",
        node: {
          __typename: "Repository",
          nameWithOwner: "facebook/react",
          description: "The library for web and native user interfaces.",
          url: "https://github.com/facebook/react",
          stargazerCount: 230000,
          owner: { __typename: "Organization", avatarUrl: "https://avatars/facebook" },
        },
      },
    ],
  },
};

// Answers every query itself, so the tests do not depend on how many intermediate terms are sent.
type Handler = (term: string) => FetchResult | Error;

function setup(handler: Handler = () => ({ data: searchResult })) {
  const terms: string[] = [];
  const link = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        const term = operation.variables.query as string;
        terms.push(term);
        const outcome = handler(term);
        if (outcome instanceof Error) {
          observer.error(outcome);
        } else {
          observer.next(outcome);
          observer.complete();
        }
      })
  );
  const client = new ApolloClient({ link, cache: new InMemoryCache() });

  const onItemSelect = jest.fn();
  const user = userEvent.setup();
  render(
    <ApolloProvider client={client}>
      <AutoComplete<GitHubSearchData>
        requestQuery={GET_USERS_AND_REPOS}
        formatData={formatGitHubData}
        onItemSelect={onItemSelect}
        renderIcon={() => null}
        debounceMs={0}
        suggestions={["react"]}
      />
    </ApolloProvider>
  );
  return { user, onItemSelect, terms, input: screen.getByRole("combobox", { name: /search github/i }) };
}

test("does not search for fewer than three characters", async () => {
  const { user, input, terms } = setup();

  await user.type(input, "re");

  expect(terms).toEqual([]);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(input).toHaveAttribute("aria-expanded", "false");
});

test("lists matching repositories and users with the term highlighted", async () => {
  const { user, input } = setup();

  await user.type(input, "react");

  const options = await screen.findAllByRole("option");
  expect(options).toHaveLength(2);
  expect(options[0]).toHaveTextContent("facebook/react");
  expect(options[0]).toHaveTextContent("The library for web and native user interfaces.");
  expect(options[0]).toHaveTextContent("230K");
  expect(options[1]).toHaveTextContent("React");
  expect(options[0].querySelector("mark")).toHaveTextContent("react");
  expect(input).toHaveAttribute("aria-expanded", "true");
});

test("moves with the arrow keys and opens the active result with Enter", async () => {
  const { user, input, onItemSelect } = setup();

  await user.type(input, "react");
  await screen.findAllByRole("option");
  expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");

  await user.keyboard("{ArrowDown}");
  expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
  expect(input).toHaveAttribute("aria-activedescendant", screen.getAllByRole("option")[1].id);

  await user.keyboard("{Enter}");
  expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ name: "React", type: "user" }));
});

test("opens a result on click", async () => {
  const { user, input, onItemSelect } = setup();

  await user.type(input, "react");
  await user.click((await screen.findAllByRole("option"))[0]);

  expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ name: "facebook/react" }));
});

test("says when nothing matches", async () => {
  const { user, input } = setup(() => ({
    data: {
      users: { __typename: "SearchResultItemConnection", edges: [] },
      repositories: { __typename: "SearchResultItemConnection", edges: [] },
    },
  }));

  await user.type(input, "zzzz");

  expect(await screen.findByText(/no results for/i)).toBeInTheDocument();
});

test("shows an error when the request fails", async () => {
  const { user, input } = setup(() => new Error("boom"));

  await user.type(input, "react");

  expect(await screen.findByRole("alert")).toHaveTextContent(/search is unavailable/i);
});

test("Escape closes the list first and then clears the input", async () => {
  const { user, input } = setup();

  await user.type(input, "react");
  await screen.findAllByRole("option");

  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  expect(input).toHaveValue("react");

  await user.keyboard("{Escape}");
  expect(input).toHaveValue("");
});

test("a suggestion fills the input and starts a search", async () => {
  const { user, input } = setup();

  await user.click(screen.getByRole("button", { name: "react" }));

  expect(input).toHaveValue("react");
  expect(await screen.findAllByRole("option")).toHaveLength(2);
});
