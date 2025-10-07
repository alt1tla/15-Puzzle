// utils/gameLogic.ts

// Функция создания начального игрового поля с числами по порядку
export const createInitialBoard = (tails: number): number[] => {
  return [...Array(tails).keys()].map(i => i + 1).concat(0);
};

// Функция создания тестового поля для отладки
export const createTestBoard = (tails: number): number[] => {
  const solvedBoard = createInitialBoard(tails);
  if (tails === 8) {
    const testBoard = [...solvedBoard];
    [testBoard[7], testBoard[8]] = [testBoard[8], testBoard[7]];
    return testBoard;
  }
  return solvedBoard;
};

// Функция проверки решаемости головоломки
export const isSolvable = (board: number[], rows: number, columns: number): boolean => {
  let inversions = 0;
  const flatBoard = board.filter(cell => cell !== 0);

  for (let i = 0; i < flatBoard.length; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i] > flatBoard[j]) inversions++;
    }
  }

  if (rows % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRowFromBottom = rows - Math.floor(board.indexOf(0) / rows);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }
};

// Умная функция перемешивания, гарантирующая решаемость
export const shuffleBoard = (initialBoard: number[], rows: number, columns: number): number[] => {
  let shuffled;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    shuffled = [...initialBoard];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;

    if (attempts > maxAttempts) {
      const tempBoard = [...initialBoard];
      const emptyIndex = tempBoard.indexOf(0);
      const possibleMoves = [];

      const emptyRow = Math.floor(emptyIndex / rows);
      const emptyCol = emptyIndex % columns;

      if (emptyRow > 0) possibleMoves.push(emptyIndex - columns);
      if (emptyRow < rows - 1) possibleMoves.push(emptyIndex + columns);
      if (emptyCol > 0) possibleMoves.push(emptyIndex - 1);
      if (emptyCol < columns - 1) possibleMoves.push(emptyIndex + 1);

      let currentBoard = [...tempBoard];
      for (let i = 0; i < 20; i++) {
        const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const emptyIdx = currentBoard.indexOf(0);
        [currentBoard[moveIndex], currentBoard[emptyIdx]] = [currentBoard[emptyIdx], currentBoard[moveIndex]];
      }
      return currentBoard;
    }
  } while (!isSolvable(shuffled, rows, columns));

  return shuffled;
};

// Функция проверки, решена ли головоломка
export const isSolved = (currentBoard: number[]): boolean => {
  return currentBoard.every((cell, index) => {
    if (index === currentBoard.length - 1) {
      return cell === 0;
    }
    return cell === index + 1;
  });
};
