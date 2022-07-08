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
        this.lastConstelation = 0;
        this.nextConstelation = Math.random() * 3000 + 1000;
        this.constellation = {
            stars: [],
            isClose: false,
            width: null,
        };
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
                speed: Math.random() * 0.6,
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

    updateConstellation() {
        if (this.constellation.width > 0) {
            this.constellation.width -= 0.04;
        } else this.constellation.width = 0;
    }

    generateRandomConstellation() {
        const x = this.width / 2 + (Math.random() * 500 - 250);
        const y = this.height / 2 + (Math.random() * 300 - 150);

        const radius = (this.height / 2) * Math.random() * 0.5 + 0.5;

        this.constellation = {
            stars: this.stars
                .filter((star) => {
                    return (
                        star.x > x - radius &&
                        star.x < x + radius &&
                        star.y > y - radius &&
                        star.y < y + radius
                    );
                })
                .slice(0, Math.round(Math.random() * 7 + 3)),
            isClose: Math.random() > 0.5,
            width: 4,
        };
    }

    drawConstellation() {
        const { stars, isClose, width } = this.constellation;
        const starsCount = stars.length;

        if (starsCount > 2) {
            const firstStar = stars[0];

            this.ctx.beginPath();
            this.ctx.moveTo(firstStar.x, firstStar.y);
            this.ctx.lineTo(stars[1].x, stars[1].y);

            for (let i = 1; i < starsCount - 1; i++) {
                const nextStar = stars[i + 1];
                this.ctx.lineTo(nextStar.x, nextStar.y);
            }

            if (isClose) {
                this.ctx.lineTo(firstStar.x, firstStar.y);
            }

            this.ctx.strokeStyle = '#f7eada';
            this.ctx.lineWidth = width;
            this.ctx.stroke();
        }
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

    draw(now) {
        this.clearCanvas();

        this.drowStars();
        this.updateStar();

        this.drawConstellation();
        this.updateConstellation();

        this.drawOverlay();

        if (now - this.lastConstelation > this.nextConstelation) {
            this.lastConstelation = now;
            this.nextConstelation = Math.random() * 600 + 3000;
            this.generateRandomConstellation();
        }
        window.requestAnimationFrame((now) => this.draw(now));
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
