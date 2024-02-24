"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

import TextInput from "./TextInput";

interface AutoCompleteProps {
  handleRequest: (query: string) => Promise<SearchResult[]>;
  onItemClick: (result: SearchResult) => void;
  itemLabelFn: (result: SearchResult) => string;
}

interface SearchResult {
  name: string;
  type: "user" | "repository";
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  handleRequest,
  onItemClick,
  itemLabelFn,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.length >= 3) {
      setLoading(true);
      handleRequest(inputValue)
        .then((results) => {
          setSearchResults(results);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setSearchResults([]);
          setLoading(false);
        });
    } else {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (event.key === "ArrowDown" && activeIndex !== searchResults.length - 1) {
      // Move down the list
      setActiveIndex((prevIndex) => (prevIndex === null ? 0 : prevIndex + 1));
    } else if (event.key === "ArrowUp" && activeIndex !== 0) {
      // Move up the list
      setActiveIndex((prevIndex) => (prevIndex === null ? 0 : prevIndex - 1));
    } else if (event.key === "Enter" && activeIndex !== null) {
      onItemClick(searchResults[activeIndex]);
    }
  };

  const renderResults = () => {
    if (loading) {
      return <div className="my-4">Loading...</div>;
    }

    if (error) {
      return <div className="my-4">{error.toString()}</div>;
    }

    if (searchResults.length > 0) {
      return (
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={result.name}
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
    <div className="w-full flex flex-col">
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search repositories or users..."
      />
      <>{inputValue.length >= 3 && renderResults()}</>
    </div>
  );
};

export default AutoComplete;
