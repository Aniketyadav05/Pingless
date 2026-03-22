import React from 'react';
import { motion } from 'framer-motion';
import { micro } from '../../lib/motion';

export function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
      <path
        d="M1 4L3.5 6.5L9 1"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const taskRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '7px 0',
};

const taskTextBase = {
  flex: 1,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.5,
  fontFamily: 'var(--font-sans)',
};

const taskRemove = {
  background: 'none',
  border: 'none',
  color: 'var(--text-3)',
  cursor: 'pointer',
  fontSize: '16px',
  lineHeight: 1,
  padding: '0 2px',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  fontFamily: 'var(--font-sans)',
};

const taskDivider = {
  height: '1px',
  background: 'var(--border)',
  marginLeft: '30px',
};

export function TaskItem({ task, onToggle, onRemove, isLast }) {
  return (
    <>
      <div className="pingless-task-row" style={taskRow}>
        <motion.button
          type="button"
          onClick={() => onToggle(task.id)}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: micro.duration, ease: micro.ease }}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: task.completed ? 'var(--accent-soft)' : 'transparent',
            border: task.completed ? '1.5px solid var(--accent)' : '1.5px solid var(--border-strong)',
            cursor: 'pointer',
            transition: 'background 120ms ease, border-color 120ms ease',
          }}
          aria-pressed={task.completed}
        >
          <motion.span
            initial={false}
            animate={{
              opacity: task.completed ? 1 : 0,
              scale: task.completed ? 1 : 0.85,
            }}
            transition={{ duration: 0.18, ease: micro.ease }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {task.completed && <CheckIcon />}
          </motion.span>
        </motion.button>

        <motion.span
          initial={false}
          animate={{
            opacity: task.completed ? 0.72 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            ...taskTextBase,
            color: task.completed ? 'var(--text-3)' : 'var(--text)',
            textDecoration: task.completed ? 'line-through' : 'none',
            transition: 'color 200ms ease',
          }}
        >
          {task.text}
        </motion.span>

        <button
          type="button"
          className="pingless-task-remove"
          onClick={() => onRemove(task.id)}
          style={taskRemove}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-3)';
          }}
          aria-label="Remove task"
        >
          ×
        </button>
      </div>
      {!isLast && <div style={taskDivider} />}
    </>
  );
}
