interface CanvasAnimation {
    animate: (frequency: Uint8Array, timeDomain: Uint8Array) => void;
}

export type ICanvasAnimation = CanvasAnimation;
