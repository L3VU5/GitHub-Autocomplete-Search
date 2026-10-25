import React from "react";

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-400" />
        Autocomplete showcase
      </p>
      <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
        Search <span className="gradient-text">GitHub</span> users and repositories
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-400">
        Type at least three characters. Use <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> to move and{" "}
        <kbd className="kbd">↵</kbd> to open a result on GitHub.
      </p>
    </header>
  );
};

export default Header;
