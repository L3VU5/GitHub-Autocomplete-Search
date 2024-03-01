"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  KeyboardEvent,
  ReactNode,
} from "react";
import { DocumentNode, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { sortBy } from "lodash";

import TextInput from "./TextInput";
import { SearchResultType } from "../types/searchTypes";

type AutoCompleteProps = {
  onItemClick: (result: SearchResultType) => void;
  itemIconFn: (type: string) => ReactNode;
  requestQuery: DocumentNode;
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onItemClick,
  requestQuery,
  itemIconFn,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [results, setResults] = useState<SearchResultType[]>([]);
  const [fetchingData, setFetchingData] = useState<Boolean>(false);
  const [search, { loading, error, data }] = useLazyQuery(requestQuery, {
    variables: { query: "" },
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((options) => {
        search(options).then(() => {
          setFetchingData(false);
        });
      }, 1000),
    [search]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.value?.length >= 3) {
      setFetchingData(true);
      debouncedSearch({ variables: { query: event.target.value } });
    } else {
      setResults([]);
    }

    setActiveIndex(0);
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (event.key === "ArrowDown" && activeIndex !== results.length - 1) {
      // Move down the list
      setActiveIndex((prevIndex) => (prevIndex === null ? 0 : prevIndex + 1));
    } else if (event.key === "ArrowUp" && activeIndex !== 0) {
      // Move up the list
      setActiveIndex((prevIndex) => (prevIndex === null ? 0 : prevIndex - 1));
    } else if (event.key === "Enter" && activeIndex !== null) {
      onItemClick(results[activeIndex]);
    }
  };

  const renderResults = useCallback(() => {
    if (error) {
      return <div className="my-4 mx-2">{error.toString()}</div>;
    }

    if (loading || fetchingData) {
      return (
        <div className="flex justify-center my-4 mx-2">
          <div className="w-8 h-8 border-4 border-background-800 border-t-primary-400 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (results.length === 0) {
      return <div className="my-4 mx-2">No results found.</div>;
    }

    return (
      <ul ref={listRef} className="flex flex-col gap-1 overflow-auto">
        {results.map((result: SearchResultType, index: number) => (
          <li
            onClick={() => onItemClick(result)}
            key={index}
            className={`flex items-center text-base cursor-pointer p-2 rounded ${
              index === activeIndex ? "bg-primary-400" : ""
            }`}
          >
            {itemIconFn(result.type)}
            {result.name || "N/A"}
            <div
              className={`ml-auto text-sm ${
                index === activeIndex ? "text-primary-100" : "text-primary-300"
              }`}
            >
              {result.url}
            </div>
          </li>
        ))}
      </ul>
    );
  }, [
    error,
    loading,
    fetchingData,
    results,
    activeIndex,
    itemIconFn,
    onItemClick,
  ]);

  useEffect(() => {
    if (data && data.users && data.repositories) {
      const users: SearchResultType[] = data.users.edges.map((edge: any) => ({
        ...edge.node,
        type: "user",
      }));

      const repositories: SearchResultType[] = data.repositories.edges.map(
        (edge: any) => ({
          ...edge.node,
          type: "repository",
        })
      );

      const mergedResults = sortBy([...users, ...repositories], (r) =>
        r.name?.toLowerCase()
      ).slice(0, 50);
      setResults(mergedResults);
    }
  }, [data]);

  useEffect(() => {
    if (activeIndex !== null && listRef?.current?.scrollIntoView) {
      const listItem = listRef.current.querySelector(
        `li:nth-child(${activeIndex + 1})`
      );

      if (listItem) {
        listItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className="w-full flex flex-col h-full">
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing..."
      />
      {inputValue.length >= 3 && (
        <div className="p-2 mt-3 bg-primary-900 rounded max-h-96 overflow-auto">
          {renderResults()}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
