import { useState, useEffect } from 'react';

// Font scale bounds (multiplier applied to the 16px root font size)
export const FONT_SCALE_MIN = 0.9;
export const FONT_SCALE_MAX = 1.4;
export const FONT_SCALE_STEP = 0.1;
const FONT_SCALE_DEFAULT = 1;

const clampScale = (value) => {
  if (Number.isNaN(value)) return FONT_SCALE_DEFAULT;
  // Round to one decimal so float drift (e.g. 1.2000000000000002 from a caller or
  // a persisted value) never leaks into state or the disabled/active comparisons.
  const rounded = Math.round(value * 10) / 10;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, rounded));
};

const systemReduceMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

const readBool = (key) => {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

const readReduceMotion = () => {
  try {
    const saved = localStorage.getItem('a11yReduceMotion');
    if (saved !== null) return saved === 'true';
  } catch {
    // ignore storage errors, fall through to system preference
  }
  return systemReduceMotion();
};

const readFontScale = () => {
  try {
    const saved = localStorage.getItem('a11yFontScale');
    if (saved !== null) return clampScale(parseFloat(saved));
  } catch {
    // ignore
  }
  return FONT_SCALE_DEFAULT;
};

const persist = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore storage errors (e.g. private mode)
  }
};

/**
 * Single owner of all accessibility settings: state, persistence, and DOM application.
 * Mirrors the original `accessibleFonts` pattern but covers font scale, readable fonts,
 * high contrast, and reduce motion.
 */
export const useAccessibilitySettings = () => {
  const [fontScale, setFontScaleRaw] = useState(readFontScale);
  // Backward compat: reuse the original `accessibleFonts` key.
  const [readableFonts, setReadableFonts] = useState(() => readBool('accessibleFonts'));
  const [highContrast, setHighContrast] = useState(() => readBool('a11yHighContrast'));
  const [reduceMotion, setReduceMotion] = useState(readReduceMotion);

  useEffect(() => {
    document.body.classList.toggle('accessible-fonts', readableFonts);
    persist('accessibleFonts', readableFonts);
  }, [readableFonts]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    persist('a11yHighContrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.toggle('reduce-motion', reduceMotion);
    persist('a11yReduceMotion', reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * fontScale}px`;
    persist('a11yFontScale', fontScale);
  }, [fontScale]);

  const setFontScale = (value) => setFontScaleRaw(clampScale(value));

  const reset = () => {
    setFontScaleRaw(FONT_SCALE_DEFAULT);
    setReadableFonts(false);
    setHighContrast(false);
    // Default for reduce motion is the OS preference, not a hard "off".
    setReduceMotion(systemReduceMotion());
  };

  return {
    fontScale,
    readableFonts,
    highContrast,
    reduceMotion,
    setFontScale,
    toggleReadableFonts: () => setReadableFonts((v) => !v),
    toggleHighContrast: () => setHighContrast((v) => !v),
    toggleReduceMotion: () => setReduceMotion((v) => !v),
    reset,
  };
};
