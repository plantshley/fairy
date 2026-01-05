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

### Tab Organization (5 Tabs Total)

**Body Type Tab**
- Body selection grid (3x3, 9 body types)
- Body size slider (when body selected)
- Focused solely on body selection

**Face Tab**
- Facial features only (54 items from parts.facial)
- 5-column grid layout
- Focused on face/eye selection

**Body Parts Tab** (collapsible sections)
- **Limbs** (collapsible): 14 items
- **Accessories** (collapsible): 40+ items
- **Ears/Wings/Tails** (collapsible): 30+ items
- Each section can expand/collapse independently
- Scrollable container

**Colors Tab** (always visible)
- Body color (grayed out if no body)
- Body outline color (grayed out if no body)
- Object color (grayed out if no object selected)
- Drawing color (always active)
- All color pickers consolidated in one place

**Edit Tab** (shown when object selected, but doesn't auto-switch)
- Flip horizontal
- Duplicate
- To Front / To Back layer controls
- Delete
- Contextual to selection

### Quick Actions Bar (Always Visible)

```
┌──────────┬──────────┬──────────┬──────────┐
│ 💾 Export│ 💾 Save │ ↩ Undo  │ 🗑️ Clear │
└──────────┴──────────┴──────────┴──────────┘
```
- Fixed at bottom, above tabs
- Always accessible regardless of sheet state
- Large touch targets (48px minimum)
- Canvas buttons (Draw, Pan, Zoom, Reset, Trash) remain on canvas as-is

## Implementation Details

### New State Variables
```javascript
const [bottomSheetState, setBottomSheetState] = useState('half'); // 'collapsed' | 'half' | 'full'
const [activeControlTab, setActiveControlTab] = useState('bodyType'); // 'bodyType' | 'face' | 'bodyParts' | 'colors' | 'edit'
const [isMobileLayout, setIsMobileLayout] = useState(false); // Portrait < 768px
const [bodyPartsCollapsed, setBodyPartsCollapsed] = useState({
  limbs: false,
  accessories: false,
  earsWingsTails: false
}); // Collapsible sections state
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
- Default state: **half** (50% screen height) on Body Type tab
- Selecting an object → Show Edit tab (but don't auto-switch)
- No other auto-expansion behaviors

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

## Implementation Strategy

### Versioning Approach
Create **BuildYourOwnV2.jsx** as a separate file with a new route `/build-v2`, preserving the original `/build` route for fallback.

**Benefits:**
- Original version completely untouched
- Easy A/B testing
- Simple rollback if needed
- Can swap files later if V2 is preferred

### Files to Create

**1. `BuildYourOwnV2.jsx`** - New mobile-optimized version
- Copy of BuildYourOwn.jsx with bottom sheet integration
- Conditional rendering: desktop sidebar OR mobile bottom sheet
- New state management for sheet and tabs

**2. `components/mobile/MobileBottomSheet.jsx`**
- Manages sheet states (collapsed/half/full)
- Drag gestures with Framer Motion
- Backdrop overlay

**3. `components/mobile/MobileTabNavigation.jsx`**
- 5 tab buttons (Body Type, Face, Body Parts, Colors, Edit)
- Active state highlighting
- Edit tab conditional visibility

**4. `components/mobile/MobileQuickActions.jsx`**
- Fixed bar with Export, Save, Undo, Clear buttons
- Always visible above bottom sheet

**5. `components/mobile/BodyTypeTabContent.jsx`**
- Body type selection grid (3x3, 9 body types)
- Body size slider (when body selected)
- 5-column layout

**6. `components/mobile/FaceTabContent.jsx`**
- Facial features grid (54 items)
- 5-column layout

**7. `components/mobile/BodyPartsTabContent.jsx`**
- 3 collapsible sections: Limbs, Accessories, Ears/Wings/Tails
- Each section can expand/collapse independently
- 5-column grid within each section
- Scrollable container

**8. `components/mobile/ColorsTabContent.jsx`**
- 4 color pickers stacked vertically
- Conditional graying when no selection

**9. `components/mobile/EditTabContent.jsx`**
- Flip, Duplicate, To Front, To Back, Delete buttons
- Large touch targets

### Files to Modify

**1. `App.jsx`**
- Add new route: `/build-v2` → `<BuildYourOwnV2 />`
- Keep original: `/build` → `<BuildYourOwn />`

**2. `Navigation.jsx` (optional)**
- Add temporary testing link to `/build-v2`
- Can be removed after validation

## Implementation Steps

**Phase 1: File Setup & Routing**
1. Copy `BuildYourOwn.jsx` to `BuildYourOwnV2.jsx`
2. Update `App.jsx` to add `/build-v2` route
3. Create `components/mobile/` directory
4. Test both routes work (original unchanged)

**Phase 2: Bottom Sheet Foundation**
5. Create `MobileBottomSheet.jsx` with three states
6. Add drag handle UI and backdrop
7. Implement drag gestures with Framer Motion
8. Test sheet rendering, dragging, state transitions

**Phase 3: Quick Actions Bar**
9. Create `MobileQuickActions.jsx` with 4 buttons
10. Integrate into BuildYourOwnV2.jsx (mobile only)
11. Wire up handlers (export, save, undo, clear)
12. Test all quick actions work

**Phase 4: Tab Navigation**
13. Create `MobileTabNavigation.jsx` with 5 tabs
14. Add active state highlighting
15. Implement Edit tab conditional visibility
16. Wire up tab state changes
17. Test tab switching animations

**Phase 5: Body Type Tab**
18. Create `BodyTypeTabContent.jsx`
19. Extract body type grid (9 body types)
20. Extract body size slider
21. Wire up `handleBodySelect` and size handler
22. Test body selection and sizing

**Phase 6: Face Tab**
23. Create `FaceTabContent.jsx`
24. Extract facial parts (54 items)
25. Implement 5-column grid
26. Wire up `handleAddObject`
27. Test adding facial features

**Phase 7: Body Parts Tab**
28. Create `BodyPartsTabContent.jsx`
29. Create 3 collapsible sections (Limbs, Accessories, Ears/Wings/Tails)
30. Implement collapse/expand state management
31. Wire up `handleAddObject` for all sections
32. Test collapsing, expanding, and adding parts

**Phase 8: Colors Tab**
33. Create `ColorsTabContent.jsx`
34. Stack 4 ColorPicker components
35. Add conditional graying
36. Wire up color handlers
37. Test color changes

**Phase 9: Edit Tab**
38. Create `EditTabContent.jsx`
39. Create 5 large buttons
40. Wire up edit handlers
41. Test all edit operations

**Phase 10: Integration**
42. Add responsive detection to V2
43. Conditionally render desktop vs mobile
44. Adjust canvas padding for mobile
45. Test layout switching

**Phase 11: Polish & Testing**
46. Fine-tune gestures and animations
47. Test on real mobile devices
48. Verify desktop layout unchanged
49. Test fallback route works
50. Test all collapsible sections

## Expected Outcome

- **Two versions available:**
  - `/build` - Original desktop/mobile layout (fallback)
  - `/build-v2` - New mobile bottom sheet layout (testing)
- **80-90% reduction** in mobile scrolling
- **Faster creation workflow** - controls always within reach
- **Better canvas visibility** - more space for creative work
- **Familiar UX pattern** - users already know how to use bottom sheets
- **No desktop impact** - existing layout preserved for larger screens
- **Easy rollback** - Original file untouched

## User Decisions (Finalized)

1. **Tab Organization**: 5 tabs total
   - **Body Type** tab (body selection + size slider)
   - **Face** tab (54 facial features)
   - **Body Parts** tab (collapsible sections: Limbs, Accessories, Ears/Wings/Tails)
   - **Colors** tab (always visible)
   - **Edit** tab (conditional on selection)
2. **Colors Tab**: Always visible (grays out when no selection)
3. **Initial State**: Sheet starts at 'half' showing Body Type tab
4. **Parts Grid**: 5 columns (compact layout)
5. **Collapsible Sections**: Body Parts tab has 3 collapsible sections that can expand/collapse independently
6. **Object Selection**: Show Edit tab but don't auto-switch
7. **Quick Actions**: Export, **Save**, Undo, Clear (4 buttons)
8. **Edit Tab**: Include **Duplicate** button (5 buttons total: Flip, Duplicate, To Front, To Back, Delete)
9. **Versioning**: Create BuildYourOwnV2.jsx as separate file with `/build-v2` route

## Rollback Strategy

If the new layout doesn't work well:
1. Remove `/build-v2` route from App.jsx
2. Delete `components/mobile/` directory
3. Delete `BuildYourOwnV2.jsx`
4. Original `/build` route continues working unchanged

If V2 is preferred and becomes the main version:
1. Rename `BuildYourOwn.jsx` → `BuildYourOwnV1-backup.jsx`
2. Rename `BuildYourOwnV2.jsx` → `BuildYourOwn.jsx`
3. Update route back to `/build`
4. Keep backup file for reference
