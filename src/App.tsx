import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, type RootState } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { LandingPage } from './components/LandingPage';
import {
  createChat,
  selectChat,
  updateChatTitle,
  removeChat,
  addUser,
  selectUser,
  removeUser
} from './store/chatSlice';
import './styles.css';

/**
 * Main application component that manages the overall layout and state
 * Handles user management, chat selection, and renders the sidebar and chat panel
 */
function Application() {
  const dispatch = useDispatch();
  // Extract chat state from Redux store
  const { users, selectedUserId, chats, selectedChatId } = useSelector((state: RootState) => state.chat);
  // Find the currently selected chat object
  const chat = chats.find((item) => item.id === selectedChatId);

  return (
    <div className="app-shell">
      {/* Sidebar component for navigation and user management */}
      <Sidebar
        users={users}
        selectedUserId={selectedUserId}
        chats={chats}
        selectedId={selectedChatId}
        onCreate={() => dispatch(createChat())}
        onSelect={(id) => dispatch(selectChat(id))}
        onUpdateTitle={(id, title) => dispatch(updateChatTitle({ chatId: id, title }))}
        onDelete={(id) => dispatch(removeChat(id))}
        onSelectUser={(id) => dispatch(selectUser(id))}
        onAddUser={(name, email) => dispatch(addUser({ name, email }))}
        onRemoveUser={(id) => dispatch(removeUser(id))}
      />
      {/* Conditional rendering: show chat panel if chat exists, otherwise show landing page */}
      {chat ? (
        <ChatPanel chat={chat} />
      ) : (
        <div className="chat-panel">
          <LandingPage />
        </div>
      )}
    </div>
  );
}

/**
 * Root App component that provides Redux store and theme context
 * This is the entry point for the entire React application
 */
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Application />
      </ThemeProvider>
    </Provider>
  );
}
