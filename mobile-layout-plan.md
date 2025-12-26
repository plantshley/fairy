# Mobile Layout Improvement Plan for Build Your Own Page

## Problem Statement

The current BuildYourOwn page requires excessive vertical scrolling on mobile portrait mode:
- Users must scroll up to select body parts and colors
- Users must scroll down to see the canvas and position objects
- This constant back-and-forth creates poor UX and makes creation tedious

## Proposed Solution: Bottom Sheet with Tabbed Controls

### Visual Structure

```
┌─────────────────────────┐
│                         │
│       CANVAS AREA       │  ← Maximum screen real estate
│     (full viewport)     │
│                         │
├─────────────────────────┤
│  Quick Actions Bar      │  ← Always visible: Export, Undo, Clear
├─────────────────────────┤
│  [Tabs: Body|Parts|     │  ← Draggable bottom sheet
│   Colors|Edit]          │     (3 states: collapsed/half/full)
│  ─────────────────      │  ← Drag handle
│  [Tab Content Here]     │
└─────────────────────────┘
```

### Sheet States

1. **Collapsed (Peek)**: 60px height
   - Shows: Quick actions + active tab indicator
   - User can still interact with canvas freely

2. **Half-Open**: ~40% screen height
   - Shows: Tab content for easy access
   - Canvas still visible above
   - Most common working state

3. **Full-Screen**: ~70% screen height
   - Shows: Complete tab content (for browsing parts)
   - Backdrop darkens canvas slightly
   - Swipe down or tap backdrop to collapse

### Tab Organization

**Body Tab**
- Body type grid (3 columns)
- Body size slider (when body selected)
- Clear, focused on body selection

**Parts Tab**
- Collapsible sections:
  - Facial (eyes/features)
  - Limbs
- Grid layout optimized for mobile touch

**Colors Tab**
- Body color (if body exists)
- Body outline color (if body exists)
- Object/drawing color
- Object outline color (if object selected)
- All color pickers consolidated in one place

**Edit Tab** (only shown when object selected)
- Flip horizontal
- To Front / To Back layer controls
- Contextual to selection

### Quick Actions Bar (Always Visible)

```
┌──────────┬──────────┬──────────┐
│ 💾 Export│ ↩ Undo  │ 🗑️ Clear │
└──────────┴──────────┴──────────┘
```
- Fixed at bottom, above tabs
- Always accessible regardless of sheet state
- Large touch targets (48px minimum)

## Implementation Details

### New State Variables
```javascript
const [bottomSheetState, setBottomSheetState] = useState('collapsed'); // 'collapsed' | 'half' | 'full'
const [activeControlTab, setActiveControlTab] = useState('body'); // 'body' | 'parts' | 'colors' | 'edit'
```

### Responsive Breakpoints
- Mobile Portrait (<768px width): Use bottom sheet
- Landscape (any width) OR Desktop (≥768px): Use current sidebar layout

### Touch Gestures
- Swipe up on sheet: Expand (collapsed → half → full)
- Swipe down on sheet: Collapse (full → half → collapsed)
- Tap drag handle: Toggle between collapsed and half
- Tap backdrop (when full): Collapse to half
- Drag handle for manual positioning

### Smart Auto-Expansion
- Selecting a body → Expand to 'half' + switch to 'body' tab
- Clicking "Add Part" → Expand to 'half' + switch to 'parts' tab
- Selecting an object → Expand to 'half' + switch to 'edit' tab
- Opening color picker → Switch to 'colors' tab (keep current state)

### Animation Specs
- Sheet transitions: 250ms ease-out
- Tab switches: 200ms fade
- Backdrop fade: 200ms
- Use Framer Motion (already in dependencies)

## Alternative Approaches Considered

### ❌ Option A: Floating Action Button (FAB) Menu
- **Pros**: Minimal UI footprint, modern pattern
- **Cons**: Requires multiple taps, poor for frequent interactions, hidden controls

### ❌ Option B: Horizontal Scrolling Toolbar
- **Pros**: All controls visible simultaneously
- **Cons**: Cramped on small screens, horizontal scroll is awkward, poor discoverability

### ❌ Option C: Full-Screen Toggle Mode
- **Pros**: Maximum canvas space when needed
- **Cons**: Loses context, requires mode switching, more mental overhead

### ✅ Recommended: Bottom Sheet with Tabs
- **Best UX**: Familiar mobile pattern (Google Maps, Spotify, etc.)
- **Contextual**: Shows relevant controls based on current action
- **Efficient**: Reduces scrolling by 90%+
- **Flexible**: Works for beginners and power users
- **No Breaking Changes**: Desktop layout unchanged

## Files to Modify

### 1. `BuildYourOwn.jsx`
**Changes**:
- Add bottom sheet state management
- Extract control sections into reusable components
- Add conditional rendering:
  - Desktop: Current sidebar (no changes)
  - Mobile: Bottom sheet with tabs
- Implement drag gesture handlers
- Add smart auto-expansion logic

### 2. `index.css`
**New Styles**:
- `.bottom-sheet` base styles
- `.bottom-sheet-handle` drag indicator
- `.mobile-tabs` tab navigation
- `.quick-actions-bar` fixed bottom bar
- Touch-friendly sizing (48px+ tap targets)

### 3. `BottomSheet.jsx` (new component)
**Purpose**: Reusable bottom sheet component
**Props**:
- `state`: 'collapsed' | 'half' | 'full'
- `onStateChange`: (newState) => void
- `children`: React nodes
- `quickActions`: React nodes for always-visible bar

### 4. `MobileControlTabs.jsx` (new component)
**Purpose**: Tab navigation and content
**Props**:
- `activeTab`: string
- `onTabChange`: (tab) => void
- `selectedBody`, `selectedId`, etc. (existing state)
- Control handlers (handleBodySelect, handleAddObject, etc.)

## Implementation Steps

1. **Phase 1**: Create BottomSheet component
   - Implement drag gestures
   - Add three state transitions
   - Style with Framer Motion animations

2. **Phase 2**: Create MobileControlTabs component
   - Extract existing controls into tabs
   - Implement tab switching
   - Add responsive grid layouts

3. **Phase 3**: Integrate into BuildYourOwn
   - Add responsive conditional rendering
   - Wire up state management
   - Implement smart auto-expansion

4. **Phase 4**: Polish & Testing
   - Test on real mobile devices
   - Fine-tune animation timings
   - Adjust touch target sizes
   - Verify no regression on desktop

## Expected Outcome

- **80-90% reduction** in vertical scrolling on mobile
- **Faster creation workflow** - controls always within reach
- **Better canvas visibility** - more space for creative work
- **Familiar UX pattern** - users already know how to use bottom sheets
- **No desktop impact** - existing layout preserved for larger screens

## Questions for User

1. Should the quick actions bar include any other buttons? (e.g., Free Draw toggle, Pan Mode?)
2. Preferred default sheet state: 'collapsed' or 'half'?
3. Should we add haptic feedback on sheet state changes (if device supports)?
