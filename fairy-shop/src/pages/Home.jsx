import { motion } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';
import { getAssetPath } from '../utils/assetPath';

// Theme-specific header art. The middle image (Scootaloo) is constant; the
// outer two swap per theme. Any theme not listed here keeps the defaults below.
// `size` is optional and overrides the slot's default width/height classes for
// art that reads too small at the shared size.
const PUPPER_SIZE = 'w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36';

const HEADER_ART = {
  glitterGroovyRainbow: { left: { src: '/pupper1.png', alt: 'Pupper', size: PUPPER_SIZE }, right: { src: '/sparkle bun2.png', alt: 'Sparkle bunny' } },
  celestialAngelicClouds: { left: { src: '/cutie-wizard1.png', alt: 'Cutie Wizard' } },
  sweetCherryLove: {
    left: { src: '/cutie-wizard1.png', alt: 'Cutie Wizard' },
    right: { src: '/lil demon.png', alt: 'Lil demon' },
  },
  // crystalSeasideGarden: { right: { src: '/lil kitty1.png', alt: 'Lil kitty' } },
  midnightVelvetMeadow: {
    left: { src: '/lil spooky2.png', alt: 'Lil spooky' },
    right: { src: '/sparkle bun2.png', alt: 'Sparkle bunny' },
  },
};

const LEFT_SIZE = 'w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28';
const RIGHT_SIZE = 'w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24';

const DEFAULT_LEFT_ART = { src: '/cutie-wizard-star1.png', alt: 'Cutie Wizard Star' };
const DEFAULT_RIGHT_ART = { src: '/sparkle-bun1.png', alt: 'Sparkle bunny' };

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
        return ['🍒', '🍰', '🌹'];
    }
  };

  const themeEmojis = getThemeEmojis();

  const headerArt = HEADER_ART[currentTheme?.id] || {};
  const leftArt = headerArt.left || DEFAULT_LEFT_ART;
  const rightArt = headerArt.right || DEFAULT_RIGHT_ART;

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-6xl w-full px-4 sm:px-6 lg:px-8"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Animated image header */}
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 items-center">
          <motion.img
            src={getAssetPath(leftArt.src)}
            alt={leftArt.alt}
            className={`${leftArt.size || LEFT_SIZE} object-contain`}
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
            src={getAssetPath('/scootaloo1.png')}
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
            src={getAssetPath(rightArt.src)}
            alt={rightArt.alt}
            className={`${rightArt.size || RIGHT_SIZE} object-contain`}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
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
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
          ˚꒰ა ♡ welcome to fairy's magical realm of visual art & creaturely crochet ⋆˚✿˖°
        </motion.p>

        {/* Description */}
        <motion.div
          className="backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl"
          style={{
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm sm:text-base leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>
            In this twinkling realm where strength meets serenity, fairy weave threads of whimsy into 
            creaturely companions and paint dreams with glittering stardust✧･ﾟ⋆｡°🌷🌈
            By dawn, she's a powerlifter divining strength and sculpting muscles, and by day an environmental engineer, 
            channeling the earth's rhythms into sustainable magic. Through her autistic lens, she can fathom patterns 
            hidden to many, transforming hyperfocus into cascading streams of art & research. At fairy's nexus, every creation blooms 
            from the kaleidoscopic harmony that binds fae with factuality ⋆｡✩｡°⁺₊♡ ⋆
          </p>
        </motion.div>

        {/* Floating emojis */}
        <motion.div
          className="flex justify-center gap-4 sm:gap-6 text-3xl sm:text-4xl md:text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
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
          transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
        >
          <span className="hidden lg:inline">˚₊‧꒰ა  Use the navigation on the left to explore and click the friend to the right to customize the theme ໒꒱ ‧₊˚</span>
          <span className="lg:hidden">˚₊‧꒰ა  Use the navigation below to explore and tap the friend to customize the theme ໒꒱ ‧₊˚</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
