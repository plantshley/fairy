import { motion } from 'framer-motion';

const links = [
  { url: 'https://www.instagram.com/kirametki/', label: 'Instagram', emoji: '💌', color: '#E4405F', subtitle: '@kirametki' },
  { url: 'https://form.jotform.com/232175428265155', label: 'Custom Order Form', emoji: '🧚‍♀️', color: '#C5A3FF', subtitle: 'Request a commission' },
  { url: 'https://packimals.co/fairy', label: 'Shop Packimals', emoji: '🐻', color: '#FFB6C1', subtitle: 'Cute plushies' },
  { url: 'https://paypal.me/fairykun?country.x=US&locale.x=en_US', label: 'PayPal', emoji: '🌸', color: '#0070BA', subtitle: 'Support me' },
  { url: 'https://www.venmo.com/u/kirametki', label: 'Venmo', emoji: '💎', color: '#3D95CE', subtitle: '@kirametki' },
  { url: 'http://fairykun.redbubble.com', label: 'Redbubble', emoji: '💖', color: '#E41321', subtitle: 'Art & merch' },
  { url: 'https://www.inprnt.com/gallery/fairy/', label: 'Art Prints', emoji: '🎨', color: '#FF69B4', subtitle: 'Gallery prints' },
  { url: 'https://www.behance.net/gallery/73695003/Ashley-Geraets-Digital-Portfolio-%282015-present%29', label: 'Art Portfolio', emoji: '🎀', color: '#1769FF', subtitle: 'Full portfolio' },
];

export const Links = () => {
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
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl overflow-hidden"
              style={{
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              {/* Floating emoji bubble effect */}
              <motion.div
                className="absolute -top-2 -right-2 text-4xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {link.emoji}
              </motion.div>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${link.color}20` }}
                >
                  {link.emoji}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold gradient-text">
                    {link.label}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {link.subtitle}
                  </p>
                </div>
              </div>

              {/* Sparkle on hover */}
              <motion.div
                className="absolute bottom-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            </motion.div>
          </motion.a>
        ))}
      </div>

      <motion.p
        className="mt-12 text-center text-sm"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        💖 Follow for updates, behind-the-scenes, and new creations! 🌸
      </motion.p>
    </motion.div>
  );
};
