import { Gameboard, Player, Ship } from "./gameLogic";

let players = [];

const createBoard = (player, boardContainer) => {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("boardDiv");

    const gameboard = player.getBoard();
    const size = gameboard.getSize();
    const letters = "ABCDEFGHIJ";

    //Add a empty cell at the top left
    boardDiv.appendChild(document.createElement("span"));

    for (let letter of letters) {
        const letterSpan = document.createElement("span");
        letterSpan.textContent = letter;
        boardDiv.appendChild(letterSpan);
    }

    //First creates cols then rows
    for (let y = 0; y < size; y++) {
        const rowNumberSpan = document.createElement('span');
        rowNumberSpan.textContent = y;
        boardDiv.appendChild(rowNumberSpan);

        for (let x = 0; x < size; x++) {
            const cellBtn = createCellBtn(x, y, player);
            boardDiv.appendChild(cellBtn);
        }
    }
    boardContainer.appendChild(boardDiv);
};

const createCellBtn = (x, y, player) => {
    const cellBtn = document.createElement('button');
    cellBtn.dataset.x = x;
    cellBtn.dataset.y = y;
    cellBtn.classList.add("cellBtn");
    cellBtn.addEventListener('click', (e) => updateCell(e, player));
    return cellBtn;
};

const updateCell = (e, player) => {
    const btn = e.target;
    const board = player.getBoard();
    const x = e.target.dataset.x, y = e.target.dataset.y;
    board.receiveAttack(x, y);

    btn.classList.add("marked");
    btn.disabled = true;

    //Checks if the coordinate was water or a ship
    if (board.getShip(x, y) === null) {
        btn.classList.add("water");
    } else {
        btn.classList.add("ship");
    }

    btn.textContent = "X";
    //Checks if the game is over
    if (board.isGameOver()) {
        handleEndGame(player);
    } else {
        switchTurn(player);
    }
};

const switchTurn = (player) => {
    const p1BoardContainer = document.getElementById('p1BoardContainer');
    const p2BoardContainer = document.getElementById('p2BoardContainer');
    const stringPlayer = player === players[0] ? "Player 2" : "Player 1";
    const playerTurnDiv = document.getElementById("playerTurnDiv");

    playerTurnDiv.textContent = `${stringPlayer} turn: `
    p1BoardContainer.classList.toggle("disabled");
    p2BoardContainer.classList.toggle("disabled");
};

const startGame = () => {
    const gameBoard = createTempBoard();
    const gameBoard1 = createTempBoard();
    const player1 = new Player(gameBoard);
    const player2 = new Player(gameBoard1, true);

    players = [player1, player2];

    updateDOMElements(player1, player2);
};

const updateDOMElements = (player1, player2) => {
    const p1BoardContainer = document.getElementById('p1BoardContainer');
    const p2BoardContainer = document.getElementById('p2BoardContainer');

    p2BoardContainer.classList.add("disabled");

    createBoard(player1, p1BoardContainer);
    createBoard(player2, p2BoardContainer);

    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", resetGame);
};

const resetGame = () => {
    const p1BoardDiv = document.getElementById('p1Board');
    const p2BoardDiv = document.getElementById('p2Board');
    p1BoardDiv.textContent = "";
    p2BoardDiv.textContent = "";
    p1BoardDiv.classList.remove("disabled");

    const boardsContainer = document.getElementById("boardsContainer");
    boardsContainer.classList.remove("disabled");

    const winDiv = document.getElementById("winDiv");
    winDiv.textContent = '';

    const playerTurnDiv = document.getElementById("playerTurnDiv");
    playerTurnDiv.textContent = "Player 1 turn: ";
    startGame();
};

const createTempBoard = () => {
    const board = new Gameboard();

    for (let i = 0; i < 10; i++) {
        const ship = new Ship(1);
        board.setCell(i, i, ship);
    }

    return board;
};

const handleEndGame = (player) => {
    const boardsContainer = document.getElementById("boardsContainer");
    boardsContainer.classList.add("disabled");

    //Checks which player won
    const stringPlayer = player === players[0] ? "Player 1" : "Player 2";

    const winDiv = document.getElementById("winDiv");
    winDiv.textContent = `${stringPlayer} won the match. Good game!`;
};

export { startGame }