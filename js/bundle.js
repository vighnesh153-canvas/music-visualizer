(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        this.reset();
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    reset() {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
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
    drawOutlineCircle(centerX, centerY, radius, width, color) {
        const originalWidth = this.canvasContext.lineWidth;
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = width;
        this.canvasContext.strokeStyle = color;
        this.canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        this.canvasContext.stroke();
        this.canvasContext.lineWidth = originalWidth;
    }
    writeText(text, x, y, fontSize, color) {
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillText(text, x, y);
    }
    drawLineAtAngle(sX, sY, length, angle = 0, color = 'white', thickness = 1) {
        let eX = length * Math.cos(angle);
        let eY = length * Math.sin(angle);
        eX += sX;
        eY += sY;
        this.drawLine(sX, sY, eX, eY, thickness, color);
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../Canvas");
const Utility_1 = require("../Utility");
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

},{"../Canvas":1,"../Utility":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../Canvas");
const Utility_1 = require("../Utility");
class CircularAnimation {
    constructor() {
        this.fftSize = 1024;
        this.baseCircularRadius = 20;
        this.backGroundColor = 'black';
        this.byteFrequencyDataArray = new Uint8Array(~~(this.fftSize / 2));
        this.rotationAngle = 1;
        const canvas = document.getElementById('circular-animation-canvas');
        this.helper = new Canvas_1.Canvas(canvas);
    }
    clearBackground() {
        const { helper, backGroundColor } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, backGroundColor);
    }
    drawCircle() {
        const centerX = this.helper.width / 2;
        const centerY = this.helper.height / 2;
        this.helper.drawFilledCircle(centerX, centerY, this.baseCircularRadius, 'white');
        this.helper.drawFilledCircle(centerX, centerY, this.baseCircularRadius - 5, this.backGroundColor);
    }
    drawLines() {
        for (let i = 0; i < this.byteFrequencyDataArray.length; i++) {
            const angle = i + this.rotationAngle;
            const length = this.byteFrequencyDataArray[i] / 4 + this.baseCircularRadius;
            this.helper.drawLineAtAngle(this.helper.width / 2, this.helper.height / 2, length, angle * Math.PI / 180);
        }
        this.rotationAngle += 0.1;
        this.rotationAngle %= 360;
    }
    drawAll() {
        const originalRadius = this.baseCircularRadius;
        this.baseCircularRadius += this.byteFrequencyDataArray[180] / 30;
        this.drawLines();
        this.drawCircle();
        this.baseCircularRadius = originalRadius;
    }
    animate(frequency, time) {
        this.clearBackground();
        this.byteFrequencyDataArray = Utility_1.mapBigArrayToSmallSize(frequency, 2);
        this.drawAll();
    }
}
exports.CircularAnimation = CircularAnimation;

},{"../Canvas":1,"../Utility":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../Canvas");
const Utility_1 = require("../Utility");
class Particle {
    constructor() {
        this.velocityX = 0;
        this.velocityY = 0;
        this.huntTarget = -1;
    }
    update(frequency) {
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
        Particle.helper.drawFilledCircle(this.x, this.y, Particle.radius, Particle.color);
    }
    process(frequency) {
        this.update(frequency);
        this.draw();
    }
}
Particle.radius = 1;
Particle.color = 'red';
Particle.gravity = 0.1;
class ParticlesAnimation {
    constructor() {
        this.fftSize = 512;
        this.backGroundColor = 'black';
        this.byteFrequencyDataArray = new Uint8Array(~~(this.fftSize / 2));
        const canvas = document.getElementById('particles-animation-canvas');
        this.helper = new Canvas_1.Canvas(canvas);
        Particle.rightMax = this.helper.width;
        Particle.bottomMax = this.helper.height;
        Particle.helper = this.helper;
        this.generateParticles();
    }
    generateParticles() {
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
    clearBackground() {
        const { helper, backGroundColor } = this;
        const { width, height, drawFilledRect } = helper;
        drawFilledRect(0, 0, width, height, backGroundColor);
    }
    processParticles() {
        this.particles.forEach(p => p.process(this.byteFrequencyDataArray));
    }
    animate(frequency, time) {
        this.clearBackground();
        this.byteFrequencyDataArray = Utility_1.mapBigArrayToSmallSize(frequency, 4);
        this.processParticles();
    }
}
exports.ParticlesAnimation = ParticlesAnimation;

},{"../Canvas":1,"../Utility":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../Canvas");
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

},{"../Canvas":1}],7:[function(require,module,exports){
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
    const { BarsAnimation } = yield Promise.resolve().then(() => require('./animations/BarsAnimation'));
    const { SinusoidalWaveAnimation } = yield Promise.resolve().then(() => require('./animations/SinusoidalWaveAnimation'));
    const { CircularAnimation } = yield Promise.resolve().then(() => require('./animations/CircularAnimation'));
    const { ParticlesAnimation } = yield Promise.resolve().then(() => require('./animations/ParticlesAnimation'));
    let analyzer;
    let animationRunning = true;
    let isInit = true;
    let audioElement;
    const byteFrequencyDataArray = new Uint8Array(1024);
    const byteTimeDomainDataArray = new Uint8Array(1024);
    const allAnimations = [
        new BarsAnimation(),
        new SinusoidalWaveAnimation(),
        new CircularAnimation(),
        new ParticlesAnimation()
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
        audioElement.addEventListener('play', () => {
            animationRunning = true;
            animateAll();
        });
        audioElement.addEventListener('pause', stopAllAnimations);
        console.log('App bootstrapped.');
        console.log('Waiting for user events to process!');
    };
}))();

},{"./animations/BarsAnimation":3,"./animations/CircularAnimation":4,"./animations/ParticlesAnimation":5,"./animations/SinusoidalWaveAnimation":6}]},{},[7]);
