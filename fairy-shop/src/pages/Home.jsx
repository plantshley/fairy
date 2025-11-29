import { motion } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';

export const Home = ({ currentTheme }) => {
  const getThemeEmojis = () => {
    switch (currentTheme?.id) {
      case 'twinkleFairyDream':
        return ['🪻', '🦋', '🌷'];
      case 'glitterGroovyRainbow':
        return ['✨', '🌈', '🦄'];
      case 'celestialAngelicClouds':
        return ['🤍', '☁️', '🕊️'];
      case 'crystalSeasideGarden':
        return ['🫧', '🪸', '💎'];
      case 'midnightVelvetMeadow':
        return ['🔮', '🥀', '🌙'];
      default:
        return ['🪻', '🦋', '🌷'];
    }
  };

  const themeEmojis = getThemeEmojis();

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-6xl w-full px-4 sm:px-6 lg:px-8"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated image header */}
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 items-center">
          <motion.img
            src="/vday-birb-png1.png"
            alt="Valentine's bird"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain"
            style={{ willChange: 'transform' }}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.img
            src="/scootaloo1.png"
            alt="Scootaloo"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain"
            style={{ willChange: 'transform' }}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.67,
            }}
          />
          <motion.img
            src="/butterflies.png"
            alt="Butterflies"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 object-contain"
            style={{ willChange: 'transform' }}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 1.33,
            }}
          />
        </div>

        {/* Main title */}
        <motion.h1
          className="font-kalnia text-3xl sm:text-4xl md:text-5xl lg:text-6xl gradient-text leading-tight text-center relative z-10"
          style={{ overflow: 'visible', paddingBottom: '8px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkle count={15} />
          fairykun ♡ kirametki
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center font-bonbon tracking-wider px-2"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ˚ ༘♡ welcome to fairy's magical realm of visual art & creaturely crochet ⋆˚✿˖°
        </motion.p>

        {/* Description */}
        <motion.div
          className="backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl"
          style={{
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm sm:text-base leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>
            In this enchanted garden where strength meets serenity, I weave threads of whimsy into 
            creaturely companions and paint dreams with glittering stardust🌷
            At dawn, I'm a powerlifter sculpting strength like clay, and by day I'm an environmental engineer, 
            channeling the earth's rhythms into sustainable magic. Through my autistic lens, I perceive patterns 
            invisible to most, transforming hyperfocus into cascading galaxies of art & research. Here, every creation blooms 
            from the kaleidoscopic harmony of precision and poetry ✧･ﾟ⋆｡°✩｡° ♡ ⋆
          </p>
        </motion.div>

        {/* Floating emojis */}
        <motion.div
          className="flex justify-center gap-4 sm:gap-6 text-3xl sm:text-4xl md:text-5xl"
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
            {themeEmojis[0]}
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
            {themeEmojis[1]}
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
            {themeEmojis[2]}
          </motion.span>
        </motion.div>

        {/* Call to action */}
        <motion.p
          className="text-xs px-2 text-center"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="hidden lg:inline">˗ˏˋ ★ Use the navigation on the left to explore and click the friend to the right to customize the theme ★ ˎˊ˗</span>
          <span className="lg:hidden">˗ˏˋ ★ Use the navigation below to explore and tap the friend to customize the theme ★ ˎˊ˗</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
