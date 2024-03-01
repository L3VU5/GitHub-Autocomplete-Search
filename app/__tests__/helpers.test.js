import { formatGitHubData } from "../utils/helpers";

const mockData = {
  users: {
    edges: [
      { node: { name: "User1", type: "user", url: "user1url" } },
      { node: { name: "User2", type: "user", url: "user2url" } },
    ],
  },
  repositories: {
    edges: [
      { node: { name: "Repo1", type: "repository", url: "repo1url" } },
      { node: { name: "Repo2", type: "repository", url: "repo2url" } },
    ],
  },
};

test("returns empty array for invalid data", () => {
  const formattedData = formatGitHubData({});
  expect(formattedData).toHaveLength(0);
});

test("formats data correctly", () => {
  const formattedData = formatGitHubData(mockData);
  const expectedData = [
    { name: "Repo1", type: "repository", url: "repo1url" },
    { name: "Repo2", type: "repository", url: "repo2url" },
    { name: "User1", type: "user", url: "user1url" },
    { name: "User2", type: "user", url: "user2url" },
  ];
  expect(formattedData).toHaveLength(4);
  expect(formattedData).toEqual(expectedData);
});
