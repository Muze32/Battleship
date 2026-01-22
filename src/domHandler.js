import { Gameboard } from "./gameLogic";

const createBoard = (gameboard, boardDiv) => {
    const size = gameboard.getSize();
    for (let y = size - 1; y >= 0; y--) {
        const rowDiv = document.createElement('div');
        for (let x = 0; x < size; x++) {
            const cellBtn = createCellBtn(x, y);
            rowDiv.appendChild(cellBtn);
        }
        boardDiv.appendChild(rowDiv);
    }
};

const createCellBtn = (x, y) => {
    const cellBtn = document.createElement('button');
    cellBtn.dataset.x = x;
    cellBtn.dataset.y = y;
    cellBtn.textContent = "suisei";
    cellBtn.addEventListener('click', (e) => updateCell(e));
    return cellBtn;
}

const updateBoard = (gameboard, boardDiv) => {
    const size = gameboard.getSize();
    const rowDivs = boardDiv.children;
    for (let y = size - 1; y >= 0; y--) {
        const btns = rowDivs[i].children;
        for (let x = 0; x < size; x++) {
            btns[j].textContent = gameboard.getShip(x, y);
        }
    }

};


const updateCell = (e) => {
    const btn = e.target;
    console.log(btn);
};

const test = (x, y) => {
    let idlePlayer;
    idlePlayer.getBoard().receiveAttack(x, y);

}

export { createBoard, updateBoard }