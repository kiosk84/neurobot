'use client';

import React, { useRef, useEffect } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 50; // Количество частиц

    // Устанавливаем размер canvas по размеру окна
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = []; // Пересоздаем частицы при ресайзе
      createParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5; // Размер частиц
        this.speedX = Math.random() * 1 - 0.5; // Скорость по X
        this.speedY = Math.random() * 1 - 0.5; // Скорость по Y
        // Цвет частиц (белые/светло-серые тона)
        const lightShades = ['#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB'];
        this.color = lightShades[Math.floor(Math.random() * lightShades.length)]; // Используем светлые оттенки
      }

      update() {
        // Движение частиц
        this.x += this.speedX;
        this.y += this.speedY;

        // Возвращение на экран при выходе за границы
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

         // Уменьшение размера со временем (опционально, для эффекта затухания)
         // if (this.size > 0.1) this.size -= 0.005;
      }

      draw() {
        if (ctx && this.size > 0.1) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function createParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Инициализация и запуск анимации
    resizeCanvas();
    animateParticles();

    // Обработчик ресайза окна
    window.addEventListener('resize', resizeCanvas);

    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Пустой массив зависимостей для запуска эффекта один раз

  return (
    <canvas
      ref={canvasRef}
      // Revert to z-0, keep pointer-events-none. Should be behind Header (z-30) but above main bg.
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-30"
    />
  );
};

export default AnimatedBackground;
