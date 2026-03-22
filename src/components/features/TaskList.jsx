import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedback } from '../../lib/motion';
import { TaskItem } from './TaskItem';

export function TaskList({ items = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const addTask = () => {
    if (!draft.trim()) return;
    onChange([...items, { id: Date.now() + Math.random(), text: draft.trim(), completed: false }]);
    setDraft('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setDraft('');
    }
  };

  const toggle = (id) =>
    onChange(items.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const remove = (id) => onChange(items.filter((t) => t.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <AnimatePresence initial={false}>
        {items.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              opacity: { duration: 0.18 },
              height: { duration: 0.18, ease: feedback.ease },
            }}
            style={{ overflow: 'hidden' }}
          >
            <TaskItem
              task={task}
              onToggle={toggle}
              onRemove={remove}
              isLast={i === items.length - 1}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <div>
        <div className="pingless-task-input-wrap">
          <span
            style={{
              fontSize: '16px',
              color: 'var(--text-3)',
              fontWeight: 400,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            +
          </span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={addTask}
            placeholder={placeholder || 'Add a task…'}
            className="pingless-task-input"
          />
        </div>
        <p
          style={{
            margin: '6px 2px 0',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-3)',
            opacity: 0.85,
            letterSpacing: '0.01em',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Add a task — press Enter
        </p>
      </div>
    </div>
  );
}
