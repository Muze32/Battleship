class Ship {
    constructor(length) {
        this.length = length;
        this.numHits = 0;
    }

    hit() {
        if (this.isSunk()) {
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

class Gameboard {
    constructor(size = 10, ships = 5) {
        this.board = [];
        this.size = size;
        this.ships = ships;
        this.sunkShips = 0;
        this.isGameOver = false;    

        //Creates board
        for (let i = 0; i < size; i++) {
            this.board[i] = [];

            for (let j = 0; j < size; j++) {
                this.board[i].push({ ship: null, marked: false });
            }
        }
    }

    getSize() {
        return this.size;
    }

    setCell(x, y, ship) {
        if (this.getShip(x, y) !== null) throw new Error('Cant place on a occupied cell');
        this.board[x][y].ship = ship;
    }

    #getCell(x, y) {
        this.#checkOutOfBounds();
        return this.board[x][y];
    }

    getShip(x, y) {
        return this.#getCell(x, y).ship;
    }

    getMarked() {
        return this.#getCell(x, y).marked;
    }

    #checkOutOfBounds(x, y) {
        if ((x < 0 || x >= this.size) || (y < 0 || y >= this.size)) {
            throw new Error('Cant place on that position');
        }
    }

    receiveAttack(x, y) {
        const cell = this.#getCell(x, y);

        if (cell.marked) throw new Error('Cant select twice a cell');
        else if (cell.ship === null) cell.marked = true;
        else {
            cell.marked = true;
            cell.ship.hit();
            this.#handleSunkShips(cell.ship);
        }
    }

    #handleSunkShips(ship) {
        if (ship.isSunk()) {
            this.sunkShips++;
        }

        if (this.sunkShips === this.ships) {
            this.isGameOver = true;
        }
    }

    getIsGameOver() {
        return this.isGameOver;
    }
}

class Player {
    constructor(gameboard, isCPU = false) {
        this.isCPU = isCPU;
        this.gameboard = gameboard;
    }

    getBoard() {
        return this.gameboard;
    }
}

export { Ship, Gameboard, Player }