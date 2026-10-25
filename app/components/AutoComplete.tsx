"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useQuery, type DocumentNode } from "@apollo/client";
import { FiStar } from "react-icons/fi";

import Highlight from "./Highlight";
import TextInput from "./TextInput";
import useDebouncedValue from "../hooks/useDebouncedValue";
import type { SearchResultType } from "../types/searchTypes";

type AutoCompleteProps<TData> = {
  requestQuery: DocumentNode;
  formatData: (data: TData | undefined) => SearchResultType[];
  onItemSelect: (result: SearchResultType) => void;
  renderIcon: (result: SearchResultType) => ReactNode;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  suggestions?: string[];
};

const compactNumber = new Intl.NumberFormat("en", { notation: "compact" });

export default function AutoComplete<TData>({
  requestQuery,
  formatData,
  onItemSelect,
  renderIcon,
  placeholder = "Start typing...",
  minChars = 3,
  debounceMs = 400,
  suggestions = [],
}: AutoCompleteProps<TData>) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const term = inputValue.trim();
  const debouncedTerm = useDebouncedValue(term, debounceMs);
  const enabled = debouncedTerm.length >= minChars;

  const { data, loading, error } = useQuery<TData, { query: string }>(requestQuery, {
    variables: { query: debouncedTerm },
    skip: !enabled,
  });

  const results = useMemo(() => (enabled ? formatData(data) : []), [enabled, data, formatData]);
  const hasTerm = term.length >= minChars;
  const isPending = hasTerm && (term !== debouncedTerm || loading);
  const isOpen = hasTerm && !dismissed;
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const activeOptionId =
    isOpen && !isPending && !error && results.length > 0 ? optionId(safeIndex) : undefined;

  useEffect(() => {
    if (activeOptionId) {
      document.getElementById(activeOptionId)?.scrollIntoView?.({ block: "nearest" });
    }
  }, [activeOptionId]);

  const updateValue = (value: string) => {
    setInputValue(value);
    setActiveIndex(0);
    setDismissed(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      // First Escape closes the list, the second one clears the input.
      if (isOpen) setDismissed(true);
      else if (inputValue) updateValue("");
      return;
    }

    if (!activeOptionId) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((safeIndex + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((safeIndex - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      onItemSelect(results[safeIndex]);
    }
  };

  let status = "";
  if (isOpen) {
    if (isPending) status = "Searching";
    else if (error) status = "The search failed";
    else status = results.length === 0 ? "No results" : `${results.length} results`;
  }

  const renderPanel = () => {
    if (isPending) {
      return (
        <div className="flex items-center justify-center gap-3 px-4 py-8 text-sm text-slate-400">
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-sky-400"
          />
          Searching GitHub...
        </div>
      );
    }

    if (error) {
      return (
        <div role="alert" className="px-4 py-6 text-center text-sm">
          <p className="font-medium text-rose-300">The search is unavailable right now.</p>
          <p className="mt-1 text-slate-500">{error.message}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <p className="px-4 py-8 text-center text-sm text-slate-400">
          No results for &ldquo;{term}&rdquo;.
        </p>
      );
    }

    return (
      <ul id={listboxId} role="listbox" aria-label="Search results" className="max-h-96 overflow-auto p-2">
        {results.map((result, index) => {
          const active = index === safeIndex;
          return (
            <li
              key={`${result.type}-${result.url}`}
              id={optionId(index)}
              role="option"
              aria-selected={active}
              onMouseMove={() => !active && setActiveIndex(index)}
              onClick={() => onItemSelect(result)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                active ? "bg-sky-400/15" : ""
              }`}
            >
              {renderIcon(result)}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-white">
                  <Highlight text={result.name} term={term} />
                </span>
                {result.description ? (
                  <span className="block truncate text-xs text-slate-400">{result.description}</span>
                ) : (
                  <span className="hidden truncate text-xs text-slate-500 md:block">{result.url}</span>
                )}
              </span>
              {typeof result.stars === "number" && (
                <span className="hidden shrink-0 items-center gap-1 text-xs text-slate-400 sm:flex">
                  <FiStar aria-hidden="true" />
                  {compactNumber.format(result.stars)}
                </span>
              )}
              <span className="shrink-0 rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] text-slate-400">
                {result.type === "user" ? "User" : "Repo"}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full">
      <TextInput
        ref={inputRef}
        role="combobox"
        aria-label="Search GitHub"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        value={inputValue}
        onChange={(event) => updateValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onClear={() => {
          updateValue("");
          inputRef.current?.focus();
        }}
        placeholder={placeholder}
      />

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      {isOpen && <div className="panel mt-3 animate-rise overflow-hidden">{renderPanel()}</div>}

      {!term && suggestions.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-slate-500">Try:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                updateValue(suggestion);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-slate-300 transition hover:border-sky-400/50 hover:bg-sky-400/10 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
