const createCell = () => {
  let cellValue = "E";

  const isEmpty = () => cellValue === "E";

  const getCellValue = () => cellValue;

  const setCellValue = newValue => cellValue = newValue;

  const printCellValue = () => console.log(cellValue);

  return {isEmpty, getCellValue, setCellValue, printCellValue};
}

const GameBoard = (() =>  {
  const rows = 3;
  const columns = 3;
  const gameArr = [];

  for(let i = 0; i < rows; i++) {
    gameArr[i] = [];
    for(let j = 0; j < columns; j++) {
      gameArr[i].push(createCell());
    }
  }

  const marks = ["X", "O"]

  const determineGameOver = () => {
    let hasWon = false;
    marks.forEach(mark => {
      if(checkRows(mark) || checkColumns(mark) || checkDiagonals(mark)) {
        hasWon = true;
      }
    })
    console.log('local check');
    printBoard();
    return hasWon;
  }

  const checkRows = mark => {
    let hasWon = false;
    gameArr.forEach(row => {
      if(row.every(cell => cell.getCellValue() === mark)) {
        hasWon = true;
      }
    }) 
    return hasWon;
  }

  const checkColumns = mark => {
    let hasWon = false;
    for(let i = 0; i < rows; i++) {
      let columnValues = [];
      for(let j = 0; j < columns; j++) {
        columnValues.push((gameArr[j][i]).getCellValue());
      }
      if(columnValues.every(value => value === mark)) {
        hasWon = true;
      }
    } 
    return hasWon;
  }

  const checkDiagonals = mark => {
    let values1 = [];
    let values2 = [];
    for(let i = 0; i < columns; i++) {
      values1.push((gameArr[i][i]).getCellValue());
      values2.push(gameArr[(columns - 1) - i][i].getCellValue());
    } 
    return (values1.every(value => value == mark) || values2.every(value => value == mark));
  }

  const getGameArr = () => gameArr;

  const printBoard = () => {
    let res = gameArr.map(row => row.map(cell => cell.getCellValue()));
    console.table(res);
  }

  return {getGameArr, determineGameOver, printBoard};

})();

const createPlayer = (name) => {
  return {name};
}

const GameController = (() => {
  const player1 = createPlayer("Player1");
  const player2 = createPlayer("Player2");
  let currPlayer = player1;
  const board = GameBoard;

  const playRound = (x, y) => {
    let gameArr = board.getGameArr();
    if((gameArr[x][y]).isEmpty) {
      gameArr[x][y].setCellValue("X");
    } else {
      console.log('Cell is already taken')
    }
    board.printBoard();
    if(board.determineGameOver()) {
      console.log('game has ended')
    }
  }

  const switchPlayer = () => {
    if (currPlayer === player1) {
      currPlayer = player2;
    } else {
      currPlayer = player1;
    }
  }

  const getCurrPlayer = () => currPlayer;

  return {playRound, getCurrPlayer, board}
})();

GameController.playRound(2, 0);
GameController.playRound(1, 1);
GameController.playRound(0, 2);


