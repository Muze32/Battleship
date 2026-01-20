import { Ship, Gameboard } from "./gameLogic";

let gameboard, ship;

//For testing purposes, the board will be 10x10 and will have a max of 2 ships
beforeEach(() => {
    gameboard = new Gameboard(10, 2);
    ship =  new Ship(1);
    gameboard.setCell(3, 4, ship);
});

test('Place a ship in the board', () => {
    expect(gameboard.getShip(2, 2)).toBeNull();
    gameboard.setCell(2, 2, ship);
    expect(gameboard.getShip(2, 2)).toBe(ship);
});

test('Cant place a ship in a occupied cell', () => {
    expect(gameboard.getShip(3, 4)).toBe(ship);
    const ship1 = new Ship(1);
    expect(() => gameboard.setCell(3, 4, ship1)).toThrow();
});

test('Cant place a ship outside the board', () => {
    const ship1 = new Ship(1);
    expect(() => gameboard.setCell(20, 20, ship1)).toThrow();
})

test('Hit a cell with a ship', () => {
    gameboard.receiveAttack(3, 4);
    expect(ship.getHits()).toBe(1);
    expect(ship.isSunk()).toBeTruthy();
});

test('Hit a empty cell', () => {
    gameboard.receiveAttack(1, 5);
    expect(ship.getHits()).toBe(0);
    expect(ship.isSunk()).toBeFalsy();
});

test('Cant select a empty cell twice', () => {
    gameboard.receiveAttack(2, 3);
    expect(() => gameboard.receiveAttack(2, 3)).toThrow();
});

test('Cant select a occupied cell twice', () => {
    gameboard.receiveAttack(3, 4);
    expect(() => gameboard.receiveAttack(3, 4)).toThrow();
});

test('Game over when all the ships are sunk', () => {
    const ship1 = new Ship(1);
    gameboard.setCell(2, 2, ship1);

    gameboard.receiveAttack(3, 4);
    expect(gameboard.getIsGameOver()).toBeFalsy();

    gameboard.receiveAttack(2,2);
    expect(ship1.isSunk()).toBeTruthy();
    expect(gameboard.getIsGameOver()).toBeTruthy();
});