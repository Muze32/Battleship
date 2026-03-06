const getRandomArray = (max, array = null) => {
    if (array === null) {
        array = Array.from({ length: max }, (_, i) => i + 1);
    }

    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Intercambiar posiciones
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    return array;
}

const getRandomDirection = () => {
    const randomNumber = Math.floor(Math.random() * 2);
    return randomNumber === 0;
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export { getRandomArray, getRandomDirection, getRandomInt }