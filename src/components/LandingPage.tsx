import { useDispatch } from 'react-redux';
import { createChat } from '../store/chatSlice';

/**
 * Props for the LandingPage component
 */
interface LandingPageProps {
  onCreateChat?: () => void; // Optional callback to create a new chat
  onQuickAction?: (prompt: string) => void; // Optional callback for quick action buttons
}

/**
 * Landing page component shown when no chat is selected
 * Displays welcome message and quick action buttons to start conversations
 */
export function LandingPage({ onCreateChat, onQuickAction }: LandingPageProps) {
  const dispatch = useDispatch();

  /**
   * Create a new chat or use the provided callback
   */
  const createNewChat = () => {
    if (onCreateChat) {
      onCreateChat();
      return;
    }

    dispatch(createChat());
  };

  /**
   * Handle quick action button clicks
   * Either executes the provided callback or creates a new chat
   */
  const handleAction = (prompt: string) => {
    if (onQuickAction) {
      onQuickAction(prompt);
      return;
    }

    createNewChat();
  };

  return (
    <div className="landing-page">
      {/* App branding and welcome message */}
      <div className="landing-icon">⚡</div>
      <h1>DaivAI</h1>
      <p>Ask me anything. I'm here to help.</p>

      {/* Quick action buttons for common conversation starters */}
      <div className="quick-actions-grid">
        <button className="action-btn" onClick={() => handleAction('Help me write better code')}>
          <span className="action-icon">💻</span>
          <span className="action-title">Code Help</span>
          <span className="action-desc">Debug and write better code</span>
        </button>
        <button className="action-btn" onClick={() => handleAction('Explain this concept to me')}>
          <span className="action-icon">💡</span>
          <span className="action-title">Explanations</span>
          <span className="action-desc">Understand complex topics</span>
        </button>
        <button className="action-btn" onClick={() => handleAction('Help me write something creative')}>
          <span className="action-icon">✨</span>
          <span className="action-title">Creative Writing</span>
          <span className="action-desc">Generate content and ideas</span>
        </button>
        <button className="action-btn" onClick={() => handleAction('Help me solve this problem')}>
          <span className="action-icon">🎯</span>
          <span className="action-title">Problem Solving</span>
          <span className="action-desc">Find solutions to challenges</span>
        </button>
      </div>
    </div>
  );
}
