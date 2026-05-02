import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MessageEditorModalProps {
  open: boolean;
  initialText: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export function MessageEditorModal({ open, initialText, onSave, onClose }: MessageEditorModalProps) {
  const [value, setValue] = useState(initialText);

  useEffect(() => {
    if (open) {
      setValue(initialText);
    }
  }, [initialText, open]);

  if (!open) return null;

  return (
    <div className="overlay">
      <motion.div className="modal-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="modal-header">
          <h3>Edit Message</h3>
          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>
        <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={6} />
        <div className="modal-actions">
          <button className="button button-muted" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button button-primary"
            onClick={() => {
              onSave(value.trim() || initialText);
              onClose();
            }}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
