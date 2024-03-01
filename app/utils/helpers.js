import { sortBy } from "lodash";

export const formatGitHubData = (data) => {
  if (data?.users && data?.repositories) {
    const users = data.users.edges.map((edge) => ({
      ...edge.node,
      type: "user",
    }));

    const repositories = data.repositories.edges.map((edge) => ({
      ...edge.node,
      type: "repository",
    }));

    const mergedResults = sortBy([...users, ...repositories], (r) =>
      r.name?.toLowerCase()
    ).slice(0, 50);

    return mergedResults;
  }

  return [];
};
