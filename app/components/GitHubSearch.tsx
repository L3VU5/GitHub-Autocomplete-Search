import React, { ReactNode } from "react";
import { GoRepo, GoPerson } from "react-icons/go";

import AutoComplete from "./AutoComplete";
import { GET_USERS_AND_REPOS } from "../queries/searchQueries";
import { SearchResultType } from "../types/searchTypes";
import { formatGitHubData } from "../utils/helpers";

const GitHubSearch: React.FC = () => {
  const onAutoCompleteItemClick = (item: SearchResultType) => {
    window.open(item.url, "_blank");
  };

  const getAutoCompleteItemIcon = (type: string): ReactNode => {
    return type === "repository" ? (
      <GoRepo className="w-6 h-6 mr-2" />
    ) : (
      <GoPerson className="w-6 h-6 mr-2" />
    );
  };

  return (
    <AutoComplete
      requestQuery={GET_USERS_AND_REPOS}
      onItemClick={onAutoCompleteItemClick}
      itemIconFn={getAutoCompleteItemIcon}
      formatData={formatGitHubData}
    />
  );
};

export default GitHubSearch;
