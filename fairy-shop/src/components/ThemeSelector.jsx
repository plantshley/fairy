import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { themes } from '../themes';

export const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Preload all creature images on mount
  useEffect(() => {
    const imagesToPreload = [
      '/heart-bright1.png',
      '/disco-fever-griffon.png',
      '/moon-custom1.png',
      '/glacial-seas-dolphin1.png',
      '/homura1.png',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getModalCreature = () => {
    switch (currentTheme?.id) {
      case 'twinkleFairyDream':
        return '/heart-bright1.png';
      case 'glitterGroovyRainbow':
        return '/disco-fever-griffon.png';
      case 'celestialAngelicClouds':
        return '/moon-custom1.png';
      case 'crystalSeasideGarden':
        return '/glacial-seas-dolphin1.png';
      case 'midnightVelvetMeadow':
        return '/homura1.png';
      default:
        return '/heart-bright1.png';
    }
  };

  return (
    <>
      {/* Corner creature button */}
      <motion.button
        className="fixed bottom-20 right-2 sm:bottom-6 sm:right-6 z-50 cursor-pointer bg-transparent border-none p-0"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Change theme"
      >
        <motion.img
          src={getModalCreature()}
          alt="Change theme"
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
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
                <h2 className="font-kalnia text-4xl mb-2 gradient-text text-center">
                  Choose Your Magic
                </h2>

                <p className="text-center text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
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
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center justify-center gap-1 text-center">
                        <div className="font-semibold text-base" style={{ color: theme.colors.textPrimary }}>
                          {theme.name}
                        </div>
                        <div className="text-base">
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
