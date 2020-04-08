import {Canvas} from "../Canvas";
import {ICanvasAnimation} from "../IAnimation";

export class SinusoidalWaveAnimation implements ICanvasAnimation {
    private helper: Canvas;

    constructor() {
        const canvas = document.getElementById('sinusoidal-wave-canvas');
        this.helper = new Canvas(canvas as HTMLCanvasElement);
    }

    private clearBackground() {
        const {helper} = this;
        const {width, height, drawFilledRect} = helper;
        drawFilledRect(0, 0, width, height, 'black');
    }

    private drawWave(timeDomainDataArray: Uint8Array) {
        const {helper} = this;
        const sliceWidth = helper.width / timeDomainDataArray.length;
        let x = 0;
        let prevX = 0;
        let prevY = 0;

        for (let i = 0; i < timeDomainDataArray.length; i++) {
            const value = timeDomainDataArray[i] / 4;
            const y = helper.height / 3 + value;

            if (i !== 0) {
                helper.drawLine(x, y, prevX, prevY, 2, 'white');
            }
            prevX = x;
            prevY = y;

            x += sliceWidth;
        }
    }

    animate(frequency: Uint8Array, time: Uint8Array) {
        this.clearBackground();
        this.drawWave(time);
    }
}
