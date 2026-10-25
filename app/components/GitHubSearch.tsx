"use client";

import React from "react";
import { GoPerson, GoRepo } from "react-icons/go";

import AutoComplete from "./AutoComplete";
import { GET_USERS_AND_REPOS } from "../queries/searchQueries";
import type { GitHubSearchData, SearchResultType } from "../types/searchTypes";
import { formatGitHubData } from "../utils/helpers";

const SUGGESTIONS = ["react", "torvalds", "next.js", "vercel"];

const openOnGitHub = (item: SearchResultType) => {
  window.open(item.url, "_blank", "noopener,noreferrer");
};

const renderIcon = ({ type, avatarUrl }: SearchResultType) => {
  const shape = type === "user" ? "rounded-full" : "rounded-lg";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- small remote avatars, no need for the image optimizer
      <img
        src={avatarUrl}
        alt=""
        width={36}
        height={36}
        loading="lazy"
        decoding="async"
        className={`h-9 w-9 shrink-0 bg-white/10 object-cover ${shape}`}
      />
    );
  }

  const Icon = type === "user" ? GoPerson : GoRepo;
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center bg-white/10 text-lg ${shape}`}>
      <Icon aria-hidden="true" />
    </span>
  );
};

const GitHubSearch: React.FC = () => (
  <AutoComplete<GitHubSearchData>
    requestQuery={GET_USERS_AND_REPOS}
    formatData={formatGitHubData}
    onItemSelect={openOnGitHub}
    renderIcon={renderIcon}
    suggestions={SUGGESTIONS}
  />
);

export default GitHubSearch;
