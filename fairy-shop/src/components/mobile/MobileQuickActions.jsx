import { motion } from 'framer-motion';

export const MobileQuickActions = ({
  onExport,
  onSave,
  onUndo,
  onRedo,
  onClear,
  canUndo = false,
  canRedo = false,
  theme,
}) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  const actions = [
    { id: 'export', icon: '📥', label: 'Export', onClick: onExport },
    { id: 'save', icon: '💾', label: 'Save', onClick: onSave },
    { id: 'undo', icon: '↩️', label: 'Undo', onClick: onUndo, disabled: !canUndo },
    { id: 'redo', icon: '↪️', label: 'Redo', onClick: onRedo, disabled: !canRedo },
    { id: 'clear', icon: '🗑️', label: 'Clear', onClick: onClear },
  ];

  return (
    <div
      className="flex justify-around items-center gap-0.5 py-0.5 px-1 border-b"
      style={{
        borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      {actions.map((action) => (
        <motion.button
          key={action.id}
          title={action.label}
          className="p-0.5 flex flex-col items-center justify-center"
          style={{
            opacity: action.disabled ? 0.3 : 1,
            background: 'transparent',
          }}
          onClick={action.onClick}
          disabled={action.disabled}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-sm">{action.icon}</span>
          <span className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
