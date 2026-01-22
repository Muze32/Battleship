import { Gameboard, Player } from "./gameLogic";

let players;

const createBoard = (player, boardDiv) => {
    const gameboard = player.getBoard();
    const size = gameboard.getSize();
    for (let y = size - 1; y >= 0; y--) {
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

const updateBoard = (gameboard, boardDiv) => {
    const size = gameboard.getSize();
    const rowDivs = boardDiv.children;
    for (let y = size - 1; y >= 0; y--) {
        const btns = rowDivs[y].children;
        for (let x = 0; x < size; x++) {
            btns[x].textContent = gameboard.getShip(x, y);
        }
    }

};

const startGame = () => {
    const player1 = new Player();
    const player2 = new Player(true);
    const p1BoardDiv = document.getElementById('p1Board');
    const p2BoardDiv = document.getElementById('p2Board');
    createBoard(player1, p1BoardDiv);
    createBoard(player2, p2BoardDiv);

    updateBoard(player1.getBoard(), p1BoardDiv);
    updateBoard(player2.getBoard(), p2BoardDiv);

};

const updateCell = (e, test) => {
    const btn = e.target;
    console.log(btn);
    console.log(test);
};

const test = (x, y) => {
    let idlePlayer;
    idlePlayer.getBoard().receiveAttack(x, y);

}

const switchTurn = (currentPlayer) => {
    if (!currentPlayer) currentPlayer = players[0];
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
}


export { createBoard, updateBoard, startGame }