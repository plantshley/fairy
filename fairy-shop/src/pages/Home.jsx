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
        className="text-center space-y-8 max-w-6xl w-full px-8"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated image header */}
        <div className="flex justify-center gap-8 items-center">
          <motion.img
            src="/vday-birb-png1.png"
            alt="Valentine's bird"
            className="w-24 h-24 object-contain"
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
          />
          <motion.img
            src="/snail5.png"
            alt="Snail"
            className="w-24 h-24 object-contain"
            style={{ willChange: 'transform' }}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              times: [0, 0.5, 1],
              delay: 0.3,
            }}
          />
          <motion.img
            src="/scootaloo1.png"
            alt="Scootaloo"
            className="w-24 h-24 object-contain"
            style={{ willChange: 'transform' }}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              times: [0, 0.5, 1],
              delay: 0.6,
            }}
          />
        </div>

        {/* Main title */}
        <motion.h1
          className="font-kalnia text-4xl md:text-5xl gradient-text leading-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          kirametki ♡ fairykun
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl font-medium text-center"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ˚ ༘♡ welcome to fairy's magical realm of visual art & creaturely crochet ⋆˚✿˖°
        </motion.p>

        {/* Description */}
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-base leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>
            In this enchanted garden where strength meets softness, I weave threads of wonder into creaturely companions
            and paint digital dreams with pixels of stardust. 🌷 As an environmental engineer by day, I channel the earth's
            rhythms into sustainable magic. By twilight, I'm a powerlifter sculpting strength like clay, discovering resilience
            in every rep. Through my autistic lens, I perceive patterns invisible to most—transforming hyperfocus into
            meticulous stitchwork and cascading watercolor galaxies. Here, science dances with whimsy, iron meets yarn,
            and every creation blooms from the intersection of precision and poetry. 💫 Welcome to where all my worlds collide
            in kaleidoscopic harmony.
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
          ˗ˏˋ ★ Use the navigation on the left to explore and click the bunny to the right to customize the theme ★ ˎˊ˗
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
