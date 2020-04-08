import { Canvas } from "../Canvas";
import { ICanvasAnimation } from "../IAnimation";
import {mapBigArrayToSmallSize} from "../Utility";

export class BarsAnimation implements ICanvasAnimation {
    private fftSize = 512;
    private helper: Canvas;
    private byteFrequencyDataArray = new Uint8Array(~~(this.fftSize / 2));

    constructor() {
        const canvas = document.getElementById('bars-canvas');
        this.helper = new Canvas(canvas as HTMLCanvasElement);
    }

    private clearBackground() {
        const { helper } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, 'black');
    }

    private drawBars() {
        const { helper, byteFrequencyDataArray } = this;
        const { width, height, drawFilledRect } = helper;

        const barWidth = 1;
        for (let i = 0; barWidth * i <= width; i++) {
            const barX = i * 2;
            const barHeight = byteFrequencyDataArray[i] / 2;
            drawFilledRect(
                barX, height - barHeight,
                barWidth, barHeight, 'white');
        }
    }

    animate(frequency: Uint8Array, time: Uint8Array) {
        this.clearBackground();
        this.byteFrequencyDataArray = mapBigArrayToSmallSize(frequency, 4);
        this.drawBars();
    }
}
