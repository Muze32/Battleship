import { getRandomArray, getRandomDirection, getRandomInt } from "./randomFunctions";

class Ship {
    constructor(length, direction = false) {
        this.isHorizontal = direction;
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

        for (const [newX, newY] of possibleMoves) {
            const foundShip = this.getShip(newX, newY);

            if (foundShip === ship) {
                return true;
            }
        }

        return false;
    }

    hasNearShips(x, y) {
        const moves = [[-1, -1], [1, 1], [1, -1], [-1, 1], [0, 1], [0, -1], [1, 0], [-1, 0]];
        const possibleMoves = moves.map(([posX, posY]) => [x + posX, y + posY]);

        for (const [newX, newY] of possibleMoves) {
            const foundShip = this.getShip(newX, newY);

            if (foundShip) {
                return true;
            }
        }
        return false;
    }

    isAvailable(x, y) {
        const ship = this.getShip(x, y);
        return (ship !== undefined && !this.hasNearShips(x, y));
    }

    getShip(x, y) {
        if (!this.#isInBounds(x, y)) return undefined;
        return this.board[x][y].ship;
    }

    getMarked(x, y) {
        if (!this.#isInBounds(x, y)) return null;
        return this.board[x][y].marked;
    }

    setMarked(x, y) {
        if (!this.#isInBounds(x, y)) return;
        this.board[x][y].marked = true;
    }

    #isInBounds(x, y) {
        return !((x < 0 || x >= this.size) || (y < 0 || y >= this.size));
    }

    receiveAttack(x, y) {
        const ship = this.getShip(x, y);
        let marked = this.getMarked(x, y);

        if (marked) throw new Error('Cant select twice a cell');
        else if (!ship) this.setMarked(x, y);
        else {
            this.setMarked(x, y);
            ship.hit();

            if (ship.isSunk())
                this.sunkShips++;
        }
    }

    isGameOver() {
        return this.sunkShips === this.ships;
    }

    getLonelyCells(action) {
        const available = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const marked = this.getMarked(x, y);

                if (!marked && (action === "available" || (action === "lonely" && !this.hasNearShips(x, y)))) {
                    available.push({ x, y });
                }
            }
        }
        return available;
    }

    placeRandomShips(numShips = this.ships) {
        const randomShipSizes = getRandomArray(numShips);
        const possiblePositions = this.getLonelyCells("lonely");
        const randomPositions = getRandomArray(possiblePositions.length, possiblePositions);

        for (const size of randomShipSizes) {
            const direction = getRandomDirection();
            const ship = new Ship(size, direction);
            this.placeInRandomPos(ship, randomPositions);
        }
    }

    placeInRandomPos(ship, randomPositions) {
        for (const pos of randomPositions) {
            const direction = this.isAbleToPlace(ship, pos);

            if (direction) {
                this.placeConsecutiveShips(ship, pos, direction);
                return;
            }
        }
    }

    isAbleToPlace(ship, { x, y }) {
        let hasShipsForwards = false, hasShipsBackwards = false;
        const isHorizontal = ship.getIsHorizontal();

        for (let i = 0; i < ship.getLength(); i++) {
            if (isHorizontal) {
                if (!this.isAvailable(x + i, y)) hasShipsForwards = true;
                if (!this.isAvailable(x - i, y)) hasShipsBackwards = true;
            } else {
                if (!this.isAvailable(x, y + i)) hasShipsForwards = true;
                if (!this.isAvailable(x, y - i)) hasShipsBackwards = true;
            }
        }

        //If the path forward and backwards is unavailable returns null
        if (hasShipsBackwards && hasShipsForwards) return null;

        return !hasShipsForwards ? "forward" : "backward";
    }

    placeConsecutiveShips(ship, { x, y }, direction) {
        const length = ship.getLength();
        const isHorizontal = ship.getIsHorizontal();
        const step = direction === "forward" ? 1 : -1;

        for (let i = 0; i < length; i++) {
            if (isHorizontal) {
                this.setCell(x + i * step, y, ship);
            } else {
                this.setCell(x, y + i * step, ship);
            }
        }
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
    constructor(board) {
        this.board = board;
    }

    getMove(board) {
        const available = board.getLonelyCells("available");
        const randomIndex = getRandomInt(available.length);
        return available[randomIndex];
    }

    getBoard() {
        return this.board;
    }
}

export { Ship, Gameboard, Player, CPU }