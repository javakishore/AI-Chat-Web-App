import { motion } from 'framer-motion';

interface DeleteConfirmProps {
  open: boolean;
  label: string;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirm({ 
  open, 
  label, 
  title = "Delete Message?", 
  message = "Are you sure you want to delete this message? This action cannot be undone.",
  onConfirm, 
  onCancel 
}: DeleteConfirmProps) {
  if (!open) return null;

  return (
    <div className="overlay">
      <motion.div
        className="modal-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <div className="modal-icon">!</div>
          <div>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="button button-muted" onClick={onCancel}>
            Cancel
          </button>
          <button className="button button-danger" onClick={onConfirm}>
            {label}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
