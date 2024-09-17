import React, { useEffect, useRef } from 'react';

const CanvasAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Square {
            constructor(x, y, size, color) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.velocityX = (Math.random() * 0.5 - 0.25); // Reduced velocity
                this.velocityY = (Math.random() * 0.5 - 0.25); // Reduced velocity
                this.rotation = 0;
                this.rotationSpeed = (Math.random() * 0.02 - 0.01); // Reduced rotation speed
            }

            draw() {
                ctx.save();
                ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }

            update() {
                this.x += this.velocityX;
                this.y += this.velocityY;
                this.rotation += this.rotationSpeed;

                if (this.x + this.size > canvas.width || this.x < 0) {
                    this.velocityX *= -1;
                }

                if (this.y + this.size > canvas.height || this.y < 0) {
                    this.velocityY *= -1;
                }
            }
        }

        const squares = [];
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1'];

        for (let i = 0; i < 20; i++) {
            const size = Math.random() * 30 + 20;
            const x = Math.random() * (canvas.width - size);
            const y = Math.random() * (canvas.height - size);
            const color = colors[Math.floor(Math.random() * colors.length)];
            squares.push(new Square(x, y, size, color));
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            squares.forEach(square => {
                square.update();
                square.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default CanvasAnimation;