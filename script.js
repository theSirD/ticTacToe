const playerFactory = (mark) => {
    let points = 0;
    const getPoints = () => {
        return points;
    }
    const playRound = (mark) => {
        const gameBoardCells = document.querySelectorAll(".board-cell");
        let cellWasChosen = false;
        while (!false) {
            gameBoardCells.forEach(cell => {
                cell.addEventListener("click", (e) => {
                    const firstIndex = cell.classList[1][0];
                    const  secondIndex = cell.classList[1][1];
                    cellWasChosen = true;
                    return {firstIndex, secondIndex, mark};
                })
            });
        }
    }
    return {mark, getPoints, playRound};
}

const game = (() => {
    const gameBoard = (() => {
        const gameBoardCells = document.querySelectorAll(".board-cell");
        let board =[[null, null, null],
                [null, null, null],
                [null, null, null]];

        const renderField = (board, gameBoardCells) => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === null) continue;
                    else {
                        if (board[i][j] === 1) gameBoardCells[i][j].insertAdjacentHTML("beforeend", "<p class='mark'>X</p>");
                        else gameBoardCells[i][j].insertAdjacentHTML("beforeend", "<p class='mark'>O</p>");
                    }
                }
            }
        }

        const clearField = (board) => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = null;
                   document.querySelector("mark").remove();
                }
            }
        };

        const markCell = (cellToMark) => {
            if (board[cellToMark.firstIndex][cellToMark.secondIndex] !== null) return;
            board[cellToMark.firstIndex][cellToMark.secondIndex] = cellToMark.mark === "X" ? 1 : 0;
            renderField();
        }
    
        return {clearField, markCell};
    })();
    
    const playerO = playerFactory("O");
    const playerX = playerFactory("X");

    const startGame = () => {
        const startButton = document.querySelector("button[type='button']");
        startButton.addEventListener("click", (e) => {
            let i = 0;
            while ((playerO.getPoints() !== 3) && (playerX.getPoints() !== 3)) {
                if (i % 2 === 0) {
                    const cellToMark = playerX.playRound();
                    gameBoard.markCell(cellToMark);
                    ++i;
                } else {
                    const cellToMark = playerO.playRound();
                    gameBoard.markCell(cellToMark);
                    ++i;
                }
            }
        })
    }
    return {startGame};  //change that 
})();

game.startGame()