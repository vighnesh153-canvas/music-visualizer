import { Canvas } from "../Canvas";
import { ICanvasAnimation } from "../IAnimation";
import { mapBigArrayToSmallSize } from "../Utility";

export class CircularAnimation implements ICanvasAnimation {
    private fftSize = 1024;
    private helper: Canvas;
    private baseCircularRadius = 20;
    private backGroundColor = 'black';
    private byteFrequencyDataArray = new Uint8Array(~~(this.fftSize / 2));
    private rotationAngle = 1;

    constructor() {
        const canvas = document.getElementById('circular-animation-canvas');
        this.helper = new Canvas(canvas as HTMLCanvasElement);
    }

    private clearBackground() {
        const { helper, backGroundColor } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, backGroundColor);
    }

    private drawCircle() {
        const centerX = this.helper.width / 2;
        const centerY = this.helper.height / 2;

        this.helper.drawFilledCircle(
            centerX, centerY, this.baseCircularRadius, 'white');
        this.helper.drawFilledCircle(
            centerX, centerY, this.baseCircularRadius - 5, this.backGroundColor);
    }

    private drawLineAtAngle(sX: number, sY: number, length: number, angle=0, color='white', thickness=1) {
        let eX = length * Math.cos(angle);
        let eY = length * Math.sin(angle);

        eX += sX;
        eY += sY;

        this.helper.drawLine(sX, sY, eX, eY, thickness, color);
    }

    private drawLines() {
        for (let i = 0; i < this.byteFrequencyDataArray.length; i++) {
            const angle = i + this.rotationAngle;
            const length =
                this.byteFrequencyDataArray[i] / 4 + this.baseCircularRadius;
            this.drawLineAtAngle(
                this.helper.width / 2,
                this.helper.height / 2,
                length,
                angle * Math.PI / 180
            );
        }
        this.rotationAngle += 0.1;
        this.rotationAngle %= 360;
    }

    private drawAll() {
        const originalRadius = this.baseCircularRadius;
        this.baseCircularRadius += this.byteFrequencyDataArray[180] / 30;
        this.drawLines();
        this.drawCircle();
        this.baseCircularRadius = originalRadius;
    }

    animate(frequency: Uint8Array, time: Uint8Array) {
        this.clearBackground();
        this.byteFrequencyDataArray = mapBigArrayToSmallSize(frequency, 2);
        this.drawAll();
    }
}
