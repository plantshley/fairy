import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { themes } from '../themes';
import { getAssetPath } from '../utils/assetPath';
import { trackEvent } from '../utils/analytics';

export const ThemeSelector = ({ currentTheme, onThemeChange, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Preload all creature images on mount
  useEffect(() => {
    const imagesToPreload = [
      getAssetPath('/heart-bright1.png'),
      getAssetPath('/disco-fever-griffon.png'),
      getAssetPath('/moon-custom1.png'),
      getAssetPath('/glacial-seas-dolphin1.png'),
      getAssetPath('/homura1.png'),
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getModalCreature = () => {
    switch (currentTheme?.id) {
      case 'twinkleFairyDream':
        return getAssetPath('/heart-bright1.png');
      case 'glitterGroovyRainbow':
        return getAssetPath('/disco-fever-griffon.png');
      case 'celestialAngelicClouds':
        return getAssetPath('/moon-custom1.png');
      case 'crystalSeasideGarden':
        return getAssetPath('/glacial-seas-dolphin1.png');
      case 'midnightVelvetMeadow':
        return getAssetPath('/homura1.png');
      default:
        return getAssetPath('/heart-bright1.png');
    }
  };

  return (
    <>
      {/* Corner creature button with speech bubble */}
      <div className={`fixed z-50 ${
        activeTab === 'build'
          ? 'top-2 left-2 md:top-auto md:left-auto md:bottom-20 md:right-2 lg:bottom-8 lg:right-8'
          : 'bottom-20 right-2 landscape:bottom-2 landscape:right-2 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8'
      }`}>
        {/* Speech bubble - only show on home page */}
        {activeTab === 'home' && (
          <div
            className={`absolute ${activeTab === 'build' ? 'portrait:max-md:-right-4 portrait:max-md:top-2' : ''} -left-4 top-2 landscape:-left-4 landscape:top-4 sm:-left-6 sm:top-4 lg:-left-4 lg:top-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full backdrop-blur-sm text-[7px] sm:text-[8px] lg:text-xs text-center flex flex-col items-center relative overflow-visible`}
            style={{
              background: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              color: 'var(--text-primary)',
              lineHeight: '1.1',
              paddingTop: '2px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div>choose</div>
              <div>your</div>
              <div>magic</div>
              <div>♡⋆｡°✩</div>
            </div>
            {/* Speech bubble tail - triangular (mobile portrait on build page: points left, all others: points right) */}
            <div
              className={`absolute ${activeTab === 'build' ? 'portrait:max-md:bottom-2.5 portrait:max-md:left-0 portrait:max-md:rotate-[-45deg]' : ''} bottom-2.5 right-0 rotate-45 landscape:bottom-2.5 landscape:right-0 landscape:rotate-45`}
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: currentTheme?.id === 'midnightVelvetMeadow' ? '6px solid rgba(42, 16, 53, 0.9)' : '6px solid rgba(255, 255, 255, 0.9)',
              }}
            />
          </div>
        )}

        <motion.button
          className="cursor-pointer bg-transparent border-none p-0"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Change theme"
        >
          <motion.img
            src={getModalCreature()}
            alt="Change theme"
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.button>
      </div>

      {/* Theme selection modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              {/* Modal */}
              <motion.div
                className="backdrop-blur-md rounded-3xl p-6 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  maxWidth: '90vw',
                  width: '500px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
              <div className="relative">
                <h2 className="font-kalnia text-2xl sm:text-3xl lg:text-4xl mb-2 gradient-text text-center">
                  ✧ Choose Your Magic ✧
                </h2>

                <p className="text-center text-xs sm:text-sm mb-4 sm:mb-6" style={{ color: 'var(--text-secondary)' }}>
                  ˚ ༘♡ Select a theme ♡⋆˚
                </p>

                <div className="space-y-4">
                  {Object.values(themes).map((theme) => (
                    <motion.button
                      key={theme.id}
                      className="w-full p-4 rounded-2xl transition-all overflow-hidden relative h-20 flex items-center justify-center"
                      style={{
                        border: currentTheme.id === theme.id ? `3px solid ${theme.colors.accentPrimary}` : 'none',
                        background: theme.id === 'glitterGroovyRainbow'
                          ? 'linear-gradient(90deg, #ff3399, #ff9933, #ffdd00, #00d4ff, #5599ff, #aa66ff, #ff3399)'
                          : `linear-gradient(135deg, ${theme.colors.bgGradientStart}, ${theme.colors.bgGradientMid})`,
                      }}
                      onClick={() => {
                        onThemeChange(theme);
                        setIsOpen(false);
                        trackEvent('theme_changed', {
                          theme_id: theme.id,
                          theme_name: theme.name,
                        });
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center justify-center gap-1 text-center">
                        <div className="font-bonbon tracking-wider text-base sm:text-lg lg:text-xl" style={{ color: theme.colors.textPrimary }}>
                          {theme.name}
                        </div>
                        <div className="text-sm sm:text-base">
                          {theme.emojis.join(' ')}
                        </div>
                      </div>
                      {currentTheme.id === theme.id && (
                        <span className="absolute right-3 text-xl">💖</span>
                      )}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  className="mt-6 w-full py-2 px-4 rounded-full font-medium"
                  style={{
                    background: 'var(--accent-primary)',
                    color: 'white',
                  }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ opacity: 0.8 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close ⋆˚✿˖°
                </motion.button>
              </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
