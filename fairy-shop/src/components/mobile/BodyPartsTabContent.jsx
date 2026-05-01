import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const CollapsibleSection = ({ title, parts, isCollapsed, onToggle, onAddObject, isDarkTheme }) => {
  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between mb-2 py-2 px-3 rounded-xl transition-all"
        style={{
          backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        }}
        onClick={onToggle}
      >
        <span
          className="font-bonbon tracking-wider text-base sm:text-lg md:text-xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </span>
        <span
          className="text-sm transition-transform"
          style={{
            color: 'var(--text-secondary)',
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
          }}
        >
          ▶
        </span>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-1.5 pb-2">
              {parts.map((part) => (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BodyPartsTabContent = ({ parts, onAddObject, theme }) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  // Local state for collapsible sections - collapsed by default
  const [collapsedSections, setCollapsedSections] = useState({
    limbs: true,
    accessories: true,
    earsWingsTails: true,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const limbsParts = parts?.limbs || [];
  const accessoriesParts = parts?.accessories || [];
  const earsWingsTailsParts = parts?.earsWingsTails || [];

  return (
    <div className="pb-4">
      <h3
        className="font-bonbon tracking-wider text-lg sm:text-xl md:text-2xl font-bold text-center mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Body Parts
      </h3>

      <CollapsibleSection
        title="Limbs"
        parts={limbsParts}
        isCollapsed={collapsedSections.limbs}
        onToggle={() => toggleSection('limbs')}
        onAddObject={onAddObject}
        isDarkTheme={isDarkTheme}
      />

      <CollapsibleSection
        title="Accessories"
        parts={accessoriesParts}
        isCollapsed={collapsedSections.accessories}
        onToggle={() => toggleSection('accessories')}
        onAddObject={onAddObject}
        isDarkTheme={isDarkTheme}
      />

      <CollapsibleSection
        title="Ears, Wings & Tails"
        parts={earsWingsTailsParts}
        isCollapsed={collapsedSections.earsWingsTails}
        onToggle={() => toggleSection('earsWingsTails')}
        onAddObject={onAddObject}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
};
