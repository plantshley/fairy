# Kirametki Crochet Shop 🧶 ✨

A beautiful, interactive website for showcasing crochet creations, artwork, and more!

## Features

### Current Features ✨

- **Twinkle Fairy Dream Theme** - Pastel rainbow gradients with animated sparkles, clouds, and hearts
- **Animated Background** - Smooth gradient animations with floating elements
- **Interactive Navigation** - Vertical sidebar navigation with smooth page transitions
- **Theme Selector** - Click the fairy in the bottom-right corner to switch themes (Glitter Groovy Rainbow coming soon!)
- **Four Main Sections:**
  - **Shop** - Embedded Ko-fi shop for browsing and purchasing crochet creations
  - **Other Links** - Beautiful link collection to Instagram, TikTok, Ko-fi, and Etsy
  - **Gallery** - Coming soon! Will feature crochet works and artwork
  - **Build Your Own** - Coming soon! Interactive drag-and-drop plushie designer

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Styling and theming
- **Google Fonts** - Kalnia Glaze for headers, JetBrains Mono for body text

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the site!

### Build for production
```bash
npm run build
```

## Roadmap

### Phase 2 - Additional Themes
- [ ] Complete Celestial Angelic Clouds theme
- [ ] Complete Crystal Seaside Garden theme
- [ ] Complete Glitter Groovy Rainbow theme

### Phase 3 - Gallery
- [ ] Add crochet plushie images
- [ ] Add artwork images
- [ ] Link gallery items to shop listings
- [ ] Add filtering/categories

### Phase 4 - Build Your Own
- [ ] Create plushie template parts (body, eyes, accessories, etc.)
- [ ] Implement drag-and-drop designer
- [ ] Add color picker for each part
- [ ] Save/share design functionality
- [ ] Integration with custom order form

### Future Enhancements
- [ ] Custom cursor images (choose from crochet/drawings)
- [ ] Cursor follower animation (creature that follows cursor)
- [ ] Hover effects with sparkles
- [ ] More interactive animations
- [ ] Mobile responsive optimizations

## Project Structure

```
fairy-shop/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx  # Animated sparkles, clouds, hearts
│   │   ├── Navigation.jsx          # Sidebar navigation
│   │   └── ThemeSelector.jsx       # Theme switcher modal
│   ├── pages/
│   │   ├── Shop.jsx                # Ko-fi shop embed
│   │   ├── Links.jsx               # Social media links
│   │   ├── Gallery.jsx             # Coming soon placeholder
│   │   └── BuildYourOwn.jsx        # Coming soon placeholder
│   ├── themes.js                   # Theme definitions
│   ├── App.jsx                     # Main app component
│   ├── index.css                   # Global styles & CSS variables
│   └── main.jsx                    # Entry point
├── tailwind.config.js              # Tailwind configuration
└── package.json
```

## Customization

### Adding a New Theme

Edit `src/themes.js` and add your theme object with colors, fonts, emojis, and decorations:

```javascript
export const themes = {
  yourTheme: {
    id: 'yourTheme',
    name: 'Your Theme Name',
    colors: {
      bgGradientStart: '#color1',
      bgGradientMid: '#color2',
      bgGradientEnd: '#color3',
      // ... other colors
    },
    fonts: {
      heading: '"Font Name", serif',
      body: '"Font Name", monospace',
    },
    emojis: ['🌸', '✨'],
    decorations: ['˚ ༘♡'],
  },
};
```

### Updating Links

Edit the `links` array in `src/pages/Links.jsx` to add/modify social media links.

## License

Created with 💖 by Kirametki
