import { formatGitHubData } from "../app/utils/helpers";

const user = (login: string, name: string | null = null) => ({
  node: { login, name, url: `https://github.com/${login}`, avatarUrl: `https://avatars/${login}` },
});
const repo = (nameWithOwner: string, stargazerCount = 1) => ({
  node: {
    nameWithOwner,
    description: `About ${nameWithOwner}`,
    url: `https://github.com/${nameWithOwner}`,
    stargazerCount,
    owner: { avatarUrl: "https://avatars/owner" },
  },
});

test("returns an empty array for missing or invalid data", () => {
  expect(formatGitHubData(undefined)).toEqual([]);
  expect(formatGitHubData({})).toEqual([]);
});

test("alternates repositories and users in the order GitHub ranked them", () => {
  const results = formatGitHubData({
    users: { edges: [user("zed", "Zed Shaw"), user("ann")] },
    repositories: { edges: [repo("facebook/react", 200000), repo("a/b")] },
  });

  expect(results.map((r) => r.name)).toEqual(["facebook/react", "Zed Shaw", "a/b", "ann"]);
  expect(results[0]).toMatchObject({ type: "repository", stars: 200000 });
  expect(results[1]).toMatchObject({ type: "user", avatarUrl: "https://avatars/zed" });
});

test("keeps the rest when one list is longer than the other", () => {
  const results = formatGitHubData({
    users: { edges: [user("ann")] },
    repositories: { edges: [repo("a/one"), repo("a/two"), repo("a/three")] },
  });

  expect(results.map((r) => r.name)).toEqual(["a/one", "ann", "a/two", "a/three"]);
});

test("falls back to the login when a user has no display name", () => {
  const [result] = formatGitHubData({ users: { edges: [user("torvalds")] }, repositories: { edges: [] } });
  expect(result.name).toBe("torvalds");
});

test("skips empty or incomplete nodes", () => {
  const results = formatGitHubData({
    users: { edges: [{ node: {} }, null, { node: null }, user("ann")] },
    repositories: { edges: [{ node: { nameWithOwner: "no/url" } }] },
  });

  expect(results.map((r) => r.name)).toEqual(["ann"]);
});

test("keeps at most 50 results", () => {
  const edges = Array.from({ length: 40 }, (_, i) => user(`user${String(i).padStart(2, "0")}`));
  const repositories = Array.from({ length: 40 }, (_, i) => repo(`o/repo${String(i).padStart(2, "0")}`));

  expect(formatGitHubData({ users: { edges }, repositories: { edges: repositories } })).toHaveLength(50);
});
