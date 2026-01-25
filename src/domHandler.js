import { Gameboard, Player, Ship } from "./gameLogic";

const createBoard = (player, boardDiv) => {
    const gameboard = player.getBoard();
    const size = gameboard.getSize();
    for (let y = 0; y < size; y++) {
        const rowDiv = document.createElement('div');
        for (let x = 0; x < size; x++) {
            const cellBtn = createCellBtn(x, y, player);
            rowDiv.appendChild(cellBtn);
        }
        boardDiv.appendChild(rowDiv);
    }
};

const createCellBtn = (x, y, player) => {
    const cellBtn = document.createElement('button');
    cellBtn.dataset.x = x;
    cellBtn.dataset.y = y;
    cellBtn.textContent = "suisei";
    cellBtn.addEventListener('click', (e) => updateCell(e, player));
    return cellBtn;
}

const startGame = () => {
    const gameBoard = createTempBoard();
    const gameBoard1 = createTempBoard();

    const player1 = new Player(gameBoard);
    const player2 = new Player(gameBoard1, true);
    const p1BoardDiv = document.getElementById('p1Board');
    const p2BoardDiv = document.getElementById('p2Board');

    createBoard(player1, p1BoardDiv);
    createBoard(player2, p2BoardDiv);
};

const createTempBoard = () => {
    const board = new Gameboard();

    for (let i = 0; i < 10; i++) {
        const ship = new Ship(1);
        board.setCell(i, i, ship);
    }

    return board;
};

const updateCell = (e, player) => {
    const btn = e.target;
    const board = player.getBoard();
    const x = e.target.dataset.x, y = e.target.dataset.y;
    board.receiveAttack(x, y);

    btn.classList.add("marked");
    btn.disabled = true;

    if (board.getShip(x, y) === null) {
        btn.classList.add("water");
    } else {
        btn.classList.add("ship");
    }
};

export { createBoard, startGame }