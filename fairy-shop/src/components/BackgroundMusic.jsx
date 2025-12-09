import { useEffect, useRef, useState } from 'react';

export const BackgroundMusic = ({ src = '/audio/background-music.mp3' }) => {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('bgMusicMuted');
      // default to muted=true to avoid autoplay issues unless user opted out
      return saved === null ? true : saved === 'true';
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.6;
    }

    audioRef.current.muted = muted;

    if (!muted) {
      const playPromise = audioRef.current.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {
          // If browser blocks autoplay with sound, fall back to muted
          setMuted(true);
        });
      }
    } else {
      // Pause when muted to save resources
      try {
        audioRef.current.pause();
      } catch (e) {
        // ignore
      }
    }

    return () => {
      try {
        audioRef.current.pause();
      } catch (e) {}
    };
  }, [muted, src]);

  const toggle = () => {
    const next = !muted;
    try {
      localStorage.setItem('bgMusicMuted', String(next));
    } catch (e) {}

    // Perform playback changes synchronously to preserve the user gesture
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.6;
    }

    if (!next) {
      // unmuted: unmute and try to play immediately (user gesture)
      audioRef.current.muted = false;
      const p = audioRef.current.play();
      if (p && p.catch) {
        p.catch(() => {
          // If browser blocks play even on click, revert to muted
          setMuted(true);
        });
      }
      setMuted(false);
    } else {
      // muted: mute and pause
      audioRef.current.muted = true;
      try {
        audioRef.current.pause();
      } catch (e) {}
      setMuted(true);
    }
  };

  return (
    <div>
      <button
        aria-pressed={!muted}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
        title={muted ? 'Unmute music' : 'Mute music'}
        onClick={toggle}
        className="fixed z-50 bottom-3 right-3 w-10 h-10 flex items-center justify-center text-2xl opacity-90 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{ background: 'transparent' }}
      >
        <span aria-hidden="true" className="leading-none select-none">{muted ? '🔇' : '🎶'}</span>
      </button>
    </div>
  );
};

export default BackgroundMusic;
