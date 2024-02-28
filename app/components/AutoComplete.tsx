"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  KeyboardEvent,
} from "react";
import { DocumentNode, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";

import TextInput from "./TextInput";
import { sortBy } from "lodash";

type AutoCompleteProps = {
  onItemClick: (result: SearchResult) => void;
  itemLabelFn: (result: SearchResult) => string;
  requestQuery: DocumentNode;
};

interface SearchResult {
  name: string;
  type: "user" | "repository";
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onItemClick,
  itemLabelFn,
  requestQuery,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [search, { loading, error, data }] = useLazyQuery(requestQuery, {
    variables: { query: "" },
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((options) => {
        search(options);
      }, 1000),
    [search]
  );

  useEffect(() => {
    if (inputValue.length < 3) {
      setResults([]);
      return;
    }

    debouncedSearch({ variables: { query: inputValue } });
  }, [debouncedSearch, inputValue]);

  useEffect(() => {
    if (data && data.users && data.repositories) {
      const users = data.users.edges.map((edge: any) => ({
        name: edge.node.name,
        type: "user",
      }));

      const repositories = data.repositories.edges.map((edge: any) => ({
        name: edge.node.name,
        type: "repository",
      }));

      const mergedResults = sortBy([...users, ...repositories], "name").slice(
        0,
        50
      );
      setResults(mergedResults);
    }
  }, [data]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const renderResults = () => {
    if (loading) {
      return <div className="my-4">Loading...</div>;
    }

    if (error) {
      return <div className="my-4">{error.toString()}</div>;
    }

    if (results.length > 0) {
      return (
        <ul className="max-h-[100%] overflow-auto">
          {results.map((result: SearchResult, index: number) => (
            <li
              onClick={() => onItemClick(result)}
              key={index}
              className="px-4 py-3 bg-primary-950 rounded cursor-pointer my-2"
              style={{
                fontWeight: index === activeIndex ? "bold" : "normal",
                textDecoration: index === activeIndex ? "underline" : "none",
              }}
            >
              {itemLabelFn(result)}
            </li>
          ))}
        </ul>
      );
    }

    return <div className="my-4">No results found</div>;
  };

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
        <div className="overflow-y-auto">{renderResults()}</div>
      )}
    </div>
  );
};

export default AutoComplete;
