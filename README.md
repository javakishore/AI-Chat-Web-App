# DaivAI Chat Web App

https://github.com/javakishore/AI-Chat-Web-App.git
## Features

- Multiple chat sessions with sidebar history
- Add, select, rename and delete chats
- User and AI message bubbles with timestamps
- Edit and delete messages with modal and confirmation
- AI engine selector UI and simulated response generation
- Typing animation, markdown rendering, and smooth interactions with Framer Motion
- Dark mode toggle and responsive layout
- State persistence using `localStorage`

## Tech stack

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Context API
- Framer Motion
- React Markdown

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the app in your browser at the address shown by Vite.



## Notes

- Chat state is saved locally, so conversations remain after refresh.
- Dark mode preference is preserved in `localStorage`.
- The UI is built to match the Figma-inspired clean white theme and interactions.
