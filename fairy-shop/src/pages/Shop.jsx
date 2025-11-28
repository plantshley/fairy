import { motion } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';

export const Shop = () => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ✧･ﾟ: *✧･ﾟ:* shop *:･ﾟ✧*:･ﾟ✧
      </motion.h1>

      <p className="text-center mb-8 text-xl font-bonbon tracking-wider" style={{ color: 'var(--text-primary)' }}>
        ･ﾟ✧ browse my crochet creatures ✧ﾟ･
      </p>

      {/* Ko-fi Shop Embed */}
      <motion.div
        className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ height: '80vh' }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <iframe
          id="kofiframe"
          src="https://ko-fi.com/kirametki/shop"
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
          }}
          title="Ko-fi Shop"
        />
      </motion.div>

      <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        💞 handmade with love & care 💞
      </p>
    </motion.div>
  );
};
