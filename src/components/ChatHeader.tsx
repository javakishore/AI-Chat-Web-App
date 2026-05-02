import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { EngineOption } from '../types';
import { EngineDropdown } from './EngineDropdown';

interface ChatHeaderProps {
  engine: EngineOption;
  onEngineChange: (engine: EngineOption) => void;
}

export function ChatHeader({ engine, onEngineChange }: ChatHeaderProps) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="chat-header">
      <div>
        <h2>{engine}</h2>
        <p>Choose an AI engine and continue your conversation.</p>
      </div>
      <div className="header-actions">
        <EngineDropdown value={engine} onChange={onEngineChange} />
        <button className="button button-muted" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
}
