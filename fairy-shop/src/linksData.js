// Shared link list, consumed by both the standard Links page and the pixel-theme
// PixelLinks page. Keep this the single source of truth for off-site links.
// `pixelIcon` names a GIF in public/pixel/icons/ used by PixelLinks in place of
// the emoji; the standard Links page ignores it and uses `emoji`.
export const links = [
  { url: 'https://www.instagram.com/kirametki/', label: 'Instagram', labelSuffix: '(crochet)', emoji: '🪻', pixelIcon: 'rainbow2-right.gif', color: '#E4405F', subtitle: '@kirametki' },
  { url: 'https://www.instagram.com/fairykun', label: 'Instagram', labelSuffix: '(drawing)', emoji: '🌷', pixelIcon: 'kuromi.gif', color: '#E4405F', subtitle: '@fairykun' },
  { url: 'https://form.jotform.com/232175428265155', label: 'Customs Form', emoji: '💐', pixelIcon: 'bow1.gif', color: '#C5A3FF', subtitle: 'custom crochet requests' },
  { url: 'https://www.venmo.com/u/kirametki', label: 'Venmo', emoji: '💎', pixelIcon: 'heart-sparkle.gif', color: '#3D95CE', subtitle: '@kirametki' },
  { url: 'https://paypal.me/fairykun?country.x=US&locale.x=en_US', label: 'PayPal', emoji: '💝', pixelIcon: 'angel-heart.gif', color: '#0070BA', subtitle: '@fairykun' },
  { url: 'https://packimals.co/fairy', label: 'Packimals.co', emoji: '🦁', pixelIcon: 'my-melo.gif', color: '#FFB6C1', subtitle: 'plushie backpacks' },
  { url: 'http://fairykun.redbubble.com', label: 'Redbubble', emoji: '🫧', pixelIcon: 'rainbow.gif', color: '#E41321', subtitle: 'stickers & merch' },
  { url: 'https://www.inprnt.com/gallery/fairy/', label: 'Art Prints', emoji: '🎨', pixelIcon: 'wand.gif', color: '#FF69B4', subtitle: 'gallery prints' },
  { url: 'https://www.behance.net/gallery/73695003/Ashley-Geraets-Digital-Portfolio-%282015-present%29', label: 'Art Portfolio', emoji: '🎀', pixelIcon: 'tulip.gif', color: '#1769FF', subtitle: '2015 to present' },
];
