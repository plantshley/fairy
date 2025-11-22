import { motion } from 'framer-motion';

const tabs = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'shop', label: 'Shop', emoji: '🛍️' },
  { id: 'links', label: 'Links', emoji: '🔗' },
  { id: 'gallery', label: 'Gallery', emoji: '🎨' },
  { id: 'build', label: 'Build', emoji: '🧶' },
];

export const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-30">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-2 space-y-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className="w-full px-3 py-2 rounded-xl font-medium transition-all text-left flex items-center gap-2"
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
            }}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className="text-xs whitespace-nowrap">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.span
                className="ml-auto"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✨
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </nav>
  );
};
