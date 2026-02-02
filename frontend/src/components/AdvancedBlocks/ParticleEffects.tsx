import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleEffectsProps {
  type: 'confetti' | 'snow' | 'stars' | 'bubbles';
  intensity?: number;
  color?: string;
  children: React.ReactNode;
}

export const ParticleEffects: React.FC<ParticleEffectsProps> = ({
  type,
  intensity = 50,
  color = '#6366f1',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
    }> = [];

    const createParticle = () => {
      const colors = type === 'confetti' 
        ? ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
        : [color];

      return {
        x: Math.random() * canvas.width,
        y: type === 'snow' ? -10 : Math.random() * canvas.height,
        vx: type === 'confetti' ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 0.5,
        vy: type === 'snow' ? Math.random() * 2 + 1 : type === 'stars' ? 0 : Math.random() * 2 + 0.5,
        size: type === 'stars' ? Math.random() * 2 + 1 : Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      };
    };

    // Initialize particles
    for (let i = 0; i < intensity; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reset if out of bounds
        if (particle.y > canvas.height || particle.x < 0 || particle.x > canvas.width) {
          if (type === 'snow' || type === 'confetti') {
            particles[index] = createParticle();
            if (type === 'snow') {
              particles[index].y = -10;
            }
          } else {
            particle.life -= 0.01;
            if (particle.life <= 0) {
              particles[index] = createParticle();
            }
          }
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.life;
        
        if (type === 'stars') {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'confetti') {
          ctx.fillStyle = particle.color;
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        } else if (type === 'snow') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'bubbles') {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [type, intensity, color]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

