import { motion } from 'framer-motion';

const TABS = [
  { id: 'bodyType', label: 'Body', icon: '🦁' },
  { id: 'face', label: 'Face', icon: '👀' },
  { id: 'bodyParts', label: 'Parts', icon: '🦋' },
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'edit', label: 'Edit', icon: '✏️', conditional: true },
];

export const MobileTabNavigation = ({
  activeTab,
  onTabChange,
  hasSelectedObject = false,
  theme,
}) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  // Show all tabs always - Edit tab will show helpful message when no object selected
  const visibleTabs = TABS;

  return (
    <div className="mb-3">
      <div
        className="flex gap-1 p-1 rounded-2xl"
        style={{
          backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        }}
      >
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className="flex-1 flex items-center justify-center py-2 px-1 rounded-xl font-bonbon text-sm sm:text-base md:text-lg transition-colors"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  : 'transparent',
                color: isActive ? 'white' : 'var(--text-primary)',
                minHeight: '40px',
              }}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="truncate w-full text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
