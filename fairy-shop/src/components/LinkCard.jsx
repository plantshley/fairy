import { motion } from 'framer-motion';
import { useState } from 'react';
import { HoverSparkles } from './HoverSparkles';
import { trackEvent } from '../utils/analytics';

export const LinkCard = ({ link, index, currentTheme, className = '', allowSubtitleWrap = false }) => {
  const [isHovering, setIsHovering] = useState(false);

  const getCardClassName = () => {
    const baseClass = 'relative group';
    if (currentTheme?.id === 'glitterGroovyRainbow') {
      return `${baseClass} rainbow-glow-card`;
    }
    return baseClass;
  };

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
      <HoverSparkles currentTheme={currentTheme} index={index} isHovering={isHovering} idKey={link.url} />

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
