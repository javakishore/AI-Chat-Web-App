import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { Message, Sender } from '../types';

/**
 * Props for the MessageBubble component
 */
interface MessageBubbleProps {
  message: Message; // The message to display
  onEdit: (message: Message) => void; // Callback when edit button is clicked
  onDelete: (message: Message) => void; // Callback when delete button is clicked
}

/**
 * CSS class name generator for message bubbles based on sender
 */
const bubbleClass = (sender: Sender) => (sender === 'user' ? 'bubble user' : 'bubble ai');

/**
 * Message bubble component that displays individual chat messages
 * Shows message content with markdown support and action buttons
 */
export function MessageBubble({ message, onEdit, onDelete }: MessageBubbleProps) {
  return (
    <motion.div
      className={bubbleClass(message.sender)}
      initial={{ opacity: 0, y: 8 }} // Start slightly transparent and below
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
    >
      {/* Message metadata: sender and timestamp */}
      <div className="bubble-meta">
        <span>{message.sender === 'user' ? 'You' : 'DaivAI'}</span>
        <small>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </small>
      </div>

      {/* Message content rendered as markdown */}
      <div className="bubble-content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      {/* Action buttons: Edit (user only) and Delete */}
      <div className="bubble-actions">
        {message.sender === 'user' && (
          <button type="button" className="icon-button edit-btn" onClick={() => onEdit(message)}>
            Edit
          </button>
        )}
        <button type="button" className="icon-button delete-btn" onClick={() => onDelete(message)}>
          Delete
        </button>
      </div>
    </motion.div>
  );
}
