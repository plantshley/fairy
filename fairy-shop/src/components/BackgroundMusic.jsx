import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

// Floating mute/unmute toggle. Playback state lives in the shared
// useBackgroundMusic store so the pixel-theme "now playing" widget controls the
// same audio element.
export const BackgroundMusic = () => {
  const { muted, toggle } = useBackgroundMusic();

  return (
    <button
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      title={muted ? 'Unmute music' : 'Mute music'}
      onClick={toggle}
      className="fixed z-50 top-[calc(0.75rem+env(safe-area-inset-top))] right-3 w-7 h-7 flex items-center justify-center text-lg opacity-90 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1"
      style={{ background: 'transparent' }}
    >
      <span aria-hidden="true" className="leading-none select-none">{muted ? '🔇' : '🎶'}</span>
    </button>
  );
};

export default BackgroundMusic;
