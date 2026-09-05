import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getAssetPath } from '../utils/assetPath';

const tabs = [
  { id: 'home', label: 'home', icon: getAssetPath('/house.png') },
  { id: 'shop', label: 'shop', icon: getAssetPath('/rich.png') },
  { id: 'links', label: 'links', icon: getAssetPath('/moon.png') },
  { id: 'gallery', label: 'gallery', icon: getAssetPath('/rainbow.png') },
  { id: 'build', label: 'build', icon: getAssetPath('/visualis.png') },
];

export const MobileNavigationMenu = ({ activeTab, onTabChange, currentTheme, onOpenAccessibility }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDarkTheme = currentTheme?.id === 'midnightVelvetMeadow';

  return (
    <>
      {/* Menu button - only shown on the build page. Sits in the top-right
          corner, mirroring the BackgroundMusic toggle's left-3 inset. The image
          is decorative: the accessible name stays "Open navigation menu" so the
          house art never reads as a home link to assistive tech. */}
      <button
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        title="Navigation"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 top-[calc(0.75rem+env(safe-area-inset-top))] right-3 w-7 h-7 flex items-center justify-center opacity-90 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{ background: 'transparent' }}
      >
        <img
          src={getAssetPath('/house.png')}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain"
        />
      </button>

      {/* Navigation Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="fixed top-[calc(3.5rem+env(safe-area-inset-top))] right-3 z-50 backdrop-blur-md rounded-2xl shadow-2xl p-2"
              style={{
                backgroundColor: isDarkTheme ? 'rgba(42, 16, 53, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              }}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.15 }}
            >
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    className="w-full px-3 py-2 rounded-xl font-bonbon text-sm lg:text-lg transition-all text-left flex items-center gap-2"
                    style={{
                      background: activeTab === tab.id
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                    }}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={tab.icon} alt={tab.label} className="w-5 h-5 lg:w-7 lg:h-7 object-contain" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </motion.button>
                ))}

                {onOpenAccessibility && (
                  <div className="lg:hidden">
                    <div
                      className="my-1 h-px"
                      style={{ backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
                    />
                    <motion.button
                      className="w-full px-3 py-2 rounded-xl font-bonbon text-sm transition-all text-left flex items-center gap-2"
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => {
                        setIsOpen(false);
                        onOpenAccessibility();
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={getAssetPath('/icons/acc-icon.png')}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                      <span className="whitespace-nowrap">accessibility</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
