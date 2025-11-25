import { useEffect, useMemo, useState } from "react";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: { enable: false },
    },
    color: {
      value: [
        "#7c3aed",
        "#bae6fd",
        "#a78bfa",
        "#93c5fd",
        "#0284c7",
        "#fafafa",
        "#38bdf8",
      ],
    },
    shape: {
      type: "star",
      options: { star: { sides: 4 } },
    },
    opacity: { value: 0.8 },
    size: { value: { min: 1, max: 4 } },
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
      center: { x: 120, y: 45 },
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
      position: { x: 110, y: 45 },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: { wait: true },
      rate: { quantity: 5, delay: 0.5 },
      position: { x: 110, y: 45 },
    },
  ],
};

export default function AiButton({ children, onClick, disabled, noHover }: { children: React.ReactNode, onClick?: () => void, disabled?: boolean, noHover?: boolean }) {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (noHover) return;
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, [noHover]);

  const modifiedOptions = useMemo(() => {
    return { ...options, autoPlay: isHovering };
  }, [isHovering]);

  return (
    <button
      className={`group relative my-2 sm:my-4 md:my-6 lg:my-8 rounded-full bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30 p-1 text-white transition-transform ${noHover ? '' : 'hover:scale-110 active:scale-105'}`}
      onMouseEnter={noHover ? undefined : () => setIsHovering(true)}
      onMouseLeave={noHover ? undefined : () => setIsHovering(false)}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2 text-white h-[30px] xs:h-[36px] sm:h-[40px] md:h-[44px] lg:h-[48px]">
        <Sparkle className="size-4 xs:size-5 sm:size-6 -translate-y-0.5 animate-sparkle fill-white flex-shrink-0" />
        <Sparkle style={{ animationDelay: "1s" }} className="absolute bottom-2.5 left-3.5 z-20 size-2 rotate-12 animate-sparkle fill-white" />
        <Sparkle style={{ animationDelay: "1.5s", animationDuration: "2.5s" }} className="absolute left-5 top-2.5 size-1 -rotate-12 animate-sparkle fill-white" />
        <Sparkle style={{ animationDelay: "0.5s", animationDuration: "2.5s" }} className="absolute left-3 top-3 size-1.5 animate-sparkle fill-white" />
        <span className="font-semibold whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg">{children}</span>
      </div>
      {!noHover && !!particleState && (
        <Particles
          id="ai-btn-particles"
          className={`pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
          particlesLoaded={async () => setParticlesReady("ready")}
          options={modifiedOptions}
        />
      )}
    </button>
  );
}
