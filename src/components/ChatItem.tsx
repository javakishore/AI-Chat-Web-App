import { useState } from 'react';
import type { Chat } from '../types';

interface ChatItemProps {
  chat: Chat;
  active: boolean;
  onSelect: () => void;
  onEditTitle: (nextTitle: string) => void;
  onDelete: () => void;
}

export function ChatItem({ chat, active, onSelect, onEditTitle, onDelete }: ChatItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  return (
    <div className={`chat-item ${active ? 'active' : ''}`}>
      <button type="button" className="chat-item-main" onClick={onSelect}>
        <span className="chat-icon">💬</span>
        {editing ? (
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => {
              onEditTitle(title.trim() || 'Untitled chat');
              setEditing(false);
            }}
            onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
            autoFocus
          />
        ) : (
          <span>{chat.title}</span>
        )}
      </button>
      <div className="chat-item-actions">
        <button type="button" className="icon-button" onClick={() => setEditing((value) => !value)}>
          ✎
        </button>
        <button type="button" className="icon-button" onClick={onDelete}>
          🗑
        </button>
      </div>
    </div>
  );
}
