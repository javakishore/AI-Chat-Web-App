import { motion } from 'framer-motion';
import type { EngineOption } from '../types';

interface EngineDropdownProps {
  value: EngineOption;
  onChange: (engine: EngineOption) => void;
}

const engines: EngineOption[] = ['Neural Nexus', 'Cerebral Prime', 'Synapse Ultra', 'Logic Core'];

export function EngineDropdown({ value, onChange }: EngineDropdownProps) {
  return (
    <motion.div className="engine-dropdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <label className="engine-label">AI Engine</label>
      <select value={value} onChange={(event) => onChange(event.target.value as EngineOption)}>
        {engines.map((engine) => (
          <option key={engine} value={engine}>
            {engine}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
