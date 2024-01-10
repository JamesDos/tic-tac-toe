const createCell = () => {
  let cellValue = "";

  const isEmpty = () => cellValue === "";

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

  const determineTie = () => {
    let tied = true;
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < columns; j++) {
        if(gameArr[i][j].getCellValue() === "") {
          tied = false;
        }
      }
    }
    return tied;
  }

  const resetBoard = () => {
    for(let i = 0; i < columns; i++) {
      for(let j = 0; j < columns; j++) {
        gameArr[i][j].setCellValue("");
      }
    }
  }

  const setTile = (i, j, mark) => gameArr[i][j].setCellValue(mark);

  const getTileAt = (i, j) => gameArr[i][j];
  
  const getGameArr = () => gameArr;

  const printBoard = () => {
    let res = gameArr.map(row => row.map(cell => cell.getCellValue()));
    console.table(res);
  }

  return {determineGameOver, determineTie, resetBoard, setTile, getTileAt, getGameArr, printBoard, };

})();

const createPlayer = (name, bot) => {

  const isBot = () => bot === true;

  const getName = () => name;

  const selectTile = () => {
    if(isBot()) {
      let iVal = Math.floor(Math.random() * 3);
      let jVal =  Math.floor(Math.random() * 3);
      return {iVal, jVal};
    }
  }

  return {getName, isBot, selectTile};
}

const GameController = (() => {
  let player1 = createPlayer("Player1", false);
  let player2 = createPlayer("Player2", false);
  let currPlayer = player1;
  const board = GameBoard;
  const gameStates = ["Playing", "End"];
  let gameState = "Playing";

  let getGameState = () => gameState;

  const getGameStateMsg = () => {
    if(board.determineGameOver()) {
      return `Game has ended: ${getCurrPlayer().getName()} has won`;
    } else if (board.determineTie()) {
      return 'Game is a draw';
    } else {
      return `${currPlayer.getName()}'s turn`;
    }
  }

  const setGameState = state => gameState = state;

  const playRound = (i, j) => {
    if(getGameState() === "Playing") {
      if(board.getTileAt(i, j).isEmpty()) {
        if(currPlayer === player1) {
          board.setTile(i, j, "X");
        } else {
          board.setTile(i, j, "O");
        }
        determineGameState();
      } else {
        console.log('Cell is already taken')
      }
    }
    board.printBoard();
  }

  const playRoundBot = (i, j) => {
    if(getGameState() === "Playing") {
      if (board.getTileAt(i, j).isEmpty()) {
        board.setTile(i, j, "X");
        determineGameState();
        if(getGameState() === "Playing") {
          let botChoice = player2.selectTile();
          while(!(board.getTileAt(botChoice.iVal, botChoice.jVal).isEmpty())) {
            botChoice = player2.selectTile();
          }
          board.setTile(botChoice.iVal, botChoice.jVal, "O");
          determineGameState();
        }
      }
    } else {
      console.log('Cell is already taken')
    }
  }

  const determineGameState = () => {
    if(board.determineGameOver()) {
      setGameState(gameStates[1]);
      console.log(`Game has ended: ${getCurrPlayer().getName()} has won`);
    } else if (board.determineTie()) {
      setGameState(gameStates[1]);
      console.log('Game is a draw')
    } else {
      switchPlayer();
      console.log(`${currPlayer.getName()}'s turn`);
    }
  }

  const switchPlayer = () => {
    if (currPlayer === player1) {
      currPlayer = player2;
    } else {
      currPlayer = player1;
    }
  }

  const resetGame = () => {
    board.resetBoard();
    currPlayer = player1;
    setGameState(gameStates[0]);
  }

  const getCurrPlayer = () => currPlayer;

  const setPlayer2 = (name, isBot) => {
    if(isBot) {
      player2 = createPlayer("Computer", true);
    } else {
      player2 = createPlayer(name, false);
    }
  }

  return {playRound, playRoundBot, getGameStateMsg, getCurrPlayer, resetGame, setPlayer2}
})();


const DisplayGame = (() => {
  const resetButton = document.querySelector('#reset-btn');
  const gameboardHtml = document.querySelector('.gameboard');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const playerSelection = document.querySelector('#player-select');
  const gameStateLabel = document.querySelector('.game-state');

  tiles.forEach(tile => tile.addEventListener('click', () => selectCell(tile)));

  const renderBoard = () => {
    clearBoard();
    let gameboard = GameBoard.getGameArr();
    gameboard.forEach((row, i) => {
      row.forEach((cell, j) => {
        generateCell(cell.getCellValue(), i, j);
      })
    })
  }

  const generateCell = (mark, i, j) => {
    let div = document.createElement('div');
    div.classList.add('tile');
    div.setAttribute('data-tile', mark);
    div.setAttribute('data-ipos', String(i));
    div.setAttribute('data-jpos', String(j));
    div.textContent = mark;
    div.addEventListener('click', () => selectCell(div));
    gameboardHtml.appendChild(div);
  }

  const clearBoard = () => {
    gameboardHtml.innerHTML = '';
  }

  const selectCell = tile => {
    console.log(tile);
    let iPos = parseInt(tile.dataset.ipos);
    let jPos = parseInt(tile.dataset.jpos);
    console.log(iPos, jPos);
    if(playerSelection.value === "player") {
      GameController.playRound(iPos, jPos);
    }
    if(playerSelection.value === "computer") {
      GameController.playRoundBot(iPos, jPos);
    }
    renderBoard();
    updateGameStateLabel();
  }

  const switchGameMode = () => {
    const player2 = playerSelection.value;
    if (player2 === "player") {
      GameController.setPlayer2("Player2", false);
    } if (player2 === "computer") {
      GameController.setPlayer2("Player2", true);
    }
    resetBoard();
    updateGameStateLabel();
  }

  playerSelection.addEventListener('change', switchGameMode);

  const resetBoard = () => {
    GameController.resetGame();
    renderBoard();
    updateGameStateLabel();
  }

  resetButton.addEventListener('click', resetBoard);

  const updateGameStateLabel = () => {
    let msg = GameController.getGameStateMsg();
    gameStateLabel.textContent = msg;
  }
})();


// tying 
// GameController.playRound(1, 1);
// GameController.playRound(0, 0);
// GameController.playRound(1, 0);
// GameController.playRound(1, 2);
// GameController.playRound(2, 2);
// GameController.playRound(2, 1);
// GameController.playRound(2, 0);
// GameController.playRound(0, 2);
// GameController.playRound(0, 1);

// X wins
// GameController.playRound(0, 0);
// GameController.playRound(1, 0);
// GameController.playRound(0, 1);
// GameController.playRound(1, 1);
// GameController.playRound(0, 2);

// O wins
  // GameController.playRound(0, 2);
  // GameController.playRound(0, 0);
  // GameController.playRound(0, 1);
  // GameController.playRound(1, 0);
  // GameController.playRound(1, 1);
  // GameController.playRound(2, 0);



