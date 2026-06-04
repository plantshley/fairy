import { motion } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';
import { LinkCard } from '../components/LinkCard';

const links = [
  { url: 'https://www.instagram.com/kirametki/', label: 'Instagram', labelSuffix: '(crochet)', emoji: '🪻', color: '#E4405F', subtitle: '@kirametki' },
  { url: 'https://www.instagram.com/fairykun', label: 'Instagram', labelSuffix: '(drawing)', emoji: '🌷', color: '#E4405F', subtitle: '@fairykun' },
  { url: 'https://form.jotform.com/232175428265155', label: 'Customs Form', emoji: '💐', color: '#C5A3FF', subtitle: 'custom crochet requests' },
  { url: 'https://www.venmo.com/u/kirametki', label: 'Venmo', emoji: '💎', color: '#3D95CE', subtitle: '@kirametki' },
  { url: 'https://paypal.me/fairykun?country.x=US&locale.x=en_US', label: 'PayPal', emoji: '💝', color: '#0070BA', subtitle: '@fairykun' },
  { url: 'https://packimals.co/fairy', label: 'Packimals.co', emoji: '🦁', color: '#FFB6C1', subtitle: 'plushie backpacks' },
  { url: 'http://fairykun.redbubble.com', label: 'Redbubble', emoji: '🫧', color: '#E41321', subtitle: 'stickers & merch' },
  { url: 'https://www.inprnt.com/gallery/fairy/', label: 'Art Prints', emoji: '🎨', color: '#FF69B4', subtitle: 'gallery prints' },
  { url: 'https://www.behance.net/gallery/73695003/Ashley-Geraets-Digital-Portfolio-%282015-present%29', label: 'Art Portfolio', emoji: '🎀', color: '#1769FF', subtitle: '2015 to present' },
];

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
