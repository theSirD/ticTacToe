const playerFactory = (mark) => {
    let points = 0;
    const getPoints = () => {
        return points;
    }
    const playRound = () => {
        return new Promise((resolve) => { // Используем промис для ожидания выбора ячейки
            const gameBoardCells = document.querySelectorAll(".board-cell");
            let cellWasChosen = false;
            
            const cellClickHandler = (e) => {
                const cell = e.target;
                const firstIndex = cell.classList[1][5];
                const secondIndex = cell.classList[1][6];
                cellWasChosen = true;
                resolve({ firstIndex, secondIndex, mark });
            };

            gameBoardCells.forEach((cell) => {
                cell.addEventListener("click", cellClickHandler);
            });
        });
    };
    return {mark, getPoints, playRound};
}

const game = (() => {
    const gameBoard = (() => {
        const gameBoardCells = document.querySelectorAll(".board-cell");
        let board =[[2, 2, 2],
                [2, 2, 2],
                [2, 2, 2]];

        const renderField = (board) => {
            const gameBoardCells = document.querySelectorAll(".board-cell");
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === 2) continue;
                    else {
                        if (board[i][j] === 1) document.querySelector(`.data-${i}${j}`).insertAdjacentHTML("beforeend", "<p class='mark'>X</p>");
                        else document.querySelector(`.data-${i}${j}`).insertAdjacentHTML("beforeend", "<p class='mark'>O</p>");
                    }
                }
            }
        }

        const clearField = () => {
            console.log(board)
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = 2;
                    if (document.querySelector(".mark"))  document.querySelector(".mark").remove();
                    //
                }
            }
        };

        const markCell = (cellToMark) => {
            if (board[cellToMark.firstIndex][cellToMark.secondIndex] !== 2) return;
            board[cellToMark.firstIndex][cellToMark.secondIndex] = cellToMark.mark === "X" ? 1 : 0;
            renderField(board);
        }
    
        return {clearField, markCell};
    })();
    
    const playerO = playerFactory("O");
    const playerX = playerFactory("X");

    const startGame = () => {
        const startButton = document.querySelector("button[type='button']");
        startButton.addEventListener("click", async (e) => {
            gameBoard.clearField();
            let i = 0;
            while ((playerO.getPoints() !== 3) && (playerX.getPoints() !== 3)) {
                if (i % 2 === 0) {
                    const cellToMark = await playerX.playRound(); // Ожидание выбора ячейки
                    gameBoard.markCell(cellToMark);
                    ++i;
                } else {
                    const cellToMark = await playerO.playRound(); // Ожидание выбора ячейки
                    gameBoard.markCell(cellToMark);
                    ++i;
                }
            }
        });
    };
    
    return {startGame};  //change that 
})();

game.startGame()