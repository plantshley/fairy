import { motion } from 'framer-motion';

export const BuildYourOwn = () => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-6xl mb-4 gradient-text text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Build Your Own 🧶 ✨
      </motion.h1>

      <p className="text-center mb-12 text-lg" style={{ color: 'var(--text-secondary)' }}>
        ˗ˏˋ ★ Design your dream plushie ★ ˎˊ˗
      </p>

      <motion.div
        className="bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl max-w-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center space-y-6">
          <motion.div
            className="text-8xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🎀
          </motion.div>

          <h2 className="font-kalnia text-4xl gradient-text">
            Coming Soon!
          </h2>

          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            I'm working on something magical! Soon you'll be able to:
          </p>

          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">🎨</span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Design Your Plushie
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Mix and match parts to create your unique creature
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">🌈</span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Choose Colors
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Pick from a rainbow of yarn colors
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">✨</span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Add Accessories
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Bows, hats, scarves, and more!
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">💖</span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Order Custom
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  I'll bring your design to life!
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="text-5xl pt-6"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🧸 💫 🌸
          </motion.div>

          <p className="text-sm pt-4" style={{ color: 'var(--text-secondary)' }}>
            ˚ ༘♡ Stay tuned for this exciting feature! ⋆˚
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
