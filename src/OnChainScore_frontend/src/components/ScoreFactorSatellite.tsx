import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ScoreFactorSatelliteProps {
  factor: {
    name: 'Transaction Consistency' | 'DeFi Footprint' | 'Asset Diversity' | 'Governance Activity';
    score: number;
    weight: number;
    summary: string;
  };
  centerX: number;
  centerY: number;
  angle: number;
  isActive: boolean;
  onSelect: () => void;
}

const ScoreFactorSatellite: React.FC<ScoreFactorSatelliteProps> = ({
  factor,
  centerX,
  centerY,
  angle,
  isActive,
  onSelect
}) => {
  const satelliteRef = useRef<HTMLDivElement>(null);
  const orbitRadius = 120 + (1 - factor.weight) * 80; // Closer orbit = higher weight
  const satelliteSize = 30 + (factor.score / 100) * 20; // Larger = higher score

  useEffect(() => {
    if (!satelliteRef.current) return;

    // Calculate orbital position
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius;

    gsap.set(satelliteRef.current, { x, y });

    // Continuous orbital animation
    const orbitalTl = gsap.timeline({ repeat: -1 });
    orbitalTl.to(satelliteRef.current, {
      rotation: 360,
      duration: 20 + Math.random() * 10, // Varied orbital speeds
      ease: "none",
      transformOrigin: `${-Math.cos(angle) * orbitRadius}px ${-Math.sin(angle) * orbitRadius}px`
    });

    // Gentle floating animation
    gsap.to(satelliteRef.current, {
      y: "+=10",
      duration: 3 + Math.random() * 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Active state animation
    if (isActive) {
      gsap.to(satelliteRef.current, {
        scale: 1.3,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    } else {
      gsap.to(satelliteRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [centerX, centerY, angle, orbitRadius, factor.weight, isActive]);

  const getFactorColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const handleHover = () => {
    if (satelliteRef.current) {
      gsap.to(satelliteRef.current, {
        scale: 1.2,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleLeave = () => {
    if (satelliteRef.current && !isActive) {
      gsap.to(satelliteRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  return (
    <div
      ref={satelliteRef}
      className={`absolute cursor-pointer transition-all duration-300 group`}
      style={{ width: satelliteSize, height: satelliteSize }}
      onClick={onSelect}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {/* Satellite orb */}
      <div
        className={`w-full h-full bg-gradient-to-br ${getFactorColor(factor.score)} rounded-full shadow-lg relative`}
      >
        {/* Inner glow */}
        <div className="absolute inset-1 bg-white/30 rounded-full" />
        
        {/* Hover tooltip */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {factor.name}: {factor.score}
        </div>
      </div>

      {/* Orbital trail effect */}
      <div 
        className="absolute inset-0 rounded-full border border-white/10"
        style={{
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          left: -orbitRadius + satelliteSize / 2,
          top: -orbitRadius + satelliteSize / 2,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default ScoreFactorSatellite;