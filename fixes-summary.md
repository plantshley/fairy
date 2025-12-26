# Mobile Deployment Issues - Fixed

This document summarizes all the fixes applied to the mobile version of the deployed app.

## ✅ Completed Fixes

### 1. Fixed Accessible Fonts (Comic Sans Display Issue)
**Problem**: The accessible font toggle was showing a cursive "Inclusive Sans" font instead of Comic Sans.

**Solution**: Updated the font fallback chain in [src/index.css](fairy-shop/src/index.css#L236-L243) to prioritize Comic Sans:

```css
.accessible-fonts {
  --font-heading: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif;
  --font-body: 'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', 'Arial', sans-serif;
  --font-decorative: 'Comic Sans MS', 'Arial', sans-serif;
}
```

### 2. Reduced Theme Selector Modal Font Size
**Problem**: Font sizes in the theme selector modal were too large on mobile devices.

**Solution**: Made all text responsive in [src/components/ThemeSelector.jsx](fairy-shop/src/components/ThemeSelector.jsx#L127-L160):
- Modal heading: `text-2xl sm:text-3xl lg:text-4xl`
- Theme names: `text-base sm:text-lg lg:text-xl`
- Subtitle and emojis scaled responsively

### 3. Integrated Pickr Color Picker
**Problem**: User didn't like the custom RGB slider modal - wanted native browser color picker functionality with better mobile UX.

**Solution**:
- Installed `@simonwep/pickr` package
- Created a new [ColorPicker component](fairy-shop/src/components/ColorPicker.jsx) that:
  - Uses **nano** theme on mobile (<768px) for compact, touch-friendly interface
  - Uses **classic** theme on desktop/landscape for full-featured picker
  - Includes color swatches for quick selection
  - Auto-hides hex/rgba inputs on mobile for simplicity
  - Shows save button on mobile (nano theme)
  - Uses `hide` event instead of `change` to prevent picker from closing during interaction
  - Silent color updates (`setColor(color, true)`) prevent infinite re-render loops
  - Pickr instance persists across re-renders for stable behavior
- Replaced all native `<input type="color">` elements in BuildYourOwn.jsx with the new ColorPicker component
- Added CSS overrides in [src/index.css](fairy-shop/src/index.css#L303-L322) to change cursor from grab to pointer

### 4. Reduced Trash Can Detection Radius
**Problem**: The trash detection zone was too large, making it easy to accidentally delete objects.

**Solution**: Reduced detection radius in [src/pages/BuildYourOwn.jsx:494](fairy-shop/src/pages/BuildYourOwn.jsx#L494):
- **Before**: 60-200px radius
- **After**: 40-120px radius
- 33% reduction in base radius, 40% reduction in max radius

### 5. Fixed Export Cropping Issue
**Problem**: The image export was cropping parts of the creature.

**Solution**: Updated export function in [src/pages/BuildYourOwn.jsx:1157-1199](fairy-shop/src/pages/BuildYourOwn.jsx#L1157-L1199) to:
- Calculate bounding box of ALL content (body + objects + free draw)
- Add 10% padding around content
- Export only the calculated region instead of entire viewport
- Ensures full creature is always captured

### 6. Fixed Scroll-Induced Canvas Shift
**Problem**: When scrolling up/down outside the canvas, all objects on the canvas would shift position.

**Solution**: Added touch event prevention in [src/pages/BuildYourOwn.jsx:1140-1157](fairy-shop/src/pages/BuildYourOwn.jsx#L1140-L1157):
```javascript
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const preventScroll = (e) => {
    e.preventDefault();
  };

  container.addEventListener('touchstart', preventScroll, { passive: false });
  container.addEventListener('touchmove', preventScroll, { passive: false });

  return () => {
    container.removeEventListener('touchstart', preventScroll);
    container.removeEventListener('touchmove', preventScroll);
  };
}, []);
```

### 7. Fixed Scroll During Free Draw Mode
**Problem**: When drawing with touch, the page would scroll, interrupting the drawing.

**Solution**: Same fix as #6 - preventing touch scroll on the canvas container prevents both issues.

### 8. Implemented Drag Threshold
**Problem**: Objects would drag when user was trying to scroll (minor dragging).

**Solution**: Added 10-pixel drag threshold in [src/pages/BuildYourOwn.jsx:517-567](fairy-shop/src/pages/BuildYourOwn.jsx#L517-L567):
- Tracks initial touch position
- Only enables dragging after 10px of movement
- Prevents accidental drags during scrolling attempts

### 9. Fixed Palette Icon Not Showing
**Problem**: The palette icon on empty canvas was not displaying - only alt text visible.

**Solution**: Fixed image src path in [src/pages/BuildYourOwn.jsx:2251](fairy-shop/src/pages/BuildYourOwn.jsx#L2251):
- **Before**: `src="/visualis.png"` (hardcoded)
- **After**: `src={getAssetPath('/visualis.png')}` (uses base path for GitHub Pages)

## 📋 Mobile Layout Improvement Plan

A comprehensive plan for improving the mobile UX has been created in [mobile-layout-plan.md](mobile-layout-plan.md).

### Key Proposal: Bottom Sheet with Tabbed Controls

**Problem**: Current mobile layout requires excessive vertical scrolling between canvas and controls.

**Solution**: Bottom sheet design pattern with:
- **3 States**: Collapsed (peek), Half-open (~40% height), Full-screen (~70%)
- **4 Tabs**: Body, Parts, Colors, Edit
- **Always-visible quick actions**: Export, Undo, Clear
- **Smart auto-expansion**: Opens relevant tab when actions are performed
- **Touch gestures**: Swipe up/down to expand/collapse

**Benefits**:
- 80-90% reduction in scrolling
- Familiar mobile UX pattern (like Google Maps)
- More canvas space
- Contextual controls
- No impact on desktop layout

### Questions for Review:
1. Should quick actions bar include Free Draw toggle or Pan Mode button?
2. Preferred default sheet state: 'collapsed' or 'half-open'?
3. Add haptic feedback on sheet state changes?

### 10. Fixed Vite Development Server White Screen
**Problem**: The app showed a white screen in development mode with module loading errors.

**Solution**: Updated [vite.config.js:7](fairy-shop/vite.config.js#L7) to conditionally use base path:
- **Before**: `base: '/fairy/'` (always)
- **After**: `base: process.env.NODE_ENV === 'production' ? '/fairy/' : '/'`
- Development mode now correctly loads modules from root path
- Production builds still use `/fairy/` for GitHub Pages deployment

## Files Modified

1. `fairy-shop/src/index.css` - Accessible fonts fix + Pickr cursor overrides
2. `fairy-shop/src/components/ThemeSelector.jsx` - Responsive font sizes
3. `fairy-shop/src/components/ColorPicker.jsx` - **NEW** Pickr wrapper component
4. `fairy-shop/src/pages/BuildYourOwn.jsx` - Multiple fixes:
   - Color picker integration
   - Trash radius reduction
   - Export cropping fix
   - Drag threshold implementation
   - Touch scroll prevention
   - Palette icon fix
5. `fairy-shop/package.json` - Added `@simonwep/pickr` dependency
6. `fairy-shop/vite.config.js` - **NEW** Fixed base path configuration for development

## Testing Recommendations

1. **Color Picker**: Test on both mobile and desktop
   - Mobile should show compact nano theme
   - Desktop should show classic theme with all features

2. **Touch Scrolling**: Verify on mobile
   - Can scroll page outside canvas normally
   - Cannot scroll when touching canvas
   - Free draw works without triggering scroll

3. **Drag Threshold**: Test object dragging
   - Small touches don't move objects
   - Intentional drags work smoothly

4. **Export**: Create complex creatures and verify
   - All parts are captured
   - No cropping occurs
   - Adequate padding around creature

5. **Trash**: Test deletion behavior
   - Less accidental deletions
   - Still easy to delete when intentional

## Deployment

To deploy these changes:

```bash
cd fairy-shop
npm install  # Install Pickr dependency
npm run build
npm run deploy
```

Note: The Pickr color picker CSS is imported in the ColorPicker component, so no additional CSS setup is needed.
