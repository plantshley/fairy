import { useEffect, useRef, useState } from 'react';

export const Sparkle = ({ count = 31 }) => {
  const containerRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);
  const counterRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get container bounds
    const rect = containerRef.current.getBoundingClientRect();
    const x1 = -17;
    const y1 = -17;
    const x2 = rect.width + 17;
    const y2 = rect.height + 17;

    // Initialize sparkles array
    const initialSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      visible: false,
      scale: 1,
    }));
    setSparkles(initialSparkles);

    // Animation function
    const addSparkle = () => {
      const currentCounter = counterRef.current;

      setSparkles(prev => {
        const newSparkles = [...prev];
        const sparkle = newSparkles[currentCounter];

        if (sparkle) {
          // Random position within bounds
          const randomX = Math.floor(Math.random() * (x2 - x1)) + x1;
          const randomY = Math.floor(Math.random() * (y2 - y1)) + y1;

          // Random scale variant
          const scaleVariant = Math.floor(Math.random() * 3);
          let scale = 1;
          if (scaleVariant === 1) scale = 0.7;
          else if (scaleVariant === 2) scale = 0.6;

          newSparkles[currentCounter] = {
            ...sparkle,
            x: randomX,
            y: randomY,
            visible: true,
            scale,
          };
        }

        return newSparkles;
      });

      // Increment counter and loop back
      counterRef.current = currentCounter >= 30 ? 0 : currentCounter + 1;
    };

    // Start animation loop
    intervalRef.current = setInterval(addSparkle, 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-visible">
      {sparkles.map((sparkle) => (
        sparkle.visible && (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              position: 'absolute',
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              transform: `scale(${sparkle.scale})`,
              width: '35px',
              height: '35px',
            }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id={`SVGID_2_${sparkle.id}`} cx="16.8125" cy="17.9375" r="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0" style={{ stopColor: '#FFFFFF' }} />
                  <stop offset="1" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
                </radialGradient>
                <radialGradient id={`SVGID_1_${sparkle.id}`} cx="16.8125" cy="17.9375" r="5.9121" gradientUnits="userSpaceOnUse">
                  <stop offset="0" style={{ stopColor: '#FFFFFF' }} />
                  <stop offset="1" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
                </radialGradient>
                <radialGradient id={`SVGID_3_${sparkle.id}`} cx="16.8125" cy="17.9375" r="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0" style={{ stopColor: '#FFFFFF' }} />
                  <stop offset="1" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
                </radialGradient>
              </defs>
              <g id={`sparkle_${sparkle.id}`}>
                <circle fill={`url(#SVGID_2_${sparkle.id})`} opacity="0.5" cx="16.812" cy="17.938" r="10" />
                <circle fill={`url(#SVGID_1_${sparkle.id})`} cx="16.812" cy="17.938" r="5.912" />
                <path fill={`url(#SVGID_2_${sparkle.id})`} d="M32.487,17.938C14.2,16.495,15.37,15.325,16.812,33.612c1.442-18.287,2.612-17.117-15.675-15.675c18.287,1.443,17.117,2.612,15.675-15.675C15.37,20.55,14.2,19.381,32.487,17.938z" />
                <path fill={`url(#SVGID_3_${sparkle.id})`} d="M21.684,13.85c-4.293,3.975-4.322,4.3-0.783,8.959c-3.975-4.293-4.3-4.321-8.959-0.783c4.293-3.975,4.322-4.3,0.784-8.959C16.699,17.359,17.024,17.388,21.684,13.85z" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 16.8125 17.9375"
                  to="360 16.8125 17.9375"
                  dur="5s"
                  begin="0s"
                  additive="sum"
                  fill="freeze"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="2s"
                  begin="5s"
                  fill="freeze"
                />
              </g>
            </svg>
          </div>
        )
      ))}
    </div>
  );
};
