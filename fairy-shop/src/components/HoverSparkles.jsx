// Star-particle burst that plays while the parent card is hovered — the effect
// shared by the Links cards and the Shop product cards. Only the non-rainbow
// themes get particles; render this inside a `relative group` container and pass
// the container's hover state as `isHovering`.
import { useEffect, useMemo, useState } from 'react';
import { loadFull } from 'tsparticles';
import Particles, { initParticlesEngine } from '@tsparticles/react';

const PARTICLE_THEMES = [
  'twinkleFairyDream',
  'celestialAngelicClouds',
  'crystalSeasideGarden',
  'midnightVelvetMeadow',
  'sweetCherryLove',
];

// The rainbow theme has no bg/accent gradient to sample, so it uses a fixed
// rainbow spark palette instead of the theme's own colors.
const RAINBOW_SPARKLE_COLORS = ['#ff3399', '#ff9933', '#ffdd00', '#00d4ff', '#5599ff', '#aa66ff'];

export function HoverSparkles({ currentTheme, index, isHovering, idKey }) {
  const [particleState, setParticlesReady] = useState();

  const isRainbow = currentTheme?.id === 'glitterGroovyRainbow';
  const enabled = isRainbow || PARTICLE_THEMES.includes(currentTheme?.id);

  useEffect(() => {
    if (!enabled) return;
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady('loaded');
    });
  }, [enabled, currentTheme?.id, index]);

  const particleOptions = useMemo(() => ({
    key: `star-${idKey}`,
    name: 'Star',
    particles: {
      number: { value: 30, density: { enable: false } },
      color: {
        value: isRainbow
          ? RAINBOW_SPARKLE_COLORS
          : [
              currentTheme?.colors.bgGradientStart,
              currentTheme?.colors.bgGradientMid,
              currentTheme?.colors.bgGradientEnd,
              currentTheme?.colors.accentPrimary,
              currentTheme?.colors.accentSecondary,
            ],
      },
      shape: { type: 'star', options: { star: { sides: 4 } } },
      opacity: { value: 0.9 },
      size: { value: { min: 2, max: 5 } },
      rotate: {
        value: { min: 0, max: 360 },
        enable: true,
        direction: 'clockwise',
        animation: { enable: true, speed: 10, sync: false },
      },
      links: { enable: false },
      reduceDuplicates: true,
      move: { enable: true, center: { x: 50, y: 50 } },
    },
    interactivity: { events: {} },
    smooth: true,
    fpsLimit: 120,
    background: { color: 'transparent', size: 'cover' },
    fullScreen: { enable: false },
    detectRetina: true,
    absorbers: [
      {
        enable: true,
        opacity: 0,
        size: { value: 1, density: 1, limit: { radius: 5, mass: 5 } },
        position: { x: 50, y: 50 },
      },
    ],
    emitters: [
      {
        autoPlay: true,
        fill: true,
        life: { wait: true },
        rate: { quantity: 8, delay: 0.4 },
        position: { x: 50, y: 50 },
      },
    ],
  }), [idKey, currentTheme, isRainbow]);

  const modifiedOptions = useMemo(
    () => ({ ...particleOptions, autoPlay: isHovering }),
    [isHovering, particleOptions]
  );

  if (!enabled || !particleState) return null;

  return (
    <Particles
      id={`particles-${idKey}-${index}`}
      className={`pointer-events-none absolute -bottom-8 -left-8 -right-8 -top-8 z-10 opacity-0 transition-opacity ${
        particleState === 'ready' ? 'group-hover:opacity-100' : ''
      }`}
      particlesLoaded={async () => {
        setParticlesReady('ready');
      }}
      options={modifiedOptions}
    />
  );
}
