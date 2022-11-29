# Bartender CheatSheet

DH2642 Group 33

## Techs

- Vite
- React.js (Javascript)
- Tailwindcss
- Firebase

## Getting Started

It is recommended to load the project using VSCode as there's settings for recommended plugins and editor. Saving the code shall trigger automatic linting and formatting.

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
