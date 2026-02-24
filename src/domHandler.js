import { Gameboard, Player, Ship, CPU } from "./gameLogic";

const game = {
    mode: null,
    turn: 1,
    cpu: null
};

const createBoard = (player, boardDiv) => {
    const gameboard = player.getBoard();
    const size = gameboard.getSize();
    const letters = "ABCDEFGHIJ";

    //Add a empty cell at the top left
    boardDiv.appendChild(document.createElement("span"));

    for (let letter of letters) {
        const letterSpan = document.createElement("span");
        letterSpan.classList.add("cellLetter");
        letterSpan.textContent = letter;
        boardDiv.appendChild(letterSpan);
    }

    //First creates cols then rows
    for (let y = 0; y < size; y++) {
        const numberSpan = document.createElement('span');
        numberSpan.classList.add("cellNumber");
        numberSpan.textContent = y;
        boardDiv.appendChild(numberSpan);

        for (let x = 0; x < size; x++) {
            const cellBtn = createCellBtn(x, y, player);
            boardDiv.appendChild(cellBtn);
        }
    }
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
    const x = btn.dataset.x, y = btn.dataset.y;
    board.receiveAttack(x, y);

    btn.classList.add("disabled");
    btn.textContent = "X";

    //Checks if the coordinate was water or a ship
    if (!board.getShip(x, y)) {
        btn.classList.add("water");
    } else {
        btn.classList.add("ship");
    }

    //Checks if the game is over
    if (board.isGameOver()) {
        handleEndGame();
    } else {
        switchTurn();
    }
};

const switchTurn = async () => {
    const p1BoardDiv = document.getElementById('p1BoardDiv');
    const p2BoardDiv = document.getElementById('p2BoardDiv');
    const playerTurnH1 = document.getElementById("playerTurnH1");
    let stringPlayer;

    //Switchs turn
    game.turn = game.turn === 1 ? 2 : 1;

    //Updates stringPlayer
    if (game.mode === "cpu" && game.turn === 2) {
        stringPlayer = "CPU";
    } else {
        stringPlayer = game.turn === 1 ? "Player 1" : "Player 2";
    }

    //Updates player turn on screen
    playerTurnH1.textContent = `${stringPlayer} turn`;

    //If the game mode is two players
    if (game.mode !== "cpu") {
        p1BoardDiv.classList.toggle("disabled");
        p2BoardDiv.classList.toggle("disabled");
        return;
    }

    //If it is the CPU turn
    if (game.turn === 2) {
        p1BoardDiv.classList.add("disabled");
        p2BoardDiv.classList.add("disabled");

        //The delay will take a random value between 750ms and 2500 ms
        const randomDelayms = Math.floor(Math.random() * (2500 - 750)) + 750;
        await delay(randomDelayms);
        playCPUMove();
    } else {
        p2BoardDiv.classList.remove("disabled");
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playCPUMove = () => {
    const move = game.cpu.getMove();
    const container = document.getElementById("p1BoardDiv");
    const btn = container.querySelector(`[data-x="${move.x}"][data-y="${move.y}"]`);
    btn.click();
};

const setupGame = () => {
    const dialog = document.querySelector("dialog");
    dialog.showModal();

    const cpuBtn = document.getElementById("cpuBtn");
    const player2Btn = document.getElementById("player2Btn");

    cpuBtn.addEventListener("click", () => {
        game.mode = "cpu";
        startGame();
        dialog.close();
    });

    player2Btn.addEventListener("click", () => {
        game.mode = "player2";
        startGame();
        dialog.close();
    });
};

const startGame = () => {
    const gameBoard = createTempBoard();
    const gameBoard1 = createTempBoard();
    const player1 = new Player(gameBoard);
    const player2 = game.mode === "cpu" ? new CPU(gameBoard1) : new Player(gameBoard1);

    if (game.mode === "cpu") {
        game.cpu = player2;
    }

    game.turn = 1;

    updateDOMElements(player1, player2);
};

const updateDOMElements = (player1, player2) => {
    const p1BoardDiv = document.getElementById('p1BoardDiv');
    const p2BoardDiv = document.getElementById('p2BoardDiv');

    p1BoardDiv.classList.add("disabled");

    createBoard(player1, p1BoardDiv);
    createBoard(player2, p2BoardDiv);

    const resetBtn = document.getElementById("resetBtn");
    resetBtn.onclick = resetGame;
};

const resetGame = () => {
    const p1BoardDiv = document.getElementById('p1BoardDiv');
    const p2BoardDiv = document.getElementById('p2BoardDiv');

    p1BoardDiv.textContent = "";
    p2BoardDiv.textContent = "";
    p1BoardDiv.classList.remove("disabled");

    const boardsContainer = document.getElementById("boardsContainer");
    boardsContainer.classList.remove("disabled");

    const winH2 = document.getElementById("winH2");
    winH2.textContent = '';

    const playerTurnH1 = document.getElementById("playerTurnH1");
    playerTurnH1.textContent = "Player 1 turn";

    const dialog = document.querySelector("dialog");
    dialog.showModal();
};

const createTempBoard = () => {
    const board = new Gameboard();

    for (let i = 0; i < 10; i++) {
        const ship = new Ship(1);
        board.setCell(i, i, ship);
    }

    return board;
};

const handleEndGame = () => {
    const boardsContainer = document.getElementById("boardsContainer");
    boardsContainer.classList.add("disabled");

    //Checks which player won
    let stringPlayer;

    if (game.mode === "cpu" && game.turn === 2) {
        stringPlayer = "CPU";
    } else {
        stringPlayer = game.turn === 1 ? "Player 1" : "Player 2";
    }

    const winH2 = document.getElementById("winH2");
    winH2.textContent = `${stringPlayer} won the match. Good game!`;
};

export { setupGame }