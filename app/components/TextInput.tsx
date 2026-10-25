"use client";

import type { InputHTMLAttributes, Ref } from "react";
import { FiSearch, FiX } from "react-icons/fi";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
  onClear?: () => void;
};

export default function TextInput({
  ref,
  value,
  onChange,
  onClear,
  className = "",
  ...rest
}: TextInputProps) {
  return (
    <div className="relative">
      <FiSearch
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-slate-400"
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        autoComplete="off"
        spellCheck={false}
        className={`h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-12 text-base text-white backdrop-blur transition placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-4 focus:ring-sky-400/15 ${className}`}
        {...rest}
      />
      {onClear && value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <FiX aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
