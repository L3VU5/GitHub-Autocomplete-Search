# GitHub Autocomplete Search

An autocomplete component built around the GitHub GraphQL API. Type three characters and get matching repositories and accounts, ranked by GitHub, with avatars, descriptions and star counts.

**Live demo:** https://git-hub-autocomplete-search.vercel.app/

## Features

- A reusable `AutoComplete` component: the data source is passed in as a GraphQL query and a formatter function.
- Full keyboard support (`↑` `↓` `Enter` `Esc`) and the ARIA combobox / listbox pattern, including screen reader announcements.
- Debounced search, match highlighting, and loading, empty and error states.
- The GitHub token never reaches the browser: the app calls its own `/api/github` route, which only accepts the one search query used by the UI.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Apollo Client 3 and GraphQL · Tailwind CSS 3 · Jest 30 and Testing Library

## How it works

```
Browser (Apollo Client)  ──POST──▶  /api/github  ──▶  GitHub GraphQL API
                                    │ checks that the document is the search query
                                    │ validates the search term (3-100 characters)
                                    └ adds the server-side token
```

## Setup

1. Clone the repository: `git clone https://github.com/L3VU5/GitHub-Autocomplete-Search.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and set `GITHUB_TOKEN`. A [fine-grained personal access token](https://github.com/settings/personal-access-tokens) without any extra permissions is enough, because only public data is read.
4. Start the app: `npm run dev` and open http://localhost:3000

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | development server              |
| `npm run build`     | production build                |
| `npm start`         | serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | TypeScript, no emit             |
| `npm test`          | Jest and Testing Library        |

## Deployment

On Vercel, add `GITHUB_TOKEN` to the project's environment variables. The server also still reads the old `NEXT_PUBLIC_REACT_APP_GITHUB_API_KEY` name as a fallback, so an existing deployment keeps working until it is renamed. Never expose a token through a `NEXT_PUBLIC_` variable on the client.
