// Type definitions for the DaivAI chat application

/**
 * Available AI engine options for generating responses
 */
export type EngineOption = 'Neural Nexus' | 'Cerebral Prime' | 'Synapse Ultra' | 'Logic Core';

/**
 * Message sender type - either user input or AI response
 */
export type Sender = 'user' | 'ai';

/**
 * Represents a single chat message in a conversation
 */
export interface Message {
  id: string; // Unique identifier for the message
  sender: Sender; // Who sent the message (user or AI)
  content: string; // The actual message text
  createdAt: string; // ISO timestamp when message was created
  editing?: boolean; // Optional flag for edit state (currently unused)
}

/**
 * Represents a complete chat conversation
 */
export interface Chat {
  id: string; // Unique identifier for the chat
  userId: string; // ID of the user who owns this chat
  title: string; // Display title for the chat
  engine: EngineOption; // AI engine used for this chat
  messages: Message[]; // Array of messages in chronological order
}

/**
 * Represents a user account in the system
 */
export interface User {
  id: string; // Unique identifier for the user
  name: string; // Display name of the user
  email: string; // Email address (must be unique)
  avatarUrl?: string; // Optional avatar image URL
}

/**
 * Global application state structure stored in Redux
 */
export interface ChatState {
  users: User[]; // All registered users
  selectedUserId: string; // Currently active user ID
  chats: Chat[]; // All chat conversations
  selectedChatId: string; // Currently active chat ID
}
