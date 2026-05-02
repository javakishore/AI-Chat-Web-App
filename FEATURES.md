# Advanced Features & API Integration Guide

## Real AI Integration

### OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

3. The app will automatically use OpenAI for responses when the key is present.

### Other Supported APIs (Future Integration)

The `src/utils/ai.ts` file has scaffolding for:
- Google Gemini API
- HuggingFace Inference API

To integrate, add your API key and update the `fetchOpenAIResponse` handler.

## Component Architecture

### State Flow

```
Redux Store (chatSlice.ts)
  ├── chats[] (Chat objects with messages)
  ├── selectedChatId
  └── Persisted to localStorage

ThemeContext
  ├── theme: 'light' | 'dark'
  └── toggleTheme() function
```

### Component Hierarchy

```
App
├── ThemeProvider (Context)
├── Provider (Redux)
└── Application
    ├── Sidebar
    │   └── ChatItem[] (with edit/delete)
    ├── ChatPanel
    │   ├── ChatHeader (engine dropdown)
    │   ├── MessageFeed
    │   │   └── MessageBubble[] (with edit/delete actions)
    │   ├── ChatInput (textarea + send)
    │   ├── MessageEditorModal
    │   └── DeleteConfirm
```

## Styling Strategy

- **CSS Variables**: All colors defined at `:root` scope
- **Light/Dark Mode**: `[data-theme="dark"]` attribute selector
- **Flexbox Grid**: Sidebar layout uses CSS Grid + Flexbox
- **Animations**: Framer Motion for message transitions
- **Mobile Responsive**: 1024px and 720px breakpoints

## Local Development Tips

### Hot Module Reload (HMR)
- Changes to React components auto-refresh without losing state
- Chat history persists across HMR updates

### Redux DevTools
Install the Redux DevTools browser extension to:
- Track all state changes
- See action history
- Time-travel debugging

### Debugging

Check browser DevTools:
- **Application > Storage > localStorage**: `daivai-chat-state`, `daivai-theme`
- **Console**: No TypeScript or build errors expected
- **Network**: OpenAI API calls visible when VITE_OPENAI_API_KEY is set

## Performance Notes

- Message feed uses virtualizable list (max height with overflow)
- Lazy re-renders using Redux selectors
- CSS variables avoid runtime style calculations
- Vite builds tree-shaken bundles

## Extending the Project

### Adding New Engines

Edit `src/utils/ai.ts` `enginePrompts` object and `getEngineReply` function.

### Adding Features

1. **Streaming responses**: Already implemented with `simulateStream`
2. **User avatars**: Add `avatar` field to Message type and render in MessageBubble
3. **Search messages**: Add search reducer to chatSlice
4. **Export chat**: Map chat.messages to JSON and download
5. **Voice input**: Integrate Web Speech API

## Troubleshooting

**Issue**: Types not resolving after `npm install`
**Solution**: Clear `.eslintcache`, restart TypeScript server (Cmd+Shift+P > "Restart TS Server")

**Issue**: localStorage not saving
**Solution**: Check browser privacy settings; ensure localStorage is enabled

**Issue**: OpenAI API returns 401
**Solution**: Verify API key in `.env`, ensure it has credits and correct permissions

**Issue**: Build output too large
**Solution**: Run `npm run build` and check `dist/assets/` sizes; unused dependencies are likely culprits
