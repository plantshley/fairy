import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-center space-y-8 max-w-3xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated emoji header */}
        <motion.div
          className="text-7xl"
          style={{ willChange: 'transform' }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            times: [0, 0.5, 1],
          }}
        >
          🧚‍♀️ 🧶 ✨
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="font-kalnia text-7xl md:text-8xl gradient-text leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Kirametki
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl md:text-3xl font-medium"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ˚ ༘♡ Handmade Crochet Creations ⋆˚✿˖°
        </motion.p>

        {/* Description */}
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Welcome to my cozy corner of the internet! 💖 I create adorable crochet plushies,
            share my art, and spread joy one stitch at a time. Browse my shop, connect with me,
            and find something magical! 🌸
          </p>
        </motion.div>

        {/* Floating emojis */}
        <motion.div
          className="flex justify-center gap-6 text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.span
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🌈
          </motion.span>
          <motion.span
            animate={{
              y: [0, -15, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          >
            🎨
          </motion.span>
          <motion.span
            animate={{
              y: [0, -12, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
          >
            💗
          </motion.span>
        </motion.div>

        {/* Call to action */}
        <motion.p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ˗ˏˋ ★ Use the navigation on the left to explore ★ ˎˊ˗
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
