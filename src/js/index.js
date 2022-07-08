import '../sass/index.scss';
/** @type {HTMLCanvasElement} */

class Sky {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.startX = 0;
        this.startY = 0;
        this.stars = [];
    }

    generateStars(count) {
        let stars = [];

        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 3 + 2;

            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: radius,
                orginalRadius: radius,
                color: 'rgba(255, 255, 255, 1)',
                speed: Math.random() * 0.3,
            });
        }

        this.stars = stars;
    }

    clearCanvas() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }

    updateStar() {
        this.stars.forEach((star) => {
            star.x += star.speed;
            star.y -= (star.speed * (this.width / 2 - star.x)) / 3000;
            star.radius = star.orginalRadius * (Math.random() / 4 + 0.5);

            if (star.x > this.width + 2 * star.radius) {
                star.x = star.radius * -2;
            }
        });
    }

    drawOverlay() {
        let gradient = this.ctx.createRadialGradient(
            this.width / 2,
            this.height / 2,
            250,
            this.width / 2,
            this.height / 2,
            this.width / 2
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.75)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }

    drowStars() {
        this.stars.forEach((star) => {
            this.drawStar(star);
        });
    }

    drawStar(star) {
        this.ctx.save();

        this.ctx.fillStyle = star.color;

        this.ctx.beginPath();
        this.ctx.translate(star.x, star.y);
        this.ctx.moveTo(0, 0 - star.radius);

        for (let i = 0; i < 5; i++) {
            this.ctx.rotate((Math.PI / 180) * 36);
            this.ctx.lineTo(0, 0 - star.radius * 0.6);
            this.ctx.rotate((Math.PI / 180) * 36);
            this.ctx.lineTo(0, 0 - star.radius);
        }

        this.ctx.fill();
        this.ctx.restore();
    }

    draw() {
        this.clearCanvas();
        this.updateStar();
        this.drowStars();
        this.drawOverlay();
        window.requestAnimationFrame(() => this.draw());
    }

    initCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.clearCanvas();
    }

    run() {
        this.initCanvas();
        this.generateStars(700);
        this.draw();
    }
}

const sky = new Sky(document.querySelector('#canvas'));
sky.run();
