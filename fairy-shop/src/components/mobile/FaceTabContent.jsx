import { motion } from 'framer-motion';

export const FaceTabContent = ({ parts, onAddObject, theme }) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  // parts.eyes contains all facial features (54 items)
  const facialParts = parts?.eyes || [];

  return (
    <div className="pb-4">
      <h3
        className="font-bonbon tracking-wider text-lg font-bold text-center mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Facial Features
      </h3>

      <div className="grid grid-cols-5 gap-1.5">
        {facialParts.map((part) => (
          <motion.button
            key={part.id}
            className="p-1 rounded-xl transition-all shadow-sm aspect-square flex items-center justify-center"
            style={{
              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            }}
            onClick={() => onAddObject(part)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            title={`Add ${part.name}`}
          >
            <img
              src={part.previewPath}
              alt={part.name}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
