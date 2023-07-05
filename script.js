const playerFactory = (mark) => {
    let points = 0;
    const setPointsToZero = () => {
        points = 0;
    }
    const showPoints = () => {
        return points;
    }
    const getAPoint =() => {
        ++points;
    }
    const playRound = () => {
        return new Promise((resolve) => { // почему-то зацикливается
            const gameBoardCells = document.querySelectorAll(".board-cell");
            
            const cellClickHandler = (e) => {
                const cell = e.target;
                console.log(cell.classList[1])
                const firstIndex = cell.classList[1][5];
                const secondIndex = cell.classList[1][6];
               
                resolve({ firstIndex, secondIndex, mark });
            };

            gameBoardCells.forEach((cell) => {
                cell.addEventListener("click", cellClickHandler);
            });
        });
    };
    return {mark, showPoints, playRound, getAPoint, setPointsToZero};
}

const game = (() => {
    const gameBoard = (() => {
        const gameBoardCells = document.querySelectorAll(".board-cell");
        let board =[[2, 2, 2],
                [2, 2, 2],
                [2, 2, 2]];
        let winner;
        const renderField = () => {
            const gameBoardCells = document.querySelectorAll(".board-cell");
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === 2) continue;
                    else {
                        if (board[i][j] === 1) {
                            if (!document.querySelector(`.data-${i}${j}`).hasChildNodes()) {
                                document.querySelector(`.data-${i}${j}`).insertAdjacentHTML("beforeend", "<p class='mark'>X</p>");
                            }
                        }
                        else {
                            if (!document.querySelector(`.data-${i}${j}`).hasChildNodes()) {
                                document.querySelector(`.data-${i}${j}`).insertAdjacentHTML("beforeend", "<p class='mark'>O</p>");
                            }
                        }
                    }
                }
            }
        }

        const clearField = () => {

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = 2;
                    if (document.querySelector(".mark"))  document.querySelector(".mark").remove();
                }
            }
        };

        const markCell = (cellToMark) => {
            if (board[cellToMark.firstIndex][cellToMark.secondIndex] !== 2) return;
            board[cellToMark.firstIndex][cellToMark.secondIndex] = cellToMark.mark === "X" ? 1 : 0;
            renderField();
        }

        const checkIfRoundIsOver = () => {
            for (let i = 0; i < 3; i++) {
                if (board[i].join("") === "000") {
                    playerO.getAPoint();
                    clearField();
                    renderScore();
                    break;
                }
                if (board[i].join("") === "111") {
                    playerX.getAPoint();
                    clearField();
                    renderScore();
                    break;
                }
            }

            for (let i = 0; i < 3; i++) {
                if ([board[0][i], board[1][i], board[2][i]].join("") === "000") {
                    playerO.getAPoint();
                    clearField();
                    renderScore();
                    break;
                }
                if ([board[0][i], board[1][i], board[2][i]].join("") === "111") {
                    playerX.getAPoint();
                    clearField();
                    renderScore();
                    break;
                }
            }

            if ([board[0][0], board[1][1], board[2][2]].join("") === "000") {
                playerO.getAPoint();
                clearField();
                renderScore();
            }
            if ([board[0][0], board[1][1], board[2][2]].join("") === "111") {
                playerX.getAPoint();
                clearField();
                renderScore();
            }
            if ([board[0][2], board[1][1], board[2][0]].join("") === "000") {
                playerO.getAPoint();
                clearField();
                renderScore();
            }
            if ([board[0][2], board[1][1], board[2][0]].join("") === "111") {
                playerX.getAPoint();
                clearField();
                renderScore();
            }

           

            checkIfGameIsOver();
        }

        const checkIfGameIsOver = () => {
            if (playerO.showPoints === 3) {
                displayWinner("First");
                gameBoard.clearField();
            }
            if (playerX.showPoints === 3) {
                displayWinner("Second");
                gameBoard.clearField();
            }
            
            
        }

    
        return {clearField, markCell, checkIfRoundIsOver};
    })();
    
    const playerO = playerFactory("O");
    const playerX = playerFactory("X");

    const startGame = () => {
        playerO.setPointsToZero();
        playerX.setPointsToZero();
        renderScore();
        const startButton = document.querySelector("button[type='button']");
        startButton.addEventListener("click", async (e) => {
            gameBoard.clearField();
            let i = 0;
            while ((playerO.showPoints() !== 3) && (playerX.showPoints() !== 3)) {
                if (i % 2 === 0) {
                    const cellToMark = await playerX.playRound(); 
                    gameBoard.markCell(cellToMark);
                    gameBoard.checkIfRoundIsOver();
                    ++i;
                } else {
                    const cellToMark = await playerO.playRound(); 
                    gameBoard.markCell(cellToMark);
                    gameBoard.checkIfRoundIsOver();
                    ++i;
                }
            }
        });
    };

    const displayWinner = (name) => {
        console.log(name);
    }
    
    const renderScore = () => {
        const score = document.querySelectorAll(".player-info");
        const scoreO = score[0];
        scoreO.innerHTML = "";
        scoreO.insertAdjacentHTML("beforeend", "<h1>FIRST</h1>");
        scoreO.insertAdjacentHTML("beforeend", `<h1 class='score'>${playerO.showPoints()}</h1>`);

        const scoreX = score[1];
        scoreX.innerHTML = "";
        scoreX.insertAdjacentHTML("beforeend", "<h1>SECOND</h1>");
        scoreX.insertAdjacentHTML("beforeend", `<h1 class='score'>${playerX.showPoints()}</h1>`);
    }

    return {startGame};  
})();

game.startGame()
// game.renderScore()
// game.renderScore()