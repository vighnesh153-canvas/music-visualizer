import { ICanvasAnimation } from "./IAnimation";

(async () => {
    const { BarsAnimation } = await import('./animations/BarsAnimation');
    const { SinusoidalWaveAnimation } = await import('./animations/SinusoidalWaveAnimation');
    const { CircularAnimation } = await import('./animations/CircularAnimation');

    let analyzer: AnalyserNode;
    let animationRunning = true;
    let isInit = true;
    let audioElement: HTMLAudioElement;
    const byteFrequencyDataArray = new Uint8Array(1024);
    const byteTimeDomainDataArray = new Uint8Array(1024);

    const allAnimations: ICanvasAnimation[] = [
        new BarsAnimation(),
        new SinusoidalWaveAnimation(),
        new CircularAnimation()
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

        allAnimations.forEach((animation: ICanvasAnimation) => {
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
})();
