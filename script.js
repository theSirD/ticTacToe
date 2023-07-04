const game = (() => {
    const gameBoard = (() => {
        let board =[[0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]];
        const clearField = () => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = 0;
                }
            }
        };
        const markCell = () => {
            // get info about cell first
        }

        return {clearField, marCell};
    })();

    return {};  //change that 
})();