# Project Structure

```
d:\React Project 2/
│
├── public/                    # Static assets (fonts, favicons, etc.)
│
├── src/
│   ├── components/            # Reusable React components
│   │   ├── ChatHeader.tsx      # Engine dropdown + theme toggle
│   │   ├── ChatItem.tsx        # Sidebar chat list item
│   │   ├── ChatPanel.tsx       # Main chat interface (CORE)
│   │   ├── DeleteConfirm.tsx   # Confirmation modal
│   │   ├── EngineDropdown.tsx  # AI engine selector
│   │   ├── MessageBubble.tsx   # User/AI message display
│   │   ├── MessageEditorModal.tsx  # Edit message dialog
│   │   └── Sidebar.tsx         # Left panel with chat list
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx    # Light/Dark mode context
│   │
│   ├── store/
│   │   ├── chatSlice.ts        # Redux reducer + actions
│   │   └── index.ts            # Redux store configuration
│   │
│   ├── utils/
│   │   └── ai.ts               # AI response generation + API calls
│   │
│   ├── types.ts                # TypeScript interfaces
│   ├── styles.css              # Global styles + theming
│   ├── App.tsx                 # Root component (Redux + Theme providers)
│   ├── main.tsx                # React entry point
│   └── vite-env.d.ts           # Vite environment types
│
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # Vite TypeScript config
├── package.json                # Dependencies
├── README.md                   # Setup & quick start
├── FEATURES.md                 # Advanced features guide
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment template
│
└── dist/                       # Build output (after `npm run build`)
    ├── index.html              # Compiled HTML
    ├── assets/
    │   ├── index-*.css         # CSS bundle
    │   └── index-*.js          # JavaScript bundle
    └── ...
```

## Key Implementation Points

### State Management

**Redux (chatSlice.ts)**
- Manages: chats array, selectedChatId
- Actions: createChat, addMessage, editMessage, deleteMessage, etc.
- Persistence: Auto-saves to localStorage on every state change

**Context API (ThemeContext.tsx)**
- Manages: current theme (light/dark)
- Provides: toggleTheme() function
- Persistence: Saved to localStorage["daivai-theme"]

### Component Communication

- **Down**: Props for display data and callbacks
- **Up**: Dispatch Redux actions from components
- **Sideways**: Shared via Redux or Context

Example flow:
```
ChatItem (delete button click)
  → dispatch(removeChat(chatId))
  → Redux reduces state
  → App re-reads selectedChatId
  → Sidebar re-renders with updated chats list
```

### Styling Approach

All colors use CSS custom properties (variables):
```css
:root {
  --bg: #f3f6fb;
  --panel: #ffffff;
  --text: #17233b;
  --button: #16c784;
}

:root[data-theme='dark'] {
  --bg: #0f1724;
  --panel: #141b2b;
  --text: #e8eef6;
  --button: #22c55e;
}
```

### Message Rendering

Uses `react-markdown` to support:
- **Bold**: `**text**`
- **Code blocks**: ` ```js ... ``` `
- **Links**: `[text](url)`
- **Lists**: `- item` or `1. item`

### Performance

- Vite dev server: ~3-4s cold start
- Build size: ~416 KB (uncompressed, React + Redux + markdown)
- Gzip: ~133 KB production bundle
- No image optimization needed (text-only chat)
