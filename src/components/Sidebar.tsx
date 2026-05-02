import type { Chat, User } from '../types';
import { ChatItem } from './ChatItem';
import { UserSelector } from './UserSelector';

interface SidebarProps {
  users: User[];
  selectedUserId: string;
  chats: Chat[];
  selectedId: string;
  onCreate: () => void;
  onSelect: (chatId: string) => void;
  onUpdateTitle: (chatId: string, title: string) => void;
  onDelete: (chatId: string) => void;
  onSelectUser: (userId: string) => void;
  onAddUser: (name: string, email: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function Sidebar({
  users,
  selectedUserId,
  chats,
  selectedId,
  onCreate,
  onSelect,
  onUpdateTitle,
  onDelete,
  onSelectUser,
  onAddUser,
  onRemoveUser
}: SidebarProps) {
  const userChats = chats.filter((c) => c.userId === selectedUserId);

  return (
    <aside className="sidebar">
      <UserSelector
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={onSelectUser}
        onAddUser={onAddUser}
        onRemoveUser={onRemoveUser}
      />

      <div className="sidebar-top">
        <div>
          <div className="brand-mark">⚡</div>
          <div>
            <h1>DaivAI</h1>
            <p>AI chat playground</p>
          </div>
        </div>
        <button className="button button-primary" onClick={onCreate}>
          + New Chat
        </button>
      </div>
      <div className="chat-list">
        {userChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            active={chat.id === selectedId}
            onSelect={() => onSelect(chat.id)}
            onEditTitle={(title) => onUpdateTitle(chat.id, title)}
            onDelete={() => onDelete(chat.id)}
          />
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="user-info">
          <div className="user-avatar">
            {users.find((u) => u.id === selectedUserId)?.avatarUrl ? (
              <img src={users.find((u) => u.id === selectedUserId)?.avatarUrl} alt="Selected user" />
            ) : (
              selectedUserId.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="user-name">{users.find((u) => u.id === selectedUserId)?.name || 'User'}</p>
            <p className="user-email">{users.find((u) => u.id === selectedUserId)?.email || 'user@daivai.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
