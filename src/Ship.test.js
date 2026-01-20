import { Ship } from "./gameLogic";

let ship;

//Before each test creates a ship with length 2
beforeEach(() => {
    ship = new Ship(2);
});

test('Increase the number of hits', () => {
    ship.hit();
    expect(ship.getHits()).toBe(1);
});

test('Sunk the ship when its fully destroyed', () => {
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
});

test('Hitting a sunken ship', () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
    expect(() => ship.hit()).toThrow();
});