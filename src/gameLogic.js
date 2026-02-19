class Ship {
    constructor(length) {
        this.isHorizontal = false;
        this.length = length;
        this.timesPlaced = 0;
        this.numHits = 0;
    }

    incTimesPlaced() {
        this.timesPlaced++;
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

    getLength() {
        return this.length
    }

    getTimesPlaced() {
        return this.timesPlaced;
    }

    isSunk() {
        return this.length === this.numHits;
    }

    getIsHorizontal() {
        return this.isHorizontal;
    }

    setIsHorizontal(direction) {
        this.isHorizontal = direction;
    }
};

class Gameboard {
    constructor(ships = 5, size = 10) {
        this.board = [];
        this.size = size;
        this.ships = ships;
        this.sunkShips = 0;

        //Creates board
        for (let y = 0; y < size; y++) {
            this.board[y] = [];

            for (let x = 0; x < size; x++) {
                this.board[y].push({ ship: null, marked: false });
            }
        }
    }

    getSize() {
        return this.size;
    }

    setCell(x, y, ship) {
        if (this.getShip(x, y) !== null) throw new Error('Cant place on a occupied cell');
        if (ship.getTimesPlaced() === ship.getLength()) throw new Error('Cant place a ship more times than its length');
        if (ship.getTimesPlaced() > 0 && !this.hasAdjacentCells(x, y, ship)) throw new Error('Cant place on a non adjacent cell');

        //The direction of the ship will be decided after the first part is placed
        if (ship.getTimesPlaced() === 1) {
            if (this.getShip(x - 1, y) === ship || this.getShip(x + 1, y) === ship) {
                ship.setIsHorizontal(true);
            } else {
                ship.setIsHorizontal(false);
            }
        }

        this.board[x][y].ship = ship;
        ship.incTimesPlaced();
    }

    hasAdjacentCells(x, y, ship) {
        //The possible moves changes depending if the direction of the ship is horizontal or vertical
        const moves = ship.getIsHorizontal() === true ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];

        const possibleMoves = moves.map(([posX, posY]) => [x + posX, y + posY]);
        const validMoves = possibleMoves.filter(([posX, posY]) => this.#isInBounds(posX, posY) &&
            this.getShip(posX, posY) === ship);

        return validMoves.length !== 0;
    }

    #getCell(x, y) {
        this.#AssertInBounds(x, y);
        return this.board[x][y];
    }

    getShip(x, y) {
        return this.#getCell(x, y).ship;
    }

    #AssertInBounds(x, y) {
        if ((x < 0 || x >= this.size) || (y < 0 || y >= this.size)) {
            throw new Error('Cant place on that position');
        }
    }

    #isInBounds(x, y) {
        return !((x < 0 || x >= this.size) || (y < 0 || y >= this.size));
    }

    receiveAttack(x, y) {
        const cell = this.#getCell(x, y);

        if (cell.marked) throw new Error('Cant select twice a cell');
        else if (cell.ship === null) cell.marked = true;
        else {
            cell.marked = true;
            cell.ship.hit();

            if (cell.ship.isSunk())
                this.sunkShips++;

        }
    }

    isGameOver() {
        return this.sunkShips === this.ships;
    }

    getAvailableCells() {
        const available = [];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const cell = this.#getCell(x, y);

                if (!cell.marked)
                    available.push({ x, y });
            }
        }

        return available;
    }
}

class Player {
    constructor(gameboard) {
        this.gameboard = gameboard;
    }

    getBoard() {
        return this.gameboard;
    }
}

class CPU {
    constructor(board, randomFn = Math.random) {
        this.board = board;
        this.randomFn = randomFn;
    }

    getMove() {
        const available = this.board.getAvailableCells();
        const randomIndex = Math.floor(this.randomFn() * available.length);
        return available[randomIndex];
    }

    getBoard() {
        return this.board;
    }
}

export { Ship, Gameboard, Player, CPU }