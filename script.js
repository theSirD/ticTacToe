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
                const firstIndex = cell.classList[1][5];
                const secondIndex = cell.classList[1][6];
               
                resolve({ firstIndex, secondIndex, mark });
            };

            gameBoardCells.forEach((cell) => {
                cell.addEventListener("click", cellClickHandler);
            });
        });
    };
    return {mark, showPoints, playRound, getAPoint, setPointsToZero, points};
}

const game = (() => {
    

    const gameBoard = (() => {
        const gameBoardCells = document.querySelectorAll(".board-cell");
        let board =[[2, 2, 2],
                [2, 2, 2],
                [2, 2, 2]];
        
        
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
                    numberOfTurn = 0;
                    return;
                }
                if (board[i].join("") === "111") {
                    playerX.getAPoint();
                    clearField();
                    renderScore();
                    numberOfTurn = 0;
                    return;
                }
            }

            for (let i = 0; i < 3; i++) {
                if ([board[0][i], board[1][i], board[2][i]].join("") === "000") {
                    playerO.getAPoint();
                    clearField();
                    renderScore();
                    numberOfTurn = 0;
                    return;
                }
                if ([board[0][i], board[1][i], board[2][i]].join("") === "111") {
                    playerX.getAPoint();
                    clearField();
                    renderScore();
                    numberOfTurn = 0;
                    return;
                }
            }

            if ([board[0][0], board[1][1], board[2][2]].join("") === "000") {
                playerO.getAPoint();
                clearField();
                renderScore();
                numberOfTurn = 0;
                return
            }
            if ([board[0][0], board[1][1], board[2][2]].join("") === "111") {
                playerX.getAPoint();
                clearField();
                renderScore();
                numberOfTurn = 0;
                return
            }
            if ([board[0][2], board[1][1], board[2][0]].join("") === "000") {
                playerO.getAPoint();
                clearField();
                renderScore();
                numberOfTurn = 0;
                return
            }
            if ([board[0][2], board[1][1], board[2][0]].join("") === "111") {
                playerX.getAPoint();
                clearField();
                renderScore();
                numberOfTurn = 0;
                return
            }

            let fl = true;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] ===2) {
                        fl = false;
                        break;
                    }
                    
                }
            }
            if (fl) {
                clearField();
            }




            checkIfGameIsOver();
        }


        const checkIfGameIsOver = () => {
            if (playerO.showPoints() === 3) {
                displayWinner("First");
                playerO.setPointsToZero();
                playerX.setPointsToZero();
                renderScore();
                gameBoard.clearField();
            }
            if (playerX.showPoints() === 3) {
                displayWinner("Second");
                playerO.setPointsToZero();
                playerX.setPointsToZero();
                renderScore();
                gameBoard.clearField();
            }
        }

    
        return {clearField, markCell, checkIfRoundIsOver};
    })();
    
    let numberOfTurn = 0;
    const playerO = playerFactory("O");
    const playerX = playerFactory("X");

    const startGame = () => {
        const startButton = document.querySelector("button[type='button']");
        startButton.addEventListener("click", async (e) => {
            playerO.setPointsToZero();
            playerX.setPointsToZero();
            renderScore();
            gameBoard.clearField();
            while ((playerO.showPoints() !== 3) && (playerX.showPoints() !== 3)) {
                if (numberOfTurn % 2 === 0) {
                    const cellToMark = await playerX.playRound(); 
                    gameBoard.markCell(cellToMark);
                    ++numberOfTurn;
                    gameBoard.checkIfRoundIsOver();
                } else {
                    const cellToMark = await playerO.playRound(); 
                    gameBoard.markCell(cellToMark);
                    ++numberOfTurn;
                    gameBoard.checkIfRoundIsOver();
                }
            }
        });
    };

    const displayWinner = (name) => {
        console.log(name);
    }
    
    const renderScore = () => {
        const score = document.querySelectorAll(".player-info");
        const playerOInfo = score[0];
        playerOInfo.innerHTML = "";
        playerOInfo.insertAdjacentHTML("beforeend", "<h1>FIRST</h1>");
        playerOInfo.insertAdjacentHTML("beforeend", `<h1 class='score'>${playerO.showPoints()}</h1>`);

        const playerXInfo = score[1];
        playerXInfo.innerHTML = "";
        playerXInfo.insertAdjacentHTML("beforeend", "<h1>SECOND</h1>");
        playerXInfo.insertAdjacentHTML("beforeend", `<h1 class='score'>${playerX.showPoints()}</h1>`);
    }

    return {startGame};  
})();

game.startGame()
// game.renderScore()
// game.renderScore()