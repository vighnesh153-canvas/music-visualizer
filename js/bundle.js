(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./Canvas");
const Utility_1 = require("./Utility");
class BarsAnimation {
    constructor() {
        this.fftSize = 512;
        this.byteFrequencyDataArray = new Uint8Array(~~(this.fftSize / 2));
        const canvas = document.getElementById('bars-canvas');
        this.helper = new Canvas_1.Canvas(canvas);
    }
    clearBackground() {
        const { helper } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, 'black');
    }
    drawBars() {
        const { helper, byteFrequencyDataArray } = this;
        const { width, height, drawFilledRect } = helper;
        const barWidth = 1;
        for (let i = 0; barWidth * i <= width; i++) {
            const barX = i * 2;
            const barHeight = byteFrequencyDataArray[i] / 2;
            drawFilledRect(barX, height - barHeight, barWidth, barHeight, 'white');
        }
    }
    animate(frequency, time) {
        this.clearBackground();
        this.byteFrequencyDataArray = Utility_1.mapBigArrayToSmallSize(frequency, 4);
        this.drawBars();
    }
}
exports.BarsAnimation = BarsAnimation;

},{"./Canvas":2,"./Utility":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(canvas) {
        this.drawBitmap = this.drawBitmap.bind(this);
        this.drawFilledRect = this.drawFilledRect.bind(this);
        this.drawOutlineRect = this.drawOutlineRect.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.drawFilledCircle = this.drawFilledCircle.bind(this);
        this.drawBitmap = this.drawBitmap.bind(this);
        this.writeText = this.writeText.bind(this);
        this.canvas = canvas;
        this.canvasContext = this.canvas.getContext('2d');
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    drawBitmap(useBitmap, x, y, angle) {
        this.canvasContext.save();
        this.canvasContext.translate(x, y);
        this.canvasContext.rotate(angle);
        this.canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
        this.canvasContext.restore();
    }
    drawFilledRect(x, y, width, height, color) {
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(x, y, width, height);
    }
    drawOutlineRect(x, y, width, height, color) {
        this.canvasContext.strokeStyle = color;
        this.canvasContext.strokeRect(x, y, width, height);
    }
    drawRoundedRect(x, y, width, height, radius, color) {
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = color;
        this.canvasContext.moveTo(x + width - radius, y + height);
        this.canvasContext.arcTo(x, y + height, x, y, radius);
        this.canvasContext.arcTo(x, y, x + width, y, radius);
        this.canvasContext.arcTo(x + width, y, x + width, y + height, radius);
        this.canvasContext.arcTo(x + width, y + height, x, y + height, radius);
        this.canvasContext.stroke();
    }
    drawLine(x1, y1, x2, y2, lineWidth, color) {
        this.canvasContext.save();
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = lineWidth;
        this.canvasContext.strokeStyle = color;
        this.canvasContext.moveTo(x1, y1);
        this.canvasContext.lineTo(x2, y2);
        this.canvasContext.stroke();
        this.canvasContext.restore();
    }
    drawDashedLine(x1, y1, x2, y2, lineWidth, color, dashParams) {
        this.canvasContext.setLineDash(dashParams);
        this.drawLine(x1, y1, x2, y2, lineWidth, color);
        this.canvasContext.setLineDash([]);
    }
    drawFilledCircle(centerX, centerY, radius, color) {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = color;
        this.canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        this.canvasContext.fill();
    }
    writeText(text, x, y, fontSize, color) {
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillText(text, x, y);
    }
    translate(x, y) {
        this.canvasContext.translate(x, y);
    }
    rotate(angle) {
        this.canvasContext.rotate(angle);
    }
    pushState() {
        this.canvasContext.save();
    }
    popState() {
        this.canvasContext.restore();
    }
}
exports.Canvas = Canvas;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./Canvas");
class SinusoidalWaveAnimation {
    constructor() {
        const canvas = document.getElementById('sinusoidal-wave-canvas');
        this.helper = new Canvas_1.Canvas(canvas);
    }
    clearBackground() {
        const { helper } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, 'black');
    }
    drawWave(timeDomainDataArray) {
        const { helper } = this;
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
    animate(frequency, time) {
        this.clearBackground();
        this.drawWave(time);
    }
}
exports.SinusoidalWaveAnimation = SinusoidalWaveAnimation;

},{"./Canvas":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBigArrayToSmallSize = (array, size) => {
    const newArray = new Uint8Array(array.length / size);
    for (let i = size - 1; i < array.length; i += size) {
        let sum = 0;
        for (let j = i - size + 1; j <= i; j++) {
            sum += array[j];
        }
        newArray[~~(i / size)] = sum / size;
    }
    return newArray;
};

},{}],5:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { BarsAnimation } = yield Promise.resolve().then(() => require('./BarsAnimation'));
    const { SinusoidalWaveAnimation } = yield Promise.resolve().then(() => require('./SinusoidalWaveAnimation'));
    let analyzer;
    let animationRunning = true;
    let isInit = true;
    let audioElement;
    const byteFrequencyDataArray = new Uint8Array(1024);
    const byteTimeDomainDataArray = new Uint8Array(1024);
    const allAnimations = [
        new BarsAnimation(),
        new SinusoidalWaveAnimation()
    ];
    const stopAllAnimations = () => {
        animationRunning = false;
    };
    const animateAll = () => {
        if (isInit) {
            const audioContext = new AudioContext();
            analyzer = audioContext.createAnalyser();
            const audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(analyzer);
            analyzer.connect(audioContext.destination);
            isInit = false;
        }
        animationRunning = true;
        analyzer.fftSize = 2048;
        analyzer.smoothingTimeConstant = 0.9;
        analyzer.getByteFrequencyData(byteFrequencyDataArray);
        analyzer.getByteTimeDomainData(byteTimeDomainDataArray);
        allAnimations.forEach((animation) => {
            animation.animate(byteFrequencyDataArray, byteTimeDomainDataArray);
        });
        if (animationRunning) {
            requestAnimationFrame(animateAll);
        }
    };
    window.onload = () => {
        console.log('App bootstrapping!');
        audioElement = document.querySelector('audio');
        audioElement.addEventListener('play', animateAll);
        audioElement.addEventListener('pause', stopAllAnimations);
        console.log('App bootstrapped.');
        console.log('Waiting for user events to process!');
    };
}))();

},{"./BarsAnimation":1,"./SinusoidalWaveAnimation":3}]},{},[5]);
