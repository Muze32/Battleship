class CPU {

    constructor(randomFn = Math.random) {
        this.randomFn = randomFn;
    }

    getMove(board) {
        const available = board.getAvailableCells();
        const randomIndex = Math.floor(this.randomFn() * available.length);
        return available[randomIndex];
    }
}

export { CPU };