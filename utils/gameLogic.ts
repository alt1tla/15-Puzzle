// utils/gameLogic.ts

// Функция создания начального игрового поля с числами по порядку
export const createInitialBoard = (tails: number): number[] => {
  return [...Array(tails).keys()].map((i) => i + 1).concat(0);
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

// utils/gameLogic.ts

// Проверка решаемости головоломки
export const isSolvable = (
  board: number[],
  rows: number,
  columns: number
): boolean => {
  let inversions = 0;
  const flatBoard = board.filter((cell) => cell !== 0);

  for (let i = 0; i < flatBoard.length; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i] > flatBoard[j]) inversions++;
    }
  }

  if (rows % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRowFromBottom = rows - Math.floor(board.indexOf(0) / columns);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }
};

// Создание перемешанного решаемого поля
export const shuffleBoard = (
  initialBoard: number[],
  rows: number,
  columns: number
): number[] => {
  let board = [...initialBoard];

  // Перемешиваем массив случайно
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  // Если доска четная и не решаема — меняем местами две любые плитки кроме нуля
  if (!isSolvable(board, rows, columns) && rows % 2 === 0) {
    let idx1 = 0;
    let idx2 = 1;

    // убедимся, что это не нули
    if (board[idx1] === 0) idx1++;
    if (board[idx2] === 0) idx2++;

    [board[idx1], board[idx2]] = [board[idx2], board[idx1]];
  }

  return board;
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
