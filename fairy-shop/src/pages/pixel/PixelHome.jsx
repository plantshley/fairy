// Pixel-theme Home page. Decorative personal-site hub (about / pet / guestbook /
// web-friends) plus action buttons that route via the pixel nav and a theme
// picker wired to real theme switching.
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  NavBar, Divider, PxWindow, PxButton, Blinkie, MusicPlayer, ThemeChip, PegasusSprite,
} from '../../components/pixel/PixelKit';
import { pixelPageTransition, pixelItem, pixelTitle } from '../../components/pixel/pageTransition';
import { px } from '../../components/pixel/asset';
import { themes } from '../../themes';
import { trackEvent } from '../../utils/analytics';

const ACCENT = 'var(--d-plum)';

// ---------------------------------------------------------------
//  Guestbook — client-side, persisted in localStorage (per browser).
// ---------------------------------------------------------------
const GUESTBOOK_KEY = 'pixelGuestbook';
const SEED_ENTRIES = [
  { name: 'moonjelly', message: 'twinkle is the cutest ♡' },
  { name: 'tulip', message: 'wish i lived in your world!' },
  { name: 'strawbz', message: 'i pet twinkle 3x today teehee ~' },
];

function Guestbook() {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GUESTBOOK_KEY) || 'null');
      return Array.isArray(saved) ? saved : SEED_ENTRIES;
    } catch {
      return SEED_ENTRIES;
    }
  });
  const [signing, setSigning] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const persist = (next) => {
    setEntries(next);
    try {
      localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim().slice(0, 24);
    const m = message.trim().slice(0, 120);
    if (!n || !m) return;
    persist([{ name: n, message: m }, ...entries].slice(0, 30));
    setName('');
    setMessage('');
    setSigning(false);
    trackEvent('guestbook_signed', { source: 'pixel_home' });
  };

  const inputStyle = {
    background: '#fff',
    color: ACCENT,
    border: 'none',
    boxShadow: `inset 0 0 0 2px ${ACCENT}`,
    padding: '6px 8px',
    fontSize: 11,
    width: '100%',
  };

  return (
    <>
      <div className="font-mono" style={{ fontSize: 10, color: ACCENT, lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}>
        {entries.map((entry, i) => (
          <div key={i} style={{ marginBottom: 6, opacity: i === 0 ? 1 : 0.85 }}>
            <b style={{ color: 'var(--d-pink-3)' }}>{entry.name}:</b> {entry.message}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        {signing ? (
          <form onSubmit={submit} className="flex flex-col gap-1.5">
            <input
              className="font-pixel"
              style={inputStyle}
              placeholder="name"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              aria-label="Your name"
            />
            <input
              className="font-pixel"
              style={inputStyle}
              placeholder="message ♡"
              value={message}
              maxLength={120}
              onChange={(e) => setMessage(e.target.value)}
              aria-label="Your message"
            />
            <div className="flex gap-1.5">
              <PxButton type="submit" bg="var(--d-pink-2)" border={ACCENT} fg="#fff">sign</PxButton>
              <PxButton type="button" bg="#fff" border={ACCENT} fg={ACCENT} onClick={() => setSigning(false)}>cancel</PxButton>
            </div>
          </form>
        ) : (
          <PxButton bg="var(--d-pink-2)" border={ACCENT} fg="#fff" onClick={() => setSigning(true)}>+ sign</PxButton>
        )}
      </div>
    </>
  );
}

// Stardust the Y2K pegasus — interactive pet widget.
function StardustPet() {
  const [level, setLevel] = useState(0.6);
  const [mood, setMood] = useState('sleepy');
  const moods = { sleepy: '✦ sleepy', happy: '♡ happy', sparkly: '✧ sparkly', hungry: '◌ hungry' };
  const bump = (amount, nextMood) => {
    setLevel((l) => Math.min(1, l + amount));
    setMood(nextMood);
  };

  return (
    <div
      className="pixel-scene relative grid items-center gap-4 p-4 sm:gap-5 sm:p-5 grid-cols-1 justify-items-center sm:justify-items-stretch sm:grid-cols-[auto_1fr]"
      style={{
        background: `url(${px('scenes/scene-oasis.gif')}) center/cover`,
        imageRendering: 'pixelated',
        minHeight: 290,
      }}
    >
      <img src={px('icons/sparkles.gif')} alt="" className="pixel-img pixel-deco pointer-events-none absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.45, mixBlendMode: 'screen' }} />

      <div className="relative grid place-items-center p-2.5">
        <img src={px('icons/twinkle-1.gif')} alt="" className="pixel-img pixel-deco absolute" style={{ top: -8, left: -10, width: 28 }} />
        <img src={px('icons/twinkle-2.gif')} alt="" className="pixel-img pixel-deco absolute" style={{ top: 20, right: -14, width: 24 }} />
        <PegasusSprite scale={7} body="var(--b-cream)" mane="var(--b-hotpink)" />
      </div>

      <div className="relative z-[2] p-3.5" style={{ background: 'rgba(255, 245, 252, 0.94)', boxShadow: `inset 0 0 0 2px ${ACCENT}` }}>
        <div className="font-rainy" style={{ fontSize: 38, color: 'var(--d-pink-3)', lineHeight: 1 }}>✦ twinkle ✦</div>
        <div className="font-pixel" style={{ fontSize: 9, color: ACCENT, opacity: 0.8, marginTop: 4 }}>level 12 pegasus · {moods[mood]}</div>

        <div style={{ marginTop: 12 }}>
          <div className="font-pixel" style={{ fontSize: 8, color: ACCENT, marginBottom: 4, letterSpacing: '0.06em' }}>✧ sparkle meter</div>
          <div style={{ height: 14, background: '#fff', boxShadow: `inset 0 0 0 2px ${ACCENT}`, position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                inset: 2,
                width: `calc(${level * 100}% - 4px)`,
                background: 'linear-gradient(90deg, var(--b-hotpink), var(--b-yellow), var(--b-cyan), var(--b-lilac))',
                backgroundSize: '300% 100%',
                animation: 'holo-shift 3s linear infinite',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        <div className="flex gap-1.5 mt-3">
          <PxButton bg="var(--b-hotpink)" border={ACCENT} fg="#fff" onClick={() => bump(0.08, 'happy')}>★ pet</PxButton>
          <PxButton bg="var(--b-cyan)" border={ACCENT} fg={ACCENT} onClick={() => bump(0.15, 'sparkly')}>♡ feed</PxButton>
          <PxButton bg="var(--b-yellow)" border={ACCENT} fg={ACCENT} onClick={() => bump(0.05, 'sparkly')}>✧ play</PxButton>
        </div>
      </div>
    </div>
  );
}

// Real web-friends — rendered as blinkies that link out. Each gets a staggered
// blink delay (see usage) so they don't all flash in unison.
const WEB_FRIENDS = [
  { label: <>roobz<br />makes stuff</>, url: 'https://roobzmakesstuff.carrd.co/', title: 'roobzmakesstuff', variant: 1 },
  { label: <>wemlis<br />bemlis</>, url: 'https://wemlisbemlis.carrd.co/', title: 'wemlisbemlis', variant: 4 },
  { label: <>phoebe<br />moon art</>, url: 'https://phoebemoonportfolio.webador.com/', title: 'phoebemoonart', variant: 7 },
  { label: <>cinnamon<br />squid</>, url: 'https://ko-fi.com/cinnamonsquidcrochet/shop', title: 'cinnamon squid crochet', variant: 6 },
  { label: <>catnip<br />cuddles</>, url: 'https://www.instagram.com/catnip.cuddles/', title: 'catnip cuddles', variant: 5 },
  { label: <>your<br />link?</>, url: null, title: 'placeholder2', variant: 2 },
];

const ACTIONS = [
  { label: 'build a plushie', sub: 'design your own ♡', bg: 'var(--d-pink-3)', icon: 'wand2.gif', tab: 'build' },
  { label: 'visit the shop', sub: 'plushies & charms', bg: 'var(--d-lilac-2)', icon: 'sparkle-bun.gif', tab: 'shop' },
  { label: 'see the gallery', sub: 'cards, art, doodles', bg: 'var(--b-yellow)', icon: 'frog.gif', tab: 'gallery' },
  { label: 'follow links', sub: 'where else i live', bg: 'var(--b-cyan)', icon: 'shooting-stars.gif', tab: 'links' },
];

// Theme-picker chips, generated from the real theme registry so every theme is
// selectable here (swatches pulled straight from each theme's palette).
const PICKER = Object.values(themes).map((t) => ({
  id: t.id,
  // Short lowercase label derived from the theme name (drop trailing "love" etc.
  // is unnecessary — just lowercase the display name).
  label: t.name.toLowerCase(),
  swatch: [t.colors.bgGradientStart, t.colors.bgGradientMid, t.colors.accentSecondary].filter(Boolean),
}));

export function PixelHome({ currentTheme, activeTab, onTabChange, onThemeChange, onOpenAccessibility }) {
  return (
    <motion.div
      className="bgD relative w-full min-h-dvh overflow-hidden px-4 pt-5 pb-safe sm:px-10 lg:px-20"
      {...pixelPageTransition}
    >
      {/* Ambient sparkle field — tiled at native size (756×443) so it keeps its
          aspect ratio (no stretch/warp) and the GIF animates. */}
      <div
        className="pixel-deco pointer-events-none absolute inset-0"
        style={{ backgroundImage: `url(${px('icons/sparkles.gif')})`, backgroundRepeat: 'repeat', backgroundSize: '420px auto', opacity: 0.35, mixBlendMode: 'screen' }}
      />

      <div className="relative z-[2]">
        <NavBar accent={ACCENT} active={activeTab} onTabChange={onTabChange} onOpenAccessibility={onOpenAccessibility} />

        {/* hero — always a single row (3d star → title → 3d star) */}
        <motion.div className="text-center mt-1 mb-3" {...pixelTitle(0.05)}>
          <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-6">
            <img src={px('icons/3dstar.gif')} alt="" className="pixel-img pixel-deco w-7 sm:w-[70px] flex-shrink-0" style={{ animation: 'float-y 3s ease-in-out infinite' }} />
            <div className="deco-title deco-title--d deco-title--d-rainbow font-rainy min-w-0 whitespace-nowrap" style={{ fontSize: 'clamp(15px, 4.6vw, 80px)' }}>
              kirametki ♡ fairykun
            </div>
            <img src={px('icons/3dstar.gif')} alt="" className="pixel-img pixel-deco w-7 sm:w-[70px] flex-shrink-0" style={{ animation: 'float-y 3s ease-in-out infinite', animationDelay: '1.5s' }} />
          </div>
        </motion.div>

        <motion.div {...pixelItem(0.12)}>
          <Divider src="cutie-stars.gif" height={30} style={{ margin: '4px 0 18px' }} />
        </motion.div>

        {/* 3-col → single col */}
        <div className="grid gap-4 items-start lg:grid-cols-[250px_1fr_220px]">
          {/* LEFT */}
          <motion.div className="flex flex-col gap-3.5" {...pixelItem(0.18)}>
            <PxWindow title="✿ about me" border={ACCENT} bar="var(--d-pink-3)" barFg="var(--d-plum)" bg="rgba(255,255,255,0.9)">
              <div className="font-mono" style={{ fontSize: 11, color: ACCENT, lineHeight: 1.6 }}>
                hi! i'm <b style={{ color: 'var(--d-pink-3)' }}>fairy</b> ｡ﾟ✧
                <br />i make crochet plushies, lift heavy weights, & am the gaurdian of this web realm ઇଓ✧˖*°࿐ੈ ♡˳⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆
                <br /><br />
                <span style={{ opacity: 0.7 }}>currently:</span> <b>making gainz ♡</b>
              </div>
            </PxWindow>

            <PxWindow title="✦ theme picker" border={ACCENT} bar="var(--b-yellow)" barFg="var(--d-plum)" bg="rgba(255,255,255,0.9)">
              <div className="flex flex-col gap-3.5">
                {PICKER.map((t) => (
                  <ThemeChip
                    key={t.id}
                    label={t.label}
                    swatch={t.swatch}
                    accent={ACCENT}
                    active={currentTheme?.id === t.id}
                    onClick={() => themes[t.id] && onThemeChange?.(themes[t.id])}
                  />
                ))}
              </div>
            </PxWindow>
          </motion.div>

          {/* CENTER */}
          <motion.div className="flex flex-col gap-3.5" {...pixelItem(0.24)}>
            <PxWindow title="✿ home.html" border={ACCENT} bar="var(--d-pink-3)" barFg="var(--d-plum)" bg="#fff" bodyStyle={{ padding: 0 }}>
              <StardustPet />
            </PxWindow>

            <Divider src="jumprope.gif" height={30} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACTIONS.map((b) => (
                <button
                  key={b.tab}
                  type="button"
                  onClick={() => onTabChange?.(b.tab)}
                  className="flex items-center gap-2.5 text-left border-none cursor-pointer"
                  style={{ background: b.bg, boxShadow: `inset 0 0 0 3px ${ACCENT}, 4px 4px 0 0 ${ACCENT}`, padding: '8px 12px' }}
                >
                  <div className="grid place-items-center flex-shrink-0" style={{ width: 38, height: 38, background: '#fff', boxShadow: `inset 0 0 0 2px ${ACCENT}` }}>
                    <img src={px(`icons/${b.icon}`)} alt="" className="pixel-img" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-rainy" style={{ fontSize: 26, color: '#fff', lineHeight: 1, textShadow: `1px 1px 0 ${ACCENT}` }}>{b.label}</div>
                    <div className="font-pixel" style={{ fontSize: 10, color: '#fff', marginTop: 3, opacity: 0.95, textShadow: `1px 1px 0 ${ACCENT}` }}>{b.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div className="flex flex-col gap-3" {...pixelItem(0.3)}>
            <PxWindow title="♡ web friends" border={ACCENT} bar="var(--d-lilac-2)" barFg="var(--d-plum)" bg="rgba(255,255,255,0.9)">
              <div className="flex flex-wrap gap-1">
                {WEB_FRIENDS.map((f, i) => {
                  const blinkie = (
                    <Blinkie variant={f.variant} blink delay={`${i * 0.21}s`}>
                      {f.label}
                    </Blinkie>
                  );
                  return f.url ? (
                    <a
                      key={f.title}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={f.title}
                      className="no-underline inline-flex"
                    >
                      {blinkie}
                    </a>
                  ) : (
                    <span key={f.title} className="inline-flex">{blinkie}</span>
                  );
                })}
              </div>
            </PxWindow>

            <MusicPlayer accent="var(--d-pink-3)" border={ACCENT} bar="var(--b-yellow)" barFg="var(--d-plum)" bg="rgba(255,255,255,0.9)" track="lapis tower" artist="aivi & surasshu" />

            <PxWindow title="✿ guestbook" border={ACCENT} bar="var(--b-cyan)" barFg="var(--d-plum)" bg="rgba(255,255,255,0.9)">
              <Guestbook />
            </PxWindow>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
