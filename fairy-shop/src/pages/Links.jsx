import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { loadFull } from 'tsparticles';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { Sparkle } from '../components/Sparkle';
import { trackEvent } from '../utils/analytics';

const links = [
  { url: 'https://www.instagram.com/kirametki/', label: 'Instagram', labelSuffix: '(crochet)', emoji: '🪻', color: '#E4405F', subtitle: '@kirametki' },
  { url: 'https://www.instagram.com/fairykun', label: 'Instagram', labelSuffix: '(drawing)', emoji: '🌷', color: '#E4405F', subtitle: '@fairykun' },
  { url: 'https://form.jotform.com/232175428265155', label: 'Customs Form', emoji: '💐', color: '#C5A3FF', subtitle: 'custom crochet requests' },
  { url: 'https://www.venmo.com/u/kirametki', label: 'Venmo', emoji: '💎', color: '#3D95CE', subtitle: '@kirametki' },
  { url: 'https://paypal.me/fairykun?country.x=US&locale.x=en_US', label: 'PayPal', emoji: '💝', color: '#0070BA', subtitle: '@fairykun' },
  { url: 'https://packimals.co/fairy', label: 'Packimals.co', emoji: '🦁', color: '#FFB6C1', subtitle: 'plushie backpacks' },
  { url: 'http://fairykun.redbubble.com', label: 'Redbubble', emoji: '🫧', color: '#E41321', subtitle: 'stickers & merch' },
  { url: 'https://www.inprnt.com/gallery/fairy/', label: 'Art Prints', emoji: '🎨', color: '#FF69B4', subtitle: 'gallery prints' },
  { url: 'https://www.behance.net/gallery/73695003/Ashley-Geraets-Digital-Portfolio-%282015-present%29', label: 'Art Portfolio', emoji: '🎀', color: '#1769FF', subtitle: '2015 to present' },
];

const LinkCard = ({ link, index, currentTheme }) => {
  const [particleState, setParticlesReady] = useState();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only initialize particles for themes that use them (all non-rainbow themes)
    const particleThemes = ['twinkleFairyDream', 'celestialAngelicClouds', 'crystalSeasideGarden', 'midnightVelvetMeadow', 'sweetCherryLove'];
    if (!particleThemes.includes(currentTheme?.id)) return;

    console.log('Initializing particles for card', index);
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      console.log('Particles loaded for card', index);
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

  const shouldShowParticles = ['twinkleFairyDream', 'celestialAngelicClouds', 'crystalSeasideGarden', 'midnightVelvetMeadow', 'sweetCherryLove'].includes(currentTheme?.id);

  return (
    <motion.a
      key={link.url}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent('social_link_clicked', {
          link_label: link.label,
          link_url: link.url,
          link_platform: link.label.toLowerCase().replace(/ /g, '_'),
        });
      }}
      className={`${getCardClassName()} transition-transform duration-200 ease-out will-change-transform hover:scale-105 active:scale-[0.98]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {shouldShowParticles && !!particleState && (
        <Particles
          id={`particles-${index}`}
          className={`pointer-events-none absolute -bottom-8 -left-8 -right-8 -top-8 z-10 opacity-0 transition-opacity ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
          particlesLoaded={async () => {
            console.log('Particles ready for card', index);
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}

      <motion.div
        className={`link-card relative p-3 h-24 w-full${currentTheme?.id === 'midnightVelvetMeadow' ? ' midnight-theme' : ''}`}
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
            <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
              {link.subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
};

export const Links = ({ currentTheme }) => {
  const decorations = currentTheme?.decorations || ['～ ♡', '⋆｡°✩', '｡ﾟ･ ✧', '･ﾟ･｡'];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ⋆｡‧˚ʚ♡ɞ˚‧｡⋆ links ⋆｡‧˚ʚ♡ɞ˚‧｡⋆
      </motion.h1>

      <p className="text-center mb-8 text-sm sm:text-base md:text-lg lg:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ʚ♡ɞ connect with me across the web ʚ♡ɞ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
        {links.map((link, index) => (
          <LinkCard key={link.url} link={link} index={index} currentTheme={currentTheme} />
        ))}
      </div>

      <motion.p
        className="mt-12 text-center text-base"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {decorations.join(' ')}
      </motion.p>
    </motion.div>
  );
};
