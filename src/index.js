import { createBoard, updateBoard, startGame } from "./domHandler";
import { Gameboard, Player } from "./gameLogic";
import "./test.css";

const p1Board = document.getElementById('p1Board');
const gameboard = new Gameboard();
startGame();
//updateBoard(gameboard, p1Board);