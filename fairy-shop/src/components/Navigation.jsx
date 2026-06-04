import { motion } from 'framer-motion';
import { getAssetPath } from '../utils/assetPath';

const tabs = [
  { id: 'home', label: 'home', icon: getAssetPath('/house.png') },
  { id: 'shop', label: 'shop', icon: getAssetPath('/rich.png') },
  { id: 'links', label: 'links', icon: getAssetPath('/moon.png') },
  { id: 'gallery', label: 'gallery', icon: getAssetPath('/rainbow.png') },
  { id: 'build', label: 'build', icon: getAssetPath('/visualis.png') },
];

export const Navigation = ({ activeTab, onTabChange, currentTheme }) => {
  // Hide navigation entirely on the build page — hamburger menu is the only nav there.
  if (activeTab === 'build') {
    return null;
  }

  const getThemeEmoji = () => {
    switch (currentTheme?.id) {
      case 'twinkleFairyDream':
        return '🌷';
      case 'glitterGroovyRainbow':
        return '🌈';
      case 'celestialAngelicClouds':
        return '🤍';
      case 'crystalSeasideGarden':
        return '🌊';
      case 'midnightVelvetMeadow':
        return '🥀';
      case 'sweetCherryLove':
        return '🍒';
      default:
        return '💕';
    }
  };

  return (
    <>
      {/* Desktop Navigation - hidden on mobile */}
      <nav className="fixed left-2 bottom-2 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-30 hidden landscape:block lg:block">
        <div
          className="backdrop-blur-md rounded-2xl shadow-2xl p-1 space-y-0.5"
          style={{
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className="w-full px-0.5 py-1 rounded-xl font-medium transition-all text-left flex items-center gap-1"
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
              <img src={tab.icon} alt={tab.label} className="w-6 h-6 lg:w-8 lg:h-8 object-contain" />
              <span className="text-xs lg:text-sm whitespace-nowrap font-bonbon tracking-wider">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.span
                  className="ml-auto text-xs lg:text-base"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {getThemeEmoji()}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation - bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 landscape:hidden lg:hidden">
        <div
          className="backdrop-blur-md shadow-2xl border-t-2"
          style={{
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div className="flex justify-around items-center p-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className="flex flex-col items-center gap-1 p-2 rounded-xl flex-1"
                style={{
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                    : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                }}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.95 }}
              >
                <img src={tab.icon} alt={tab.label} className="w-6 h-6 object-contain" />
                <span className="text-xs font-bonbon">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
