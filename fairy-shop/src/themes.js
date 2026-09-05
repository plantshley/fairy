import { getAssetPath } from './utils/assetPath';

export const themes = {
  twinkleFairyDream: {
    id: 'twinkleFairyDream',
    name: 'Twinkle Fairy Dream',
    colors: {
      bgGradientStart: '#ffc4e1',
      bgGradientMid: '#d4a5f5',
      bgGradientEnd: '#b5d3ff',
      accentPrimary: '#ff9dda',
      accentSecondary: '#c5a3ff',
      textPrimary: '#8b4f8a',
      textSecondary: '#9d6b9e',
      sparkleColor: '#ffe0f0',
      gradientPrimary: '#d946a6',
      gradientSecondary: '#9333ea',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['🦋', '🌸', '✨', '🌷', '💖', '🪻'],
    decorations: ['˚ ༘♡ ⋆', '✧˖°', '⋆˚✿˖°', '˗ˏˋ ★ ˎˊ˗'],
    cursor: 'pixel/icons/butterfly.gif',
  },
  glitterGroovyRainbow: {
    id: 'glitterGroovyRainbow',
    name: 'Glitter Groovy Rainbow',
    colors: {
      bgGradientStart: '#ff2baaff',
      bgGradientMid2: '#ffdd00',
      bgGradientMid: '#00d4ff',
      bgGradientEnd: '#aa66ff',
      accentPrimary: '#ff00d0ff',
      accentSecondary: '#ffdd00',
      textPrimary: '#3a0091ff',
      textSecondary: '#d800d1ff',
      sparkleColor: '#ffdd00',
      gradientPrimary: '#ff50a8ff',
      gradientSecondary: '#ffdd00',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['🌈', '✨', '💫', '⭐', '🎉', '🦄'],
    decorations: ['★', '☆', '✦', '✧', '❈', '✪'],
    cursor: 'pixel/icons/music.gif',
  },
  celestialAngelicClouds: {
    id: 'celestialAngelicClouds',
    name: 'Celestial Angelic Clouds',
    colors: {
      bgGradientStart: '#fff8f0',
      bgGradientMid: '#ffe8d6',
      bgGradientEnd: '#ffd4b8',
      accentPrimary: '#f4d6cc',
      accentSecondary: '#e8c4a0',
      textPrimary: '#8b7355',
      textSecondary: '#b5a089',
      sparkleColor: '#fff5e6',
      gradientPrimary: '#f4d6cc',
      gradientSecondary: '#e8c4a0',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['☁️', '🤍', '✨', '🕊️', '🌟', '💫'],
    decorations: ['⋆｡°✩', '｡ﾟ☁︎｡ﾟ', '✧･ﾟ', '⋆⁺₊⋆'],
    cursor: 'pixel/icons/moon.gif',
  },
  crystalSeasideGarden: {
    id: 'crystalSeasideGarden',
    name: 'Crystal Seaside Garden',
    colors: {
      bgGradientStart: '#d4f1f4',
      bgGradientMid: '#b8e6f0',
      bgGradientEnd: '#a0d8e8',
      accentPrimary: '#7cc6d9',
      accentSecondary: '#9b8fc9',
      textPrimary: '#4a6c7a',
      textSecondary: '#6b8d9c',
      sparkleColor: '#e0f7ff',
      gradientPrimary: '#7cc6d9',
      gradientSecondary: '#9b8fc9',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['🐚', '💎', '🌊', '🫧', '🪸', '💠'],
    decorations: ['～ ♡', '⋆｡°✩', '｡ﾟ･ ✧', '･ﾟ･｡'],
    cursor: 'pixel/icons/fish.gif',
  },
  midnightVelvetMeadow: {
    id: 'midnightVelvetMeadow',
    name: 'Midnight Velvet Meadow',
    isDark: true,
    colors: {
      bgGradientStart: '#a700a7ff',
      bgGradientMid: '#650087ff',
      bgGradientEnd: '#9a0033ff',
      accentPrimary: '#c500b4ff',
      accentSecondary: '#d30066ff',
      textPrimary: '#e8b4d9',
      textSecondary: '#c298b8',
      sparkleColor: '#d57da0ff',
      gradientPrimary: '#cb0054ff',
      gradientSecondary: '#6d0088ff',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['🔮', '🥀', '🦇', '🌒', '🌙', '🖤'],
    decorations: ['✧˖°', '⋆｡°✩', '･ﾟ✧', '˗ˏˋ ★ ˎˊ˗'],
    cursor: 'pixel/icons/spooky3.gif',
  },
  sweetCherryLove: {
    id: 'sweetCherryLove',
    name: '甘い♡Cherry Love',
    colors: {
      bgGradientStart: '#ffafbe',
      bgGradientMid: '#ff718e',
      bgGradientEnd: '#ff95ca',
      accentPrimary: '#e63956',
      accentSecondary: '#ff82ba',
      textPrimary: '#dd2559',
      textSecondary: '#fc5ba6',
      sparkleColor: '#ffd6e0',
      gradientPrimary: '#e63956',
      gradientSecondary: '#ff82ba',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['🍒', '🍰', '🌹', '💗', '🍓', '🎀'],
    decorations: ['♡₊˚', '⋆˚🪽˖°', '𓊆ྀི‧₊♡˚₊‧𓊇ྀི', '˚₊‧꒰ა ♡ ໒꒱ ‧₊˚'],
    cursor: 'pixel/icons/cake.gif',
  },
  // Alternate-skin theme. Unlike the others, `layout: 'pixel'` swaps the whole
  // page rendering (pixel/Y2K layout) — see App.jsx's layout branch and
  // src/styles/pixel.css. The colors below map the holo palette onto the shared
  // CSS-var names so common chrome (ThemeSelector, AccessibilityMenu) stays
  // coherent; the pixel-specific --d-*/--b-* palette lives in pixel.css.
  pixelPegasusOasis: {
    id: 'pixelPegasusOasis',
    name: 'Pixel Pegasus Oasis',
    layout: 'pixel',
    colors: {
      bgGradientStart: '#f7f088',
      bgGradientMid: '#f87bf2',
      bgGradientEnd: '#a8e0ff',
      accentPrimary: '#ff5aaf',
      accentSecondary: '#71d1d1',
      textPrimary: '#5a1f6b',
      textSecondary: '#8a4dc8',
      sparkleColor: '#ffe85c',
      gradientPrimary: '#ff5aaf',
      gradientSecondary: '#b890e8',
    },
    fonts: {
      heading: '"Rainyhearts", "Pixelify Sans", monospace',
      body: '"Silkscreen", "Pixelify Sans", monospace',
    },
    emojis: ['🦄', '✦', '♡', '✿', '★', '✧'],
    decorations: ['⋆˚｡⋆', '⊹˚. ♡ .˚⊹', '✦°｡⋆', '｡°✩'],
    cursor: 'pixel/icons/kuromi.gif',
  },
};

export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Alternate-skin themes opt in via `layout: 'pixel'`. The body class gates all
  // pixel-specific CSS (palette, fonts, window chrome) in src/styles/pixel.css,
  // keeping the :root variable system below untouched for standard themes.
  document.body.classList.toggle('theme-pixel', theme.layout === 'pixel');

  // Mark dark themes so high-contrast mode can use a dark (near-white on
  // near-black) scheme for them instead of forcing dark-on-light. See the
  // `.high-contrast.theme-dark` block in src/index.css.
  document.body.classList.toggle('theme-dark', !!theme.isDark);

  // Apply rainbow gradient if specified, otherwise clear it
  if (theme.id === 'glitterGroovyRainbow') {
    // Create a full rainbow gradient with specified colors
    const rainbowGradient = 'linear-gradient(135deg, #ff3399, #ff9933, #ffdd00, #00d4ff, #5599ff, #aa66ff, #ff3399)';
    root.style.setProperty('--rainbow-gradient', rainbowGradient);
  } else {
    // Clear rainbow gradient for non-rainbow themes
    root.style.removeProperty('--rainbow-gradient');
  }

  // Per-theme mouse cursor. The URL is resolved through getAssetPath so it picks
  // up the GitHub Pages base path; index.css consumes --theme-cursor on body.
  // Hotspot is centred on the 20x20 icons. This is purely the CSS cursor — the
  // sparkle trail is a separate canvas overlay (CursorSparkles) and is untouched.
  if (theme.cursor) {
    root.style.setProperty('--theme-cursor', `url("${getAssetPath(theme.cursor)}") 10 10, auto`);
  } else {
    root.style.removeProperty('--theme-cursor');
  }

  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVarName}`, value);
  });
};
