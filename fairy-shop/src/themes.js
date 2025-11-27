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
  },
  glitterGroovyRainbow: {
    id: 'glitterGroovyRainbow',
    name: 'Glitter Groovy Rainbow',
    colors: {
      bgGradientStart: '#ff0080',
      bgGradientMid2: '#ffdd00',
      bgGradientMid: '#00d4ff',
      bgGradientEnd: '#aa66ff',
      accentPrimary: '#ff0080',
      accentSecondary: '#ffdd00',
      textPrimary: '#3500c6ff',
      textSecondary: '#ff00f7ff',
      sparkleColor: '#ffdd00',
      gradientPrimary: '#ff0080',
      gradientSecondary: '#ffdd00',
    },
    fonts: {
      heading: '"Kalnia Glaze", serif',
      body: '"JetBrains Mono", monospace',
    },
    emojis: ['🌈', '✨', '💫', '⭐', '🎉', '🦄'],
    decorations: ['★', '☆', '✦', '✧', '❈', '✪'],
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
  },
};

export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Apply rainbow gradient if specified, otherwise clear it
  if (theme.id === 'glitterGroovyRainbow') {
    // Create a full rainbow gradient with specified colors
    const rainbowGradient = 'linear-gradient(135deg, #ff3399, #ff9933, #ffdd00, #00d4ff, #5599ff, #aa66ff, #ff3399)';
    root.style.setProperty('--rainbow-gradient', rainbowGradient);
  } else {
    // Clear rainbow gradient for non-rainbow themes
    root.style.removeProperty('--rainbow-gradient');
  }

  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVarName}`, value);
  });
};
