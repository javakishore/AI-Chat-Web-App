import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';

/**
 * Redux store configuration for the DaivAI application
 * Uses Redux Toolkit for simplified store setup with good defaults
 */
export const store = configureStore({
  reducer: {
    chat: chatReducer // Main reducer for chat-related state
  }
});

/**
 * TypeScript type for the root state of the Redux store
 * Used for type-safe access to state in components and selectors
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * TypeScript type for the Redux store dispatch function
 * Used for type-safe dispatching of actions
 */
export type AppDispatch = typeof store.dispatch;
