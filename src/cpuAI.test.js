import { Gameboard } from "./gameLogic";
import { CPU } from "./cpuAI";

test("cpu elige la primera celda disponible cuando random = 0", () => {
  const fakeRandom = () => 0;

  const board = new Gameboard();
  board.receiveAttack(0, 0); // ya usada

  const cpu = new CPU(fakeRandom);

  const move = cpu.getMove(board);

  expect(move).toEqual(board.getAvailableCells()[0]);
});
