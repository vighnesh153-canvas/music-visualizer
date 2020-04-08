export const mapBigArrayToSmallSize =
    (array: Uint8Array, size: number): Uint8Array => {
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
