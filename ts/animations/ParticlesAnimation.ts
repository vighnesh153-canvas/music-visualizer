import { Canvas } from "../Canvas";
import { ICanvasAnimation } from "../IAnimation";
import { mapBigArrayToSmallSize } from "../Utility";

class Particle {
    static rightMax: number;
    static bottomMax: number;
    static radius = 1;
    static color = 'red';
    static helper: Canvas;
    static gravity = 0.1;

    velocityX = 0;
    velocityY = 0;

    x: number;
    y: number;

    huntTarget = -1;

    update(frequency: Uint8Array) {
        this.y += this.velocityY;
        this.velocityY += Particle.gravity;

        if (this.huntTarget >= 0) {
            if (this.y < this.huntTarget) {
                this.velocityY = 0;
                this.huntTarget = -1;
            }
        }

        if (this.y >= Particle.bottomMax) {
            this.y = Particle.helper.height - frequency[~~(this.x / 2)] / 2;
            this.y =
                Math.min(Particle.bottomMax - Particle.radius * 2, this.y);
            this.huntTarget = this.y;
            this.y = Particle.bottomMax - Particle.radius;
            this.velocityY = -5;
        }

        if (this.y <= 0) {
            this.y = 5;
            this.velocityY = 0;
        }
    }

    draw() {
        Particle.helper.drawFilledCircle(
            this.x, this.y, Particle.radius, Particle.color
        );
    }

    process(frequency: Uint8Array) {
        this.update(frequency);
        this.draw();
    }
}

export class ParticlesAnimation implements ICanvasAnimation {
    private fftSize = 512;
    private readonly helper: Canvas;
    private backGroundColor = 'black';
    private particles: Particle[];
    private byteFrequencyDataArray = new Uint8Array(~~(this.fftSize / 2));

    constructor() {
        const canvas = document.getElementById('particles-animation-canvas');
        this.helper = new Canvas(canvas as HTMLCanvasElement);

        Particle.rightMax = this.helper.width;
        Particle.bottomMax = this.helper.height;
        Particle.helper = this.helper;

        this.generateParticles();
    }

    private generateParticles() {
        this.particles = [];

        for (let i = 0; i < 1810; i++) {
            const p = new Particle();
            p.x = ~~(i / 6);
            p.y = ~~(Math.random() * Particle.bottomMax);
            if (p.x <= this.helper.width) {
                this.particles.push(p);
            }
        }
    }

    private clearBackground() {
        const { helper, backGroundColor } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, backGroundColor);
    }

    private processParticles() {
        this.particles.forEach(p => p.process(this.byteFrequencyDataArray));
    }

    animate(frequency: Uint8Array, time: Uint8Array) {
        this.clearBackground();
        this.byteFrequencyDataArray = mapBigArrayToSmallSize(frequency, 4);
        this.processParticles();
    }
}
