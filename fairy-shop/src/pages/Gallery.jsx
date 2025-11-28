import { motion } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';

export const Gallery = () => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ₊˚⊹♡ gallery ♡⊹˚₊
      </motion.h1>

      <p className="text-center mb-8 text-base sm:text-lg md:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ⊹ creations & artwork ⊹
      </p>

      <motion.div
        className="bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl max-w-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl">🧶</div>
          <h2 className="font-kalnia text-3xl gradient-text">
            Coming Soon!
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            I'm currently curating my favorite pieces to share with you. This gallery will feature:
          </p>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧸</span>
              <span>Crochet plushie collection</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <span>Original artwork & illustrations</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span>Work-in-progress peeks</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💖</span>
              <span>Custom commission examples</span>
            </div>
          </div>
          <motion.div
            className="text-4xl pt-4"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🌸 ☁️ 🦋
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
