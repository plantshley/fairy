import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { getAssetPath } from '../utils/assetPath';
import { trackEvent } from '../utils/analytics';
import { FONT_SCALE_MIN, FONT_SCALE_MAX, FONT_SCALE_STEP } from '../hooks/useAccessibilitySettings';

// Toggle row used inside the settings panel (declared at module scope so it isn't
// recreated on every render).
const ToggleRow = ({ label, active, onClick, glyph }) => (
  <motion.button
    className="w-full px-3 py-2 rounded-xl font-bonbon text-sm transition-all text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1"
    style={{
      background: active
        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
        : 'transparent',
      color: active ? 'white' : 'var(--text-primary)',
    }}
    onClick={onClick}
    aria-pressed={active}
    whileTap={{ scale: 0.97 }}
  >
    <span
      className="w-5 h-5 flex items-center justify-center text-sm font-bold leading-none"
      style={{ fontFamily: 'serif' }}
    >
      {active ? '✓' : glyph}
    </span>
    <span className="whitespace-nowrap">{label}</span>
  </motion.button>
);

export const AccessibilityMenu = ({
  currentTheme,
  activeTab,
  isOpen,
  onOpenChange,
  fontScale,
  readableFonts,
  highContrast,
  reduceMotion,
  setFontScale,
  toggleReadableFonts,
  toggleHighContrast,
  toggleReduceMotion,
  reset,
}) => {
  const setIsOpen = onOpenChange;
  const isDarkTheme = currentTheme?.id === 'midnightVelvetMeadow';
  const isBuild = activeTab === 'build';
  // The pixel theme's in-page NavBar (and the build hamburger) carry their own
  // ♿ trigger, so the standalone floating buttons are suppressed there.
  const isPixel = currentTheme?.layout === 'pixel';
  const panelRef = useRef(null);

  // While the panel is open: focus it, trap Tab inside it, close on Escape, and
  // restore focus to the trigger button when it closes.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen]);

  // Any non-default setting active -> highlight the button so it reads as "on"
  const anyActive = readableFonts || highContrast || reduceMotion || fontScale !== 1;

  const buttonStyle = {
    background: anyActive
      ? 'var(--accent-secondary)'
      : isDarkTheme
        ? 'rgba(42, 16, 53, 0.6)'
        : 'rgba(255, 255, 255, 0.3)',
  };

  const decreaseFont = () => {
    const next = Math.round((fontScale - FONT_SCALE_STEP) * 10) / 10;
    setFontScale(next);
    trackEvent('a11y_font_scale_changed', { scale: next });
  };

  const increaseFont = () => {
    const next = Math.round((fontScale + FONT_SCALE_STEP) * 10) / 10;
    setFontScale(next);
    trackEvent('a11y_font_scale_changed', { scale: next });
  };

  const handleToggle = (toggle, eventName, currentValue) => () => {
    toggle();
    trackEvent(eventName, { enabled: !currentValue });
  };

  const handleReset = () => {
    reset();
    trackEvent('a11y_reset');
  };

  const fontPct = Math.round(fontScale * 100);
  const dividerColor = isDarkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  return (
    <>
      {/* Desktop - aligns with left navigation (where the fonts pill used to be) */}
      {!isPixel && (
        <motion.button
          className="fixed bottom-6 left-2 z-50 w-12 h-12 rounded-full backdrop-blur-sm hidden lg:flex items-center justify-center focus:outline-none focus:ring-2"
          style={buttonStyle}
          onClick={() => setIsOpen(true)}
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Accessibility settings"
          aria-expanded={isOpen}
        >
          <img src={getAssetPath('/icons/acc-icon.png')} alt="" className="w-7 h-7 object-contain" />
        </motion.button>
      )}

      {/* Mobile & Landscape - above nav. On the build page this floating button is
          hidden; the accessibility option lives inside the hamburger menu instead. */}
      {!isBuild && !isPixel && (
        <motion.button
          className="fixed z-50 w-10 h-10 rounded-full backdrop-blur-sm lg:hidden flex items-center justify-center focus:outline-none focus:ring-2 bottom-20 left-2 landscape:left-3 landscape:bottom-auto landscape:top-2"
          style={buttonStyle}
          onClick={() => setIsOpen(true)}
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Accessibility settings"
          aria-expanded={isOpen}
        >
          <img src={getAssetPath('/icons/acc-icon.png')} alt="" className="w-6 h-6 object-contain" />
        </motion.button>
      )}

      {/* Settings panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                ref={panelRef}
                tabIndex={-1}
                className="backdrop-blur-md rounded-3xl shadow-2xl p-5 w-full focus:outline-none"
                style={{
                  maxWidth: '22rem',
                  backgroundColor: isDarkTheme ? 'rgba(42, 16, 53, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Accessibility settings"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="font-kalnia text-2xl mb-4 gradient-text text-center">
                  ✧ Accessibility ✧
                </h2>

                {/* Text size */}
                <div className="mb-3">
                  <div
                    className="font-bonbon text-sm mb-1 px-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Text size
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="flex-1 py-2 rounded-xl font-bold focus:outline-none focus:ring-2 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: 'var(--text-primary)' }}
                      onClick={decreaseFont}
                      disabled={fontScale <= FONT_SCALE_MIN}
                      aria-label="Decrease text size"
                      whileTap={{ scale: 0.95 }}
                    >
                      A−
                    </motion.button>
                    <span
                      className="w-14 text-center text-sm font-bonbon"
                      style={{ color: 'var(--text-primary)' }}
                      aria-live="polite"
                    >
                      {fontPct}%
                    </span>
                    <motion.button
                      className="flex-1 py-2 rounded-xl font-bold focus:outline-none focus:ring-2 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: 'var(--text-primary)' }}
                      onClick={increaseFont}
                      disabled={fontScale >= FONT_SCALE_MAX}
                      aria-label="Increase text size"
                      whileTap={{ scale: 0.95 }}
                    >
                      A+
                    </motion.button>
                  </div>
                </div>

                <div className="my-2 h-px" style={{ backgroundColor: dividerColor }} />

                {/* Toggles */}
                <div className="space-y-1">
                  <ToggleRow
                    label="readable font"
                    glyph="Aa"
                    active={readableFonts}
                    onClick={handleToggle(toggleReadableFonts, 'accessible_fonts_toggled', readableFonts)}
                  />
                  <ToggleRow
                    label="high contrast"
                    glyph="◑"
                    active={highContrast}
                    onClick={handleToggle(toggleHighContrast, 'a11y_high_contrast_toggled', highContrast)}
                  />
                  <ToggleRow
                    label="reduce motion"
                    glyph="✦"
                    active={reduceMotion}
                    onClick={handleToggle(toggleReduceMotion, 'a11y_reduce_motion_toggled', reduceMotion)}
                  />
                </div>

                <div className="my-2 h-px" style={{ backgroundColor: dividerColor }} />

                <div className="flex gap-2">
                  <motion.button
                    className="flex-1 py-2 px-4 rounded-full font-medium focus:outline-none focus:ring-2"
                    style={{ background: dividerColor, color: 'var(--text-primary)' }}
                    onClick={handleReset}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2 px-4 rounded-full font-medium focus:outline-none focus:ring-2"
                    style={{ background: 'var(--accent-primary)', color: 'white' }}
                    onClick={() => setIsOpen(false)}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close ⋆˚✿
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
