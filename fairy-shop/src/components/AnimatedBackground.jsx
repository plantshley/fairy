import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Sparkle = ({ delay = 0, x, y }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: 'var(--sparkle-color)',
        boxShadow: '0 0 10px var(--sparkle-color)',
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
};

const Cloud = ({ delay = 0, x, y, size = 60 }) => {
  return (
    <motion.div
      className="absolute opacity-30"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}px`,
      }}
      animate={{
        x: [0, 20, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      ☁️
    </motion.div>
  );
};

const Heart = ({ delay = 0, x, y }) => {
  return (
    <motion.div
      className="absolute text-2xl"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: 0.4,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      💖
    </motion.div>
  );
};

export const AnimatedBackground = () => {
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
      size: 40 + Math.random() * 40,
      delay: Math.random() * 3,
    }));
    setClouds(newClouds);

    // Generate hearts
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden animated-gradient-bg">
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} delay={sparkle.delay} />
      ))}
      {clouds.map((cloud) => (
        <Cloud key={cloud.id} x={cloud.x} y={cloud.y} size={cloud.size} delay={cloud.delay} />
      ))}
      {hearts.map((heart) => (
        <Heart key={heart.id} x={heart.x} y={heart.y} delay={heart.delay} />
      ))}
    </div>
  );
};
