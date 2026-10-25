import React from "react";

const linkClass = "transition hover:text-white";

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
      <a
        href="https://github.com/L3VU5"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        By Paweł Jędrasik
      </a>
      <a
        href="https://github.com/L3VU5/GitHub-Autocomplete-Search"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        View source
      </a>
    </footer>
  );
};

export default Footer;
