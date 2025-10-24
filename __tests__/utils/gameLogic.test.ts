// Модульное тестирование
import { 
  createInitialBoard, 
  createTestBoard, 
  shuffleBoard, 
  isSolved, 
  isSolvable 
} from '../../utils/gameLogic';

describe('Модульное тестирование', () => {
  describe('createInitialBoard', () => {
    it('Доска генерируется с корректным количеством плиток', () => {
      const board = createInitialBoard(8);
      expect(board).toHaveLength(9); // 8 tails + 1 empty
      expect(board).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    });

    it('Доска может генерироваться с разным количеством плиток', () => {
      const board15 = createInitialBoard(15);
      expect(board15).toHaveLength(16);
      
      const board24 = createInitialBoard(24);
      expect(board24).toHaveLength(25);
    });
  });

  describe('createTestBoard', () => {
    it('В тестовом режиме доска размером 3 на 3', () => {
      const board = createTestBoard(8);
      expect(board).toHaveLength(9);
      // Test board should have last two elements swapped
      expect(board[7]).toBe(0);
      expect(board[8]).toBe(8);
    });
  });

  describe('isSolved', () => {
    it('Доску возможно собрать (состояние)', () => {
      const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      expect(isSolved(solvedBoard)).toBe(true);
    });

    it('Доска может быть несобранной (состояние)', () => {
      const unsolvedBoard = [1, 2, 3, 4, 5, 6, 8, 7, 0];
      expect(isSolved(unsolvedBoard)).toBe(false);
    });

    it('Пустой плиткой является последняя в комбинации', () => {
      const boardWithEmptyLast = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      expect(isSolved(boardWithEmptyLast)).toBe(true);
    });
  });

  describe('isSolvable', () => {
    it('Должен возвращать значение true для разрешимой конфигурации', () => {
      const solvableBoard = [1, 2, 3, 4, 5, 6, 0, 7, 8];
      expect(isSolvable(solvableBoard, 3, 3)).toBe(true);
    });

    it('должен возвращать значение fasle для неразрешимой конфигурации', () => {
      const unsolvableBoard = [1, 2, 3, 4, 5, 6, 8, 7, 0];
      expect(isSolvable(unsolvableBoard, 3, 3)).toBe(false);
    });
  });

  describe('shuffleBoard', () => {
    it('Должна создаваться доска соответсвующего размера', () => {
      const initialBoard = createInitialBoard(8);
      const shuffled = shuffleBoard(initialBoard, 3, 3);
      expect(shuffled).toHaveLength(9);
    });

    it('Должна создаваться разрешимая достка', () => {
      const initialBoard = createInitialBoard(15);
      const shuffled = shuffleBoard(initialBoard, 4, 4);
      expect(isSolvable(shuffled, 4, 4)).toBe(true);
    });
  });
});