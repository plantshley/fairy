import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Sparkle } from '../components/Sparkle';
import { LinkCard } from '../components/LinkCard';
import { trackPageView, trackTiming } from '../utils/analytics';

const shopLink = {
  url: 'https://ko-fi.com/kirametki/shop',
  label: '˚₊‧ ꒰ა ♡ ko-fi shop ♡ ໒꒱ ‧₊˚',
  emoji: '🌺',
  color: '#ff6fdd',
  subtitle: '⋆˚࿔ personal product grid in progress ࿔˚⋆',
  trackEvent: 'shop_link_clicked',
};

export const Shop = ({ currentTheme }) => {
  const entryTimeRef = useRef(null);

  useEffect(() => {
    // Track page view on mount
    trackPageView('shop');
    entryTimeRef.current = Date.now();

    // Track time on page on unmount
    return () => {
      if (entryTimeRef.current) {
        const timeSpent = Math.round((Date.now() - entryTimeRef.current) / 1000);
        trackTiming('shop_page_time', timeSpent, 'shop_engagement');
      }
    };
  }, []);

  return (
    <motion.div
      className="w-full min-h-dvh flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Title + subtitle pinned to the top */}
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ✧･ﾟ: *✧･ﾟ:* shop *:･ﾟ✧*:･ﾟ✧
      </motion.h1>

      <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ･ﾟ✧ browse my crochet creatures ✧ﾟ･
      </p>

      {/* Ko-fi shop link, centered in the remaining space.
          Ko-fi blocks iframe embedding, so we link out instead.
          A custom product grid that links to each item is planned. */}
      <div className="flex-1 flex items-center justify-center w-full">
        <LinkCard
          link={shopLink}
          index={0}
          currentTheme={currentTheme}
          className="block w-full max-w-md"
          allowSubtitleWrap
        />
      </div>

      {/* Pinned to the bottom */}
      <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
        ⋆⁺₊⋆ handmade with love & care ⋆⁺₊⋆
      </p>
    </motion.div>
  );
};
