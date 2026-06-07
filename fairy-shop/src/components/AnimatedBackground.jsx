import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Sparkle = ({ delay = 0, x, y, reduceMotion = false }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: 'var(--sparkle-color)',
        boxShadow: '0 0 10px var(--sparkle-color)',
      }}
      animate={reduceMotion ? undefined : {
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={reduceMotion ? undefined : {
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
};

const Cloud = ({ delay = 0, x, y, emoji, reduceMotion = false }) => {
  return (
    <motion.div
      className="absolute text-2xl opacity-30"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={reduceMotion ? undefined : {
        y: [0, -20, 0],
      }}
      transition={reduceMotion ? undefined : {
        duration: 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
};

const Heart = ({ delay = 0, x, y, emoji, reduceMotion = false }) => {
  return (
    <motion.div
      className="absolute text-2xl"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: 0.4,
      }}
      animate={reduceMotion ? undefined : {
        y: [0, -20, 0],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={reduceMotion ? undefined : {
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
};

export const AnimatedBackground = ({ themeEmojis = ['💖', '🌸', '✨', '☁️', '🦋', '💗'], reduceMotion = false }) => {
  const [sparkles, setSparkles] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate random positions for sparkles
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);

    // Generate clouds
    const newClouds = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80,
      delay: Math.random() * 3,
      emoji: themeEmojis[i % themeEmojis.length],
    }));
    setClouds(newClouds);

    // Generate hearts
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      emoji: themeEmojis[(i + 3) % themeEmojis.length],
    }));
    setHearts(newHearts);
  }, [themeEmojis]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden animated-gradient-bg">
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} delay={sparkle.delay} reduceMotion={reduceMotion} />
      ))}
      {clouds.map((cloud) => (
        <Cloud key={cloud.id} x={cloud.x} y={cloud.y} delay={cloud.delay} emoji={cloud.emoji} reduceMotion={reduceMotion} />
      ))}
      {hearts.map((heart) => (
        <Heart key={heart.id} x={heart.x} y={heart.y} delay={heart.delay} emoji={heart.emoji} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
};
