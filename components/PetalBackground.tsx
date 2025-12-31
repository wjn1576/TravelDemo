import React, { useEffect, useRef } from 'react';

export const PetalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Petal[] = [];
    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    class Petal {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      spin: number;
      opacity: number;
      color: string;
      isHeart: boolean;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * w;
        this.y = -20;
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 0.8 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.01;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.isHeart = Math.random() > 0.5;
        const colors = ['#ffd1dc', '#ffb7c5', '#fff0f5', '#ff69b4'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.5;
        this.angle += this.spin;

        if (this.y > h + 20) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.isHeart) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size, -this.size, -this.size * 1.5, this.size / 2, 0, this.size);
          ctx.bezierCurveTo(this.size * 1.5, this.size / 2, this.size, -this.size, 0, 0);
          ctx.fill();
        } else {
          // Petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size/2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push(new Petal());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};