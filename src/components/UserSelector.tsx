import { useState } from 'react';
import { motion } from 'framer-motion';
import type { User } from '../types';
import { DeleteConfirm } from './DeleteConfirm';

/**
 * Props for the UserSelector component
 */
interface UserSelectorProps {
  users: User[]; // Array of all users
  selectedUserId: string; // ID of currently selected user
  onSelectUser: (userId: string) => void; // Callback when user is selected
  onAddUser: (name: string, email: string) => void; // Callback when new user is added
  onRemoveUser: (userId: string) => void; // Callback when user is removed
}

/**
 * User management component that displays user list and handles user operations
 * Allows switching between users, adding new users, and removing existing users
 */
export function UserSelector({
  users,
  selectedUserId,
  onSelectUser,
  onAddUser,
  onRemoveUser
}: UserSelectorProps) {
  // Form state for adding new users
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // State for user deletion confirmation
  const [logoutUser, setLogoutUser] = useState<User | null>(null);

  /**
   * Email validation using regex pattern
   */
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /**
   * Handle adding a new user with validation
   * Validates required fields, email format, and uniqueness
   */
  const handleAdd = () => {
    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim();

    // Basic validation
    if (!trimmedName || !trimmedEmail) {
      setErrorMessage('Name and email are required.');
      return;
    }

    // Email format validation
    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check for duplicate email
    if (users.some((user) => user.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      setErrorMessage('This email is already registered.');
      return;
    }

    // Add user and reset form
    onAddUser(trimmedName, trimmedEmail);
    setNewName('');
    setNewEmail('');
    setErrorMessage('');
    setShowAddForm(false);
  };

  /**
   * Initiate user removal process
   */
  const handleRemoveClick = (user: User) => {
    setLogoutUser(user);
  };

  /**
   * Confirm user removal
   */
  const handleConfirmLogout = () => {
    if (logoutUser) {
      onRemoveUser(logoutUser.id);
      setLogoutUser(null);
    }
  };

  /**
   * Cancel user removal
   */
  const handleCancelLogout = () => {
    setLogoutUser(null);
  };

  return (
    <motion.div className="user-selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="users-header">
        <h3>Users</h3>
      </div>

      <div className="users-list">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-card ${selectedUserId === user.id ? 'active' : ''}`}
          >
            <button
              type="button"
              className="user-card-main"
              onClick={() => onSelectUser(user.id)}
            >
              <div className="user-avatar">
                {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </button>
            {users.length > 1 && (
              <button
                type="button"
                className="icon-button"
                onClick={() => handleRemoveClick(user)}
                title="Logout user"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {!showAddForm ? (
        <button className="button button-primary add-user-btn" onClick={() => {
          setShowAddForm(true);
          setErrorMessage('');
        }}>
          + Add User
        </button>
      ) : (
        <div className="add-user-form">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setErrorMessage('');
            }}
          />
          {errorMessage && <p className="form-error" style={{ color: 'red' }}>{errorMessage}</p>}
          <div className="form-actions">
            <button
              type="button"
              className="button button-muted"
              onClick={() => {
                setShowAddForm(false);
                setErrorMessage('');
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={handleAdd}
              disabled={!newName.trim() || !newEmail.trim()}
            >
              Add
            </button>
          </div>
        </div>
      )}
      
      <DeleteConfirm
        open={Boolean(logoutUser)}
        label="Logout"
        title="Logout User?"
        message={`Are you sure you want to logout ${logoutUser?.name}? All chats and data for this user will be permanently deleted.`}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </motion.div>
  );
}
