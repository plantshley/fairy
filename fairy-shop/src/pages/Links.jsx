import { motion } from 'framer-motion';

const links = [
  { url: 'https://www.instagram.com/kirametki/', label: 'Instagram', labelSuffix: '(crochet)', emoji: '🪻', color: '#E4405F', subtitle: '@kirametki' },
  { url: 'https://www.instagram.com/fairykun', label: 'Instagram', labelSuffix: '(drawing)', emoji: '🌷', color: '#E4405F', subtitle: '@fairykun' },
  { url: 'https://form.jotform.com/232175428265155', label: 'Customs Form', emoji: '💐', color: '#C5A3FF', subtitle: 'custom crochet requests' },
  { url: 'https://www.venmo.com/u/kirametki', label: 'Venmo', emoji: '💎', color: '#3D95CE', subtitle: '@kirametki' },
  { url: 'https://paypal.me/fairykun?country.x=US&locale.x=en_US', label: 'PayPal', emoji: '💝', color: '#0070BA', subtitle: '@fairykun' },
  { url: 'https://packimals.co/fairy', label: 'Shop Packimals', emoji: '🦁', color: '#FFB6C1', subtitle: 'plushie backpacks' },
  { url: 'http://fairykun.redbubble.com', label: 'Redbubble', emoji: '🫧', color: '#E41321', subtitle: 'stickers & merch' },
  { url: 'https://www.inprnt.com/gallery/fairy/', label: 'Art Prints', emoji: '🎨', color: '#FF69B4', subtitle: 'gallery prints' },
  { url: 'https://www.behance.net/gallery/73695003/Ashley-Geraets-Digital-Portfolio-%282015-present%29', label: 'Art Portfolio', emoji: '🎀', color: '#1769FF', subtitle: '2015 to present' },
];

export const Links = ({ currentTheme }) => {
  const decorations = currentTheme?.decorations || ['～ ♡', '⋆｡°✩', '｡ﾟ･ ✧', '･ﾟ･｡'];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-4xl mb-4 gradient-text text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        ⋆｡‧˚ʚ♡ɞ˚‧｡⋆ links ⋆｡‧˚ʚ♡ɞ˚‧｡⋆
      </motion.h1>

      <p className="text-center mb-12 text-base" style={{ color: 'var(--text-secondary)' }}>
        ʚ♡ɞ connect with me across the web ʚ♡ɞ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
        {links.map((link, index) => (
          <motion.a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl overflow-hidden h-32 w-full"
              style={{
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <div className="flex items-center gap-4 h-full">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: `${link.color}20` }}
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {link.emoji}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold gradient-text">
                    {link.label}
                    {link.labelSuffix && (
                      <div className="text-xs font-normal opacity-70">
                        {link.labelSuffix}
                      </div>
                    )}
                  </h3>
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {link.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.a>
        ))}
      </div>

      <motion.p
        className="mt-12 text-center text-base"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {decorations.join(' ')}
      </motion.p>
    </motion.div>
  );
};
