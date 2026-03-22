import React from 'react';
import { motion } from 'framer-motion';
import { easeOut } from '../../lib/motion';
import { FIELD_ACCENTS } from '../../lib/fieldAccents';
import { CheckIcon } from './TaskItem';

export function StatusCard({ card, content }) {
  const isArray = Array.isArray(content);
  const completedCount = isArray ? content.filter((t) => t.completed).length : 0;
  const totalCount = isArray ? content.length : 0;
  const accent = FIELD_ACCENTS[card.key] || '#555';

  return (
    <div style={styles.card} className="status-card">
      <div style={{ ...styles.accentBar, background: accent }} aria-hidden />

      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <div style={styles.cardLabelWrap}>
            <span style={styles.cardIconPill}>{card.icon}</span>
            <span style={styles.cardLabel}>{card.label}</span>
          </div>

          {isArray && totalCount > 0 && (
            <div style={styles.progressWrap}>
              <span style={styles.progressText}>
                {completedCount}/{totalCount}
              </span>
              <div style={styles.progressTrack}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  style={styles.progressFill}
                />
              </div>
            </div>
          )}
        </div>

        <div style={styles.cardBody}>
          {isArray ? (
            content.length === 0 ? (
              <span style={styles.emptyState}>Nothing listed yet</span>
            ) : (
              <div style={styles.taskList}>
                {content.map((task, i) => (
                  <React.Fragment key={task.id || i}>
                    <div style={styles.taskRow}>
                      <span
                        style={{
                          ...styles.taskCheck,
                          background: task.completed ? 'var(--accent-soft)' : 'var(--bg-soft)',
                          border: task.completed
                            ? '1.5px solid var(--accent-border)'
                            : '1.5px solid var(--border-mid)',
                        }}
                      >
                        {task.completed && (
                          <span style={styles.taskCheckInner}>
                            <CheckIcon />
                          </span>
                        )}
                      </span>
                      <span
                        style={{
                          ...styles.taskText,
                          color: task.completed ? 'var(--text-3)' : 'var(--text)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.text}
                      </span>
                    </div>
                    {i < content.length - 1 && <div style={styles.taskDivider} />}
                  </React.Fragment>
                ))}
              </div>
            )
          ) : (
            <p className="profile-plain-text">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-xs)',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
  },
  cardContent: {
    flex: 1,
    padding: '18px 20px 20px 21px',
    minWidth: 0,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
  },
  cardLabelWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardIconPill: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    flexShrink: 0,
    background: 'var(--bg-soft)',
    border: '1px solid var(--border)',
    color: 'var(--text-2)',
  },
  cardLabel: {
    fontSize: '10px',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    flexShrink: 0,
  },
  progressText: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-3)',
    fontFamily: 'var(--font-mono)',
  },
  progressTrack: {
    width: '36px',
    height: '3px',
    borderRadius: '2px',
    background: 'var(--bg-soft)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'var(--text-3)',
  },
  cardBody: {},
  taskList: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    padding: '6px 0',
  },
  taskCheck: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
  },
  taskCheckInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskText: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.5,
    flex: 1,
    fontFamily: 'var(--font-sans)',
  },
  taskDivider: {
    height: '1px',
    background: 'var(--border)',
    marginLeft: '26px',
  },
  emptyState: {
    fontSize: '14px',
    color: 'var(--text-3)',
    fontStyle: 'italic',
    fontFamily: 'var(--font-sans)',
  },
};
