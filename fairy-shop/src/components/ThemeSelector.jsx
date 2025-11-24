import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { themes } from '../themes';

export const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Corner creature button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 cursor-pointer bg-transparent border-none p-0"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        title="Change theme"
      >
        <img
          src="/wings-bun-png4.png"
          alt="Change theme"
          className="w-24 h-24 object-contain"
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
                className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  maxWidth: '90vw',
                  width: '500px',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
              <div className="relative">
                {/* Decorative creature in corner */}
                <div className="absolute -top-4 -right-4 text-4xl"></div>

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
                  whileHover={{ opacity: 0.6 }}
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
