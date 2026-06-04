import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { loadFull } from 'tsparticles';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { trackEvent } from '../utils/analytics';

const PARTICLE_THEMES = [
  'twinkleFairyDream',
  'celestialAngelicClouds',
  'crystalSeasideGarden',
  'midnightVelvetMeadow',
  'sweetCherryLove',
];

export const LinkCard = ({ link, index, currentTheme, className = '', allowSubtitleWrap = false }) => {
  const [particleState, setParticlesReady] = useState();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only initialize particles for themes that use them (all non-rainbow themes)
    if (!PARTICLE_THEMES.includes(currentTheme?.id)) return;

    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, [currentTheme?.id, index]);

  const particleOptions = useMemo(() => ({
    key: `star-${link.url}`,
    name: "Star",
    particles: {
      number: {
        value: 30,
        density: { enable: false },
      },
      color: {
        value: [
          currentTheme?.colors.bgGradientStart,
          currentTheme?.colors.bgGradientMid,
          currentTheme?.colors.bgGradientEnd,
          currentTheme?.colors.accentPrimary,
          currentTheme?.colors.accentSecondary,
        ],
      },
      shape: {
        type: "star",
        options: { star: { sides: 4 } },
      },
      opacity: { value: 0.9 },
      size: { value: { min: 2, max: 5 } },
      rotate: {
        value: { min: 0, max: 360 },
        enable: true,
        direction: "clockwise",
        animation: { enable: true, speed: 10, sync: false },
      },
      links: { enable: false },
      reduceDuplicates: true,
      move: {
        enable: true,
        center: { x: 50, y: 50 },
      },
    },
    interactivity: { events: {} },
    smooth: true,
    fpsLimit: 120,
    background: { color: "transparent", size: "cover" },
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
  }), [link.url, currentTheme]);

  const modifiedOptions = useMemo(() => {
    return { ...particleOptions, autoPlay: isHovering };
  }, [isHovering, particleOptions]);

  const getCardClassName = () => {
    const baseClass = 'relative group';
    if (currentTheme?.id === 'glitterGroovyRainbow') {
      return `${baseClass} rainbow-glow-card`;
    }
    return baseClass;
  };

  const shouldShowParticles = PARTICLE_THEMES.includes(currentTheme?.id);

  return (
    <motion.a
      key={link.url}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent(link.trackEvent || 'social_link_clicked', {
          link_label: link.label,
          link_url: link.url,
          link_platform: link.label.toLowerCase().replace(/ /g, '_'),
        });
      }}
      className={`${getCardClassName()} ${className} transition-transform duration-200 ease-out will-change-transform hover:scale-105 active:scale-[0.98]`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {shouldShowParticles && !!particleState && (
        <Particles
          id={`particles-${index}`}
          className={`pointer-events-none absolute -bottom-8 -left-8 -right-8 -top-8 z-10 opacity-0 transition-opacity ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}

      <motion.div
        className={`link-card relative p-3 ${allowSubtitleWrap ? 'min-h-[6rem]' : 'h-24'} w-full${currentTheme?.id === 'midnightVelvetMeadow' ? ' midnight-theme' : ''}`}
        style={{
          borderRadius: '2rem',
          backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          boxShadow: `0 0 16px ${currentTheme?.colors.accentPrimary}40, 0 0 32px ${currentTheme?.colors.accentSecondary}20`,
        }}
      >
        <div className="link-card-shine-wrapper">
          <div className="link-card-shine" />
        </div>

        <div className="flex items-center gap-4 h-full">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${link.color}20` }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {link.emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold gradient-text font-bonbon tracking-wider">
              {link.label}
              {link.labelSuffix && (
                <div className="text-xs font-normal tracking-wider opacity-80">
                  {link.labelSuffix}
                </div>
              )}
            </h3>
            <p className={`text-sm ${allowSubtitleWrap ? '' : 'truncate'}`} style={{ color: 'var(--text-secondary)' }}>
              {link.subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
};
