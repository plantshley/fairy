import { useEffect } from 'react';
import { getAssetPath } from '../utils/assetPath';

// Animated per-theme cursor.
//
// CSS `cursor: url(...)` renders only the first frame of a GIF in every browser
// on Windows, so an animated cursor has to be a real DOM node that tracks the
// pointer while the native cursor is hidden. This component owns that node; the
// `theme-cursor-active` body class it sets is what applies `cursor: none` (see
// src/index.css).
//
// The invariant that matters: the native cursor is hidden ONLY while a visible
// replacement is on screen. The class is therefore not added at mount time — it
// goes on once the image has loaded AND we know where the pointer is, and comes
// straight back off if either stops holding. Every failure path (404, decode
// error, coarse pointer, unmount) leaves the native cursor alone.
//
// When this component does not mount, or before it arms, index.css falls back to
// the static `url()` cursor built from the same --theme-cursor variable, so the
// theme icon still shows — just on frame one.
//
// Independent of CursorSparkles: that draws the trail on its own <canvas> at
// z-index 100. This node sits above it and is purely the cursor itself.
export const ThemeCursor = ({ currentTheme }) => {
  const icon = currentTheme?.cursor;

  useEffect(() => {
    if (!icon) return undefined;

    // Touch and stylus devices have no persistent pointer to replace, and
    // hiding the native cursor there would strip the cursor from a mouse later
    // plugged into the same device. Leave those on the static CSS fallback.
    let fine = true;
    try {
      fine = window.matchMedia('(pointer: fine)').matches;
    } catch {
      fine = true;
    }
    if (!fine) return undefined;

    const MAX_SIZE = 32; // cursor-sized ceiling if a theme ever points at a big icon

    const el = document.createElement('img');
    el.alt = '';
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-theme-cursor', 'true');
    Object.assign(el.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      pointerEvents: 'none',
      zIndex: '2147483000',
      imageRendering: 'pixelated',
      willChange: 'transform, opacity',
      opacity: '0',
    });

    let raf = 0;
    let x = 0;
    let y = 0;
    let hotspot = 10; // half of the icon's rendered size, set on load
    let armed = false; // image loaded and usable
    let hasPos = false; // we have seen the pointer at least once
    let inWindow = true; // pointer is inside the window and the window has focus

    // Single source of truth for "is the native cursor allowed to be hidden".
    // Hiding it requires a replacement we can actually draw, at a known place.
    const sync = () => {
      const canDraw = armed && hasPos;
      document.body.classList.toggle('theme-cursor-active', canDraw);
      el.style.opacity = canDraw && inWindow ? '1' : '0';
    };

    const paint = () => {
      raf = 0;
      el.style.transform = `translate(${x - hotspot}px, ${y - hotspot}px)`;
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!hasPos || !inWindow) {
        hasPos = true;
        inWindow = true;
        // Place the node before revealing it so it never flashes at a stale
        // position left over from before the pointer went away.
        paint();
        sync();
      }
      // Coalesce to one paint per frame; a burst of mousemove events in a single
      // frame would otherwise write transform several times for one repaint.
      if (!raf) raf = requestAnimationFrame(paint);
    };

    // `mouseout` with a null relatedTarget is the reliable "pointer left the
    // window" signal; document-level mouseleave misfires at chrome boundaries in
    // some engines. blur covers alt-tab and native dialogs stealing the pointer.
    const onOut = (e) => {
      if (e.relatedTarget || e.toElement) return;
      inWindow = false;
      sync();
    };
    const onBlur = () => {
      inWindow = false;
      sync();
    };
    // Restoring is unconditional. Gating these on the current visibility was the
    // bug that could leave the page with no cursor at all after an alt-tab.
    const onIn = () => {
      inWindow = true;
      sync();
    };

    // Only arm once the bytes are actually decodable. A 404 or decode failure
    // must not hide the native cursor behind a broken image.
    el.addEventListener('load', () => {
      armed = true;
      const natural = Math.max(el.naturalWidth || 20, 1);
      const size = Math.min(natural, MAX_SIZE);
      el.style.width = `${size}px`;
      el.style.height = 'auto';
      hotspot = size / 2;
      if (hasPos) paint();
      sync();
    });
    el.addEventListener('error', () => {
      armed = false;
      sync(); // drops the class, so the static CSS cursor takes back over
    });

    el.src = getAssetPath(icon);
    document.body.appendChild(el);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseover', onIn);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onIn);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseover', onIn);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onIn);
      document.body.classList.remove('theme-cursor-active');
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [icon]);

  return null;
};
