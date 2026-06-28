// Shared background-music control. A single module-level <audio> is reused by
// every consumer (the floating BackgroundMusic toggle and the pixel-theme
// "now playing" widget) so they stay in sync and only one track ever plays.
import { useSyncExternalStore } from 'react';
import { getAssetPath } from '../utils/assetPath';

const SRC = getAssetPath('/audio/background-music.mp3');

let audio = null;
let muted = (() => {
  try {
    const saved = localStorage.getItem('bgMusicMuted');
    // Default to muted so we never fight the browser's autoplay policy.
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
})();

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => muted;

function ensureAudio() {
  if (!audio) {
    audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.6;
    audio.muted = muted;
  }
  return audio;
}

// Must be called from a user gesture (click) for unmute to satisfy autoplay
// policies. Mutating + persisting state synchronously preserves that gesture.
export function setMuted(next) {
  const a = ensureAudio();
  muted = next;
  try {
    localStorage.setItem('bgMusicMuted', String(next));
  } catch {
    /* ignore */
  }
  a.muted = next;
  if (!next) {
    const p = a.play();
    if (p && p.catch) {
      p.catch(() => {
        // Browser blocked playback even on click — revert to muted.
        muted = true;
        a.muted = true;
        emit();
      });
    }
  } else {
    try {
      a.pause();
    } catch {
      /* ignore */
    }
  }
  emit();
}

export function toggleMuted() {
  setMuted(!muted);
}

export function useBackgroundMusic() {
  const isMuted = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { muted: isMuted, playing: !isMuted, toggle: toggleMuted, setMuted };
}
