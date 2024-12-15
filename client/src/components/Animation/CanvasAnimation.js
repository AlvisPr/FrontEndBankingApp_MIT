import React, { useEffect, useRef } from 'react';

const CanvasAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, size) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * size + 1;
                // Reduce speed by a factor of 5
                this.speedX = (Math.random() * 0.5 - 0.25) * 0.2;
                this.speedY = (Math.random() * 0.5 - 0.25) * 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Slow down the shrinking and fading even more
                if (this.size > 0.1) this.size -= 0.002;
                if (this.opacity > 0.01) this.opacity -= 0.0005;
            }

            draw() {
                ctx.fillStyle = `rgba(200, 200, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = [];
        const particleCount = 100;

        const createParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, 3));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                if (particle.size <= 0.1 || particle.opacity <= 0.01) {
                    particles.splice(index, 1);
                    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, 3));
                }
            });

            // Draw connecting lines
            ctx.strokeStyle = 'rgba(200, 200, 255, 0.05)';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        createParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default CanvasAnimation;