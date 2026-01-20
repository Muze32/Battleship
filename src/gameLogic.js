class Ship {
    constructor(length) {
        this.length = length;
        this.numHits = 0;
    }

    hit() {
        if(this.isSunk()) {
            throw new Error('Cant hit a sunken ship');
        }

        this.numHits++;
    }

    getHits() {
        return this.numHits;
    }

    isSunk() {
        return this.length === this.numHits;
    }
};



export { Ship }