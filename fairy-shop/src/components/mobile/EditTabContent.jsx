import { motion } from 'framer-motion';

export const EditTabContent = ({
  selectedId,
  onFlip,
  onDuplicate,
  onMoveToFront,
  onMoveToBack,
  onDelete,
  theme,
}) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  const buttonStyle = {
    backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    color: 'var(--text-primary)',
  };

  const deleteButtonStyle = {
    backgroundColor: isDarkTheme ? 'rgba(255, 100, 100, 0.3)' : 'rgba(255, 100, 100, 0.2)',
    color: isDarkTheme ? '#ff9999' : '#cc0000',
  };

  const actions = [
    { id: 'flip', label: 'Flip Horizontal', icon: '↔️', onClick: onFlip },
    { id: 'duplicate', label: 'Duplicate', icon: '📋', onClick: onDuplicate },
    { id: 'toFront', label: 'Bring to Front', icon: '⬆️', onClick: onMoveToFront },
    { id: 'toBack', label: 'Send to Back', icon: '⬇️', onClick: onMoveToBack },
  ];

  if (!selectedId) {
    return (
      <div className="pb-4 flex flex-col items-center justify-center py-8">
        <p
          className="text-center font-bonbon text-lg"
          style={{ color: 'var(--text-secondary)' }}
        >
          No object selected
        </p>
        <p
          className="text-center text-sm mt-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          Tap an object on the canvas to edit it
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <h3
        className="font-mono tracking-wider text-lg font-bold text-center mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Edit Object
      </h3>

      <div className="space-y-1.5">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            className="w-full py-1.5 px-3 rounded-xl font-mono text-sm flex items-center gap-2 transition-colors"
            style={buttonStyle}
            onClick={action.onClick}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
          >
            <span className="text-base">{action.icon}</span>
            <span>{action.label}</span>
          </motion.button>
        ))}

        {/* Delete button - separated with more emphasis */}
        <div className="pt-1">
          <motion.button
            className="w-full py-1.5 px-3 rounded-xl font-mono text-sm flex items-center gap-2 transition-colors"
            style={deleteButtonStyle}
            onClick={onDelete}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
          >
            <span className="text-base">🗑️</span>
            <span>Delete Object</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
