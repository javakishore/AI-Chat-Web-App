import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { Chat, ChatState, EngineOption, Message, User } from '../types';

/**
 * Default guest user created when no users exist
 */
const defaultUser: User = {
  id: nanoid(),
  name: 'Guest User',
  email: 'guest@daivai.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=Guest+User&background=16c784&color=fff&size=128'
};

/**
 * Default chat created for new users with a welcome message
 */
const defaultChat: Chat = {
  id: nanoid(),
  userId: defaultUser.id,
  title: 'New conversation',
  engine: 'Neural Nexus',
  messages: [
    {
      id: nanoid(),
      sender: 'ai',
      content: "Hello! I'm Neural Nexus, your intelligent assistant. How can I help today?",
      createdAt: new Date().toISOString()
    }
  ]
};

/**
 * Load persisted state from localStorage, fallback to default state
 */
const persisted = localStorage.getItem('daivai-chat-state');

const initialState: ChatState = persisted
  ? JSON.parse(persisted) as ChatState
  : {
      users: [defaultUser],
      selectedUserId: defaultUser.id,
      chats: [defaultChat],
      selectedChatId: defaultChat.id
    };

/**
 * Persist state to localStorage whenever it changes
 */
const saveToStorage = (state: ChatState) => {
  localStorage.setItem('daivai-chat-state', JSON.stringify(state));
};

/**
 * Redux slice for managing chat application state
 * Handles users, chats, messages, and UI state
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // User management reducers
    /**
     * Add a new user to the system with validation
     * Validates email format and uniqueness before adding
     */
    addUser(state, action: PayloadAction<{ name: string; email: string }>) {
      const email = action.payload.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate email format
      if (!emailRegex.test(email)) {
        return;
      }

      // Check for duplicate email
      if (state.users.some((user) => user.email.toLowerCase() === email)) {
        return;
      }

      // Create new user with avatar
      const avatarName = encodeURIComponent(action.payload.name);
      const user: User = {
        id: nanoid(),
        name: action.payload.name,
        email,
        avatarUrl: `https://ui-avatars.com/api/?name=${avatarName}&background=16c784&color=fff&size=128`
      };
      state.users.push(user);
      state.selectedUserId = user.id;
      saveToStorage(state);
    },

    /**
     * Select a user and switch to their first chat
     */
    selectUser(state, action: PayloadAction<string>) {
      state.selectedUserId = action.payload;
      // Find user's chats and select the first one
      const userChats = state.chats.filter((c) => c.userId === action.payload);
      if (userChats.length > 0) {
        state.selectedChatId = userChats[0].id;
      } else {
        // If user has no chats, clear selected chat
        state.selectedChatId = '';
      }
      saveToStorage(state);
    },

    /**
     * Remove a user and all their associated chats
     * Ensures at least one user always exists
     */
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.chats = state.chats.filter((c) => c.userId !== action.payload);
      // Ensure we always have at least one user
      if (!state.users.length) {
        const newUser = { ...defaultUser, id: nanoid() };
        state.users.push(newUser);
        state.selectedUserId = newUser.id;
      } else if (state.selectedUserId === action.payload) {
        state.selectedUserId = state.users[0].id;
        const userChats = state.chats.filter((c) => c.userId === state.selectedUserId);
        if (userChats.length > 0) {
          state.selectedChatId = userChats[0].id;
        }
      }
      saveToStorage(state);
    },

    // Chat management reducers
    /**
     * Create a new empty chat for the current user
     */
    createChat(state) {
      const chat: Chat = {
        id: nanoid(),
        userId: state.selectedUserId,
        title: 'Untitled chat',
        engine: 'Neural Nexus',
        messages: []
      };
      state.chats.unshift(chat);
      state.selectedChatId = chat.id;
      saveToStorage(state);
    },

    /**
     * Select a specific chat to display
     */
    selectChat(state, action: PayloadAction<string>) {
      state.selectedChatId = action.payload;
      saveToStorage(state);
    },

    /**
     * Update the title of a specific chat
     */
    updateChatTitle(state, action: PayloadAction<{ chatId: string; title: string }>) {
      const chat = state.chats.find((item) => item.id === action.payload.chatId);
      if (chat) {
        chat.title = action.payload.title;
        saveToStorage(state);
      }
    },

    /**
     * Remove a chat and update selection if needed
     */
    removeChat(state, action: PayloadAction<string>) {
      state.chats = state.chats.filter((item) => item.id !== action.payload);
      const userChats = state.chats.filter((c) => c.userId === state.selectedUserId);
      if (!userChats.length) {
        state.selectedChatId = '';
      } else if (state.selectedChatId === action.payload) {
        state.selectedChatId = userChats[0].id;
      }
      saveToStorage(state);
    },

    // Message management reducers
    /**
     * Add a new message to a specific chat
     */
    addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
      const chat = state.chats.find((item) => item.id === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
        saveToStorage(state);
      }
    },

    /**
     * Edit the content of an existing message
     */
    editMessage(state, action: PayloadAction<{ chatId: string; messageId: string; content: string }>) {
      const chat = state.chats.find((item) => item.id === action.payload.chatId);
      const message = chat?.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        message.content = action.payload.content;
        saveToStorage(state);
      }
    },

    /**
     * Remove a message from a chat
     */
    deleteMessage(state, action: PayloadAction<{ chatId: string; messageId: string }>) {
      const chat = state.chats.find((item) => item.id === action.payload.chatId);
      if (chat) {
        chat.messages = chat.messages.filter((m) => m.id !== action.payload.messageId);
        saveToStorage(state);
      }
    },

    /**
     * Update the AI engine for a specific chat
     */
    updateEngine(state, action: PayloadAction<{ chatId: string; engine: EngineOption }>) {
      const chat = state.chats.find((item) => item.id === action.payload.chatId);
      if (chat) {
        chat.engine = action.payload.engine;
        saveToStorage(state);
      }
    }
  }
});

export const {
  addUser,
  selectUser,
  removeUser,
  createChat,
  selectChat,
  updateChatTitle,
  removeChat,
  addMessage,
  editMessage,
  deleteMessage,
  updateEngine
} = chatSlice.actions;

export default chatSlice.reducer;
