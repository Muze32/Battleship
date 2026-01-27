import { Ship, Gameboard } from "./gameLogic";

let gameboard, ship;

//For testing purposes, the board will be 10x10 and will have a max of 2 ships
beforeEach(() => {
    gameboard = new Gameboard(2, 10);
    ship =  new Ship(1);
    gameboard.setCell(3, 4, ship);
});

test('Place a ship in the board', () => {
    expect(gameboard.getShip(2, 2)).toBeNull();
    expect(gameboard.getShip(3, 4)).toBe(ship);
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
    expect(gameboard.isGameOver()).toBeFalsy();

    gameboard.receiveAttack(2,2);
    expect(gameboard.isGameOver()).toBeTruthy();
});

test('Cant place a ship in more cells than its length', () => {
    const ship1 = new Ship(2);
    gameboard.setCell(2, 2, ship1);
    gameboard.setCell(2, 3, ship1);

    expect(() => gameboard.setCell(2, 4, ship1)).toThrow();
});

test('Cant place a ship in non adjacent cells', () => {
    const ship1 = new Ship(3);
    gameboard.setCell(2, 2, ship1);
    gameboard.setCell(2, 3, ship1);
    
    expect(() => gameboard.setCell(5, 5, ship1)).toThrow();
});

test('Cant change the direction of a ship', () => {
    const ship1 = new Ship(5);
    gameboard.setCell(2, 2, ship1);
    gameboard.setCell(2, 3, ship1);
    gameboard.setCell(2, 4, ship1);
    expect(() => gameboard.setCell(3, 2, ship1)).toThrow();
});