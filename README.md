# Bartender CheatSheet

DH2642 Group 33

## Techs

- Vite
- React.js (Javascript)
- Tailwindcss
- Firebase

## Relevant Docs

- We use firebase a bit different from the tutorial, please refer to [here](https://firebase.google.com/docs/database/web/read-and-write).
- For UI development, please see [daisyUI](https://daisyui.com/components/) and [tailwind](https://tailwindcss.com/docs/installation)
  - For components please refer to daisyUI
  - For simple preset css classes please refer to tailwind (e.g. display, border, color, font)
- [React router](https://reactrouter.com/en/main/start/tutorial)
- [Redux](https://redux.js.org/introduction/getting-started)

## Getting Started

It is recommended to load the project using VSCode as there's settings for recommended plugins and editor. Saving the code shall trigger automatic linting and formatting.

Before start, create `apiConfig.js` and `firebaseConfig.js` under `src` directory with configurations.

To start development:

```bash
npm install
npm run dev
```

Run linter and prettier:

```bash
npm run lint:fix    # Run eslint and fix
npm run lint:format # Run prettier and format
npm run lint        # Run both
```

## Deployment

To deploy the project to firebase, you need to install `firebase-tools` and login first (make sure you have access to the firebase project):

```bash
npm install -g firebase-tools
firebase login
```

Then each time you want to deploy:

```bash
npm run build
firebase deploy
```

Or use the quick command:

```bash
npm run deploy  # This will build first and deploy
```
