import { motion } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';
import { LinkCard } from '../components/LinkCard';
import { links } from '../linksData';

export const Links = ({ currentTheme }) => {
  const decorations = currentTheme?.decorations || ['～ ♡', '⋆｡°✩', '｡ﾟ･ ✧', '･ﾟ･｡'];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ⋆｡‧˚ʚ♡ɞ˚‧｡⋆ links ⋆｡‧˚ʚ♡ɞ˚‧｡⋆
      </motion.h1>

      <p className="text-center mb-8 text-sm sm:text-base md:text-lg lg:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ʚ♡ɞ connect with me across the web ʚ♡ɞ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
        {links.map((link, index) => (
          <LinkCard key={link.url} link={link} index={index} currentTheme={currentTheme} />
        ))}
      </div>

      <motion.p
        className="mt-12 text-center text-base"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
      >
        {decorations.join(' ')}
      </motion.p>
    </motion.div>
  );
};
