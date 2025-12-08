import { motion } from 'framer-motion';

export const AccessibilityToggle = ({ accessibleFonts, onToggle }) => {
  return (
    <>
      {/* Desktop - aligns with left navigation */}
      <motion.button
        className="fixed bottom-6 left-2 z-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm hidden lg:block"
        style={{
          background: accessibleFonts
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.3)',
          color: accessibleFonts
            ? 'white'
            : 'var(--text-primary)',
        }}
        onClick={onToggle}
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.95 }}
        title={accessibleFonts ? 'Disable accessible fonts' : 'Enable accessible fonts'}
      >
        <span className="text-xs sm:text-sm">
          {accessibleFonts ? '✓ ' : ''}Accessible Fonts
        </span>
      </motion.button>

      {/* Mobile - above bottom navigation, left corner */}
      <motion.button
        className="fixed bottom-20 left-2 z-50 px-2.5 py-1.5 text-[10px] sm:px-3 sm:text-xs rounded-full backdrop-blur-sm lg:hidden"
        style={{
          background: accessibleFonts
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.3)',
          color: accessibleFonts
            ? 'white'
            : 'var(--text-primary)',
        }}
        onClick={onToggle}
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.95 }}
        title={accessibleFonts ? 'Disable accessible fonts' : 'Enable accessible fonts'}
      >
        <span>
          {accessibleFonts ? '✓ ' : ''}Accessible Fonts
        </span>
      </motion.button>
    </>
  );
};
