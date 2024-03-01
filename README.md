# GitHub AutoComplete Search

Showcase of an AutoComplete component. In this project it's using the GitHub API to search for matching Repositories and Users.

## Table of Contents

- [Live App](#live-app)
- [Setup](#setup)
- [Additional Setup](#additional-setup)
- [About Me](#about-me)
- [Technologies Used](#technologies-used)
- [Contact](#contact)

## Live App

https://git-hub-autocomplete-search.vercel.app/

## Setup

To run this app locally, follow these steps:

1. Clone the repository: `git clone https://github.com/L3VU5/GitHub-Autocomplete-Search.git`
2. Navigate to the project folder: `cd GitHub-Autocomplete-Search`
3. Install dependencies: `npm install`
4. Start the application: `npm run start`

If `npm run start` results in error - run `npm run build` command first and re-run.

## Additional Setup

To successfuly make GitHub requests, you'll need to provide GitHub API key.

You can modify the `next.config.mjs` file as follows:

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_REACT_APP_GITHUB_API_KEY:
      "YOUR_API_KEY",
  },
};

export default nextConfig;
```

More about GitHub authentication and how to generate access token in here:

https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

You can also contact me and I'll provide the key.

## About Me

🚀 Passionate Software Developer from Kraków with 6+ years of industry experience in designing and developing dynamic web and mobile applications.

💻 Enthusiastic about experimenting with the newest technologies and frameworks to improve my skill set.

💡 Specialized in JavaScript, with hands-on experience in building impactful solutions using React, React Native, and AngularJS.

## Technologies Used

- React.js
- TypeScript
- TailwindCSS
- Jest
- React Testing Library
- NextJS
- GraphQL
- Apollo
- Lodash
- Vercel
- GitHub API

## Contact

Feel free to reach out to me if you have any questions, collaboration opportunities, or just want to connect:

- Email: paweljedrasik@o2.pl
- LinkedIn: https://www.linkedin.com/in/paweljedrasik/
- GitHub: https://github.com/L3VU5

Thank you for checking out my repo!
