import { Gameboard, Player, Ship, CPU } from "./gameLogic";

const game = {
    mode: null,
    turn: 1,
    player1: null,
    player2: null
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

    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", resetGame);

    const randomizeBtn = document.getElementById("randomizeBtn");
    randomizeBtn.addEventListener("click", randomizeShips);
};

const resetGame = () => {
    resetElements('p1BoardDiv', 'p2BoardDiv', 'winH2');
    const p2BoardDiv = document.getElementById('p2BoardDiv');
    p2BoardDiv.classList.remove("disabled", "visible");

    const boardsContainer = document.getElementById("boardsContainer");
    boardsContainer.classList.remove("disabled");

    const playerTurnH1 = document.getElementById("playerTurnH1");
    playerTurnH1.textContent = "Player 1 turn";

    const randomizeBtn = document.getElementById("randomizeBtn");
    randomizeBtn.classList.remove("disabled");
    randomizeBtn.disabled = false;

    const dialog = document.querySelector("dialog");
    dialog.showModal();
};

//Search elements by id then empties them
const resetElements = (...elementsId) => {
    for (const elementId of elementsId) {
        const element = document.getElementById(`${elementId}`);
        element.textContent = '';
    }
}

//Place random ships on the board
const randomizeShips = () => {
    const gameboard = createRandomBoard();
    const gameboard1 = createRandomBoard();

    const player1 = game.player1;
    const player2 = game.player2;

    resetElements('p1BoardDiv', 'p2BoardDiv');
    player1.setBoard(gameboard);
    player2.setBoard(gameboard1);

    updateDOMElements();
};

const startGame = () => {
    const gameBoard = createRandomBoard();
    const gameBoard1 = createRandomBoard();

    //Creates the players
    const player1 = new Player(gameBoard);
    const player2 = game.mode === "player2" ? new Player(gameBoard1) : new CPU(gameBoard1);

    game.player1 = player1;
    game.player2 = player2;
    game.turn = 1;

    updateDOMElements();
};

const createRandomBoard = () => {
    const gameboard = new Gameboard();
    gameboard.placeRandomShips();
    return gameboard;
};

const updateDOMElements = () => {
    const p1BoardDiv = document.getElementById('p1BoardDiv');
    const p2BoardDiv = document.getElementById('p2BoardDiv');

    p1BoardDiv.classList.add("disabled", "visible");

    createBoard(game.player1, p1BoardDiv);
    createBoard(game.player2, p2BoardDiv);
};

const createBoard = (player, boardDiv) => {
    const gameboard = player.getBoard();
    const size = gameboard.getSize();
    const letters = "ABCDEFGHIJ";

    //Add a empty cell at the top left
    boardDiv.appendChild(document.createElement("span"));

    //Disable the randomize button only with the first click
    boardDiv.addEventListener("click", () => {
        const randomizeBtn = document.getElementById("randomizeBtn");
        randomizeBtn.disabled = true;
        randomizeBtn.classList.add('disabled');
    }, { once: true });

    for (let letter of letters) {
        createLetterSpan(boardDiv, letter);
    }

    //First creates cols then rows
    for (let y = 0; y < size; y++) {
        createNumberSpan(boardDiv, y);
        for (let x = 0; x < size; x++) {
            createCellBtn(boardDiv, x, y, player);
        }
    }
};

const createLetterSpan = (boardDiv, letter) => {
    const letterSpan = document.createElement("span");
    letterSpan.classList.add("cellLetter");
    letterSpan.textContent = letter;
    boardDiv.appendChild(letterSpan);
}

const createNumberSpan = (boardDiv, y) => {
    const numberSpan = document.createElement('span');
    numberSpan.classList.add("cellNumber");
    numberSpan.textContent = y + 1;
    boardDiv.appendChild(numberSpan);
}

const createCellBtn = (boardDiv, x, y, player) => {
    const gameboard = player.getBoard();
    const cellBtn = document.createElement('button');
    cellBtn.dataset.x = x;
    cellBtn.dataset.y = y;
    cellBtn.classList.add("cellBtn");
    cellBtn.addEventListener('click', (e) => updateCell(e, player));

    if (gameboard.getShip(x, y)) {
        cellBtn.classList.add("ship");
    }

    boardDiv.appendChild(cellBtn);
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
        btn.classList.add("miss");
    } else {
        btn.classList.remove("ship");
        btn.classList.add("hit");
    }

    //Checks if the game is over
    if (board.isGameOver()) {
        handleEndGame();
    } else {
        switchTurn();
    }
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

const switchTurn = () => {
    //Switchs turn
    game.turn = game.turn === 1 ? 2 : 1;
    updateTurnH1();
    updatePlayersBoards();
};

const updateTurnH1 = () => {
    const playerTurnH1 = document.getElementById("playerTurnH1");
    let stringPlayer;

    if (game.mode === "cpu" && game.turn === 2) {
        stringPlayer = "CPU";
    } else {
        stringPlayer = game.turn === 1 ? "Player 1" : "Player 2";
    }

    //Updates player turn on screen
    playerTurnH1.textContent = `${stringPlayer} turn`;
}

const updatePlayersBoards = () => {
    const p1BoardDiv = document.getElementById('p1BoardDiv');
    const p2BoardDiv = document.getElementById('p2BoardDiv');
    const resetBtn = document.getElementById("resetBtn");

    //If the game mode is two players
    if (game.mode !== "cpu") {
        p1BoardDiv.classList.toggle("disabled");
        p2BoardDiv.classList.toggle("disabled");

        p1BoardDiv.classList.toggle("visible");
        p2BoardDiv.classList.toggle("visible");
        return;
    }

    //If it is the CPU turn
    if (game.turn === 2) {
        p1BoardDiv.classList.add("disabled");
        p2BoardDiv.classList.add("disabled");

        //Disables the reset button to prevent any possible bug
        resetBtn.disabled = true;
        resetBtn.classList.add("disabled");

        playCPUMove(resetBtn);
    } else {
        p2BoardDiv.classList.remove("disabled");
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playCPUMove = async (resetBtn) => {
    //The delay will take a random value between 750ms and 2500 ms
    const randomDelayms = Math.floor(Math.random() * (2500 - 750)) + 750;
    await delay(randomDelayms);

    const board = game.player1.getBoard();
    const move = game.player2.getMove(board);
    const container = document.getElementById("p1BoardDiv");
    const btn = container.querySelector(`[data-x="${move.x}"][data-y="${move.y}"]`);
    btn.click();
    resetBtn.disabled = false;
    resetBtn.classList.remove("disabled");
};

export { setupGame }