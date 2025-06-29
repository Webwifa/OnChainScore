import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ReputationOrbProps {
  score: number;
  size?: number;
  isMainOrb?: boolean;
}

const ReputationOrb: React.FC<ReputationOrbProps> = ({ 
  score, 
  size = 100, 
  isMainOrb = false 
}) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbRef.current) return;

    // Determine orb color based on score
    const getOrbColor = (score: number) => {
      if (score >= 750) return 'from-blue-400 to-purple-500';
      if (score >= 600) return 'from-purple-400 to-pink-500';
      return 'from-orange-400 to-red-500';
    };

    // Pulsing animation based on score (higher scores pulse slower/calmer)
    const pulseSpeed = score >= 750 ? 4 : score >= 600 ? 3 : 2;
    
    gsap.to(orbRef.current, {
      scale: 1.1,
      duration: pulseSpeed,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Main orb gets particle effects
    if (isMainOrb && particlesRef.current) {
      // Create floating particles around the orb
      const particleCount = Math.floor(score / 25);
      const particles: HTMLDivElement[] = [];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `absolute w-1 h-1 bg-gradient-to-r ${getOrbColor(score)} rounded-full opacity-60`;
        particle.style.left = '50%';
        particle.style.top = '50%';
        particlesRef.current.appendChild(particle);
        particles.push(particle);

        // Animate each particle in a spiral
        gsap.set(particle, { rotation: i * (360 / particleCount) });
        gsap.to(particle, {
          rotation: `+=${360}`,
          duration: 10 + Math.random() * 5,
          ease: "none",
          repeat: -1
        });

        gsap.to(particle, {
          x: Math.cos(i * (2 * Math.PI / particleCount)) * (size + 30),
          y: Math.sin(i * (2 * Math.PI / particleCount)) * (size + 30),
          duration: 3 + Math.random() * 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    }

    // Update orb gradient class
    if (orbRef.current) {
      orbRef.current.className = orbRef.current.className.replace(
        /from-\w+-\d+\s+to-\w+-\d+/,
        getOrbColor(score)
      );
    }
  }, [score, size, isMainOrb]);

  return (
    <div className="relative">
      {/* Particle container for main orb */}
      {isMainOrb && <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />}
      
      {/* Main orb */}
      <div
        ref={orbRef}
        className={`relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-2xl cursor-pointer transition-all duration-300`}
        style={{ width: size, height: size }}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 bg-white/20 rounded-full" />
        <div className="absolute inset-4 bg-white/10 rounded-full" />
        
        {/* Score display for main orb */}
        {isMainOrb && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-white/80">SCORE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReputationOrb;