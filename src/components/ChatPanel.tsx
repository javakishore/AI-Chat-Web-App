import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { addMessage, editMessage, deleteMessage, updateEngine } from '../store/chatSlice';
import type { Chat, Message } from '../types';
import { getEngineReply, fetchOpenAIResponse } from '../utils/ai';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageEditorModal } from './MessageEditorModal';
import { DeleteConfirm } from './DeleteConfirm';
import { LandingPage } from './LandingPage';

/**
 * Props for the ChatPanel component
 */
interface ChatPanelProps {
  chat: Chat; // The chat conversation to display
}

/**
 * Main chat panel component that displays messages and handles user interactions
 * Manages message sending, editing, deletion, and AI responses
 */
export function ChatPanel({ chat }: ChatPanelProps) {
  const dispatch = useDispatch();
  // State for the message input draft
  const [draft, setDraft] = useState('');
  // State to track if AI is currently generating a response
  const [busy, setBusy] = useState(false);
  // State for the message being edited
  const [editMessageState, setEditMessageState] = useState<Message | null>(null);
  // State for the message being deleted
  const [deleteMessageState, setDeleteMessageState] = useState<Message | null>(null);

  // Calculate the last activity time for display
  const lastSeen = useMemo(
    () => new Date(chat.messages[chat.messages.length - 1]?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [chat.messages]
  );

  // Clear draft when switching chats
  useEffect(() => {
    setDraft('');
  }, [chat.id]);

  /**
   * Handle changing the AI engine for this chat
   */
  const handleEngineChange = (engine: Chat['engine']) => {
    dispatch(updateEngine({ chatId: chat.id, engine }));
  };

  /**
   * Create a new message object with current timestamp
   */
  const createMessage = (sender: 'user' | 'ai', content: string): Message => ({
    id: crypto.randomUUID(),
    sender,
    content,
    createdAt: new Date().toISOString()
  });

  /**
   * Simulate streaming text for AI responses with realistic timing
   */
  const simulateStream = async (content: string, messageId: string) => {
    const words = content.split(' ');
    let current = '';

    for (let index = 0; index < words.length; index += 1) {
      current += `${words[index]}${index < words.length - 1 ? ' ' : ''}`;
      dispatch(editMessage({ chatId: chat.id, messageId, content: current }));
      // Random delay between 35-70ms for realistic typing effect
      await new Promise((resolve) => setTimeout(resolve, 35 + Math.random() * 35));
    }

    setBusy(false);
  };

  /**
   * Handle sending a new message from the input field
   * Creates user message, gets AI response, and simulates streaming
   */
  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || busy) return;

    const userMessage = createMessage('user', trimmed);
    dispatch(addMessage({ chatId: chat.id, message: userMessage }));
    setDraft('');
    setBusy(true);

    // Get AI response using OpenAI API if key is available, otherwise use local engine
    const aiRaw = import.meta.env.VITE_OPENAI_API_KEY ? await fetchOpenAIResponse(trimmed) : getEngineReply(chat.engine, trimmed);
    const aiMessage = createMessage('ai', '');
    dispatch(addMessage({ chatId: chat.id, message: aiMessage }));
    await simulateStream(aiRaw, aiMessage.id);
  };

  /**
   * Handle quick action buttons from the landing page
   * Same logic as handleSend but triggered by button clicks
   */
  const handleQuickAction = async (prompt: string) => {
    setDraft(prompt);
    const userMessage = createMessage('user', prompt);
    dispatch(addMessage({ chatId: chat.id, message: userMessage }));
    setBusy(true);

    const aiRaw = import.meta.env.VITE_OPENAI_API_KEY ? await fetchOpenAIResponse(prompt) : getEngineReply(chat.engine, prompt);
    const aiMessage = createMessage('ai', '');
    dispatch(addMessage({ chatId: chat.id, message: aiMessage }));
    await simulateStream(aiRaw, aiMessage.id);
  };

  /**
   * Open the edit modal for a message
   */
  const handleEdit = (message: Message) => {
    setEditMessageState(message);
  };

  /**
   * Save edited message and regenerate AI response if user message was edited
   */
  const handleSaveEdit = async (value: string) => {
    if (!editMessageState) return;

    const trimmed = value.trim();
    if (!trimmed) return;

    dispatch(editMessage({ chatId: chat.id, messageId: editMessageState.id, content: trimmed }));

    // If user edited their own message, regenerate the AI response
    if (editMessageState.sender === 'user') {
      const currentIndex = chat.messages.findIndex((item) => item.id === editMessageState.id);
      const aiMessage = chat.messages[currentIndex + 1];

      if (aiMessage?.sender === 'ai') {
        setBusy(true);
        const aiRaw = import.meta.env.VITE_OPENAI_API_KEY ? await fetchOpenAIResponse(trimmed) : getEngineReply(chat.engine, trimmed);
        dispatch(editMessage({ chatId: chat.id, messageId: aiMessage.id, content: '' }));
        await simulateStream(aiRaw, aiMessage.id);
      }
    }
  };

  /**
   * Open delete confirmation for a message
   */
  const handleDelete = (message: Message) => {
    setDeleteMessageState(message);
  };

  return (
    <main className="chat-panel">
      <ChatHeader engine={chat.engine} onEngineChange={handleEngineChange} />
      
      {chat.messages.length === 0 ? (
        <LandingPage onQuickAction={handleQuickAction} />
      ) : (
        <>
          <div className="chat-status">
            <p>Last activity: {lastSeen}</p>
            {busy && <span className="typing-indicator">DaivAI is typing…</span>}
          </div>
          <div className="message-feed">
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
      
      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Message DaivAI..."
          rows={2}
        />
        <button type="submit" className="button button-primary" disabled={!draft.trim() || busy}>
          Send
        </button>
      </form>

      <MessageEditorModal
        key={editMessageState?.id ?? 'message-editor'}
        open={Boolean(editMessageState)}
        initialText={editMessageState?.content ?? ''}
        onSave={handleSaveEdit}
        onClose={() => setEditMessageState(null)}
      />

      <DeleteConfirm
        open={Boolean(deleteMessageState)}
        label="Confirm delete"
        onConfirm={() => {
          if (deleteMessageState) {
            const index = chat.messages.findIndex((item) => item.id === deleteMessageState.id);
            const nextMessage = chat.messages[index + 1];

            dispatch(deleteMessage({ chatId: chat.id, messageId: deleteMessageState.id }));

            if (deleteMessageState.sender === 'user' && nextMessage?.sender === 'ai') {
              dispatch(deleteMessage({ chatId: chat.id, messageId: nextMessage.id }));
            }
          }
          setDeleteMessageState(null);
        }}
        onCancel={() => setDeleteMessageState(null)}
      />
    </main>
  );
}
