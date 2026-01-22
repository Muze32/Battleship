import { createBoard, updateBoard } from "./domHandler";
import { Gameboard, Player } from "./gameLogic";

const p1Board = document.getElementById('p1Board');
const gameboard = new Gameboard();
createBoard(gameboard, p1Board);
//updateBoard(gameboard, p1Board);