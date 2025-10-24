// Модульное тестирование
import { 
  createInitialBoard, 
  createTestBoard, 
  shuffleBoard, 
  isSolved, 
  isSolvable 
} from '../../utils/gameLogic';

describe('Game Logic Utilities', () => {
  describe('createInitialBoard', () => {
    it('should create board with correct number of tails', () => {
      const board = createInitialBoard(8);
      expect(board).toHaveLength(9); // 8 tails + 1 empty
      expect(board).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    });

    it('should handle different board sizes', () => {
      const board15 = createInitialBoard(15);
      expect(board15).toHaveLength(16);
      
      const board24 = createInitialBoard(24);
      expect(board24).toHaveLength(25);
    });
  });

  describe('createTestBoard', () => {
    it('should create test board for 3x3', () => {
      const board = createTestBoard(8);
      expect(board).toHaveLength(9);
      // Test board should have last two elements swapped
      expect(board[7]).toBe(0);
      expect(board[8]).toBe(8);
    });
  });

  describe('isSolved', () => {
    it('should return true for solved board', () => {
      const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      expect(isSolved(solvedBoard)).toBe(true);
    });

    it('should return false for unsolved board', () => {
      const unsolvedBoard = [1, 2, 3, 4, 5, 6, 8, 7, 0];
      expect(isSolved(unsolvedBoard)).toBe(false);
    });

    it('should handle empty last position', () => {
      const boardWithEmptyLast = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      expect(isSolved(boardWithEmptyLast)).toBe(true);
    });
  });

  describe('isSolvable', () => {
    it('should return true for solvable configuration', () => {
      const solvableBoard = [1, 2, 3, 4, 5, 6, 0, 7, 8];
      expect(isSolvable(solvableBoard, 3, 3)).toBe(true);
    });

    it('should return false for unsolvable configuration', () => {
      const unsolvableBoard = [1, 2, 3, 4, 5, 6, 8, 7, 0];
      expect(isSolvable(unsolvableBoard, 3, 3)).toBe(false);
    });
  });

  describe('shuffleBoard', () => {
    it('should return board of same length', () => {
      const initialBoard = createInitialBoard(8);
      const shuffled = shuffleBoard(initialBoard, 3, 3);
      expect(shuffled).toHaveLength(9);
    });

    it('should return solvable board', () => {
      const initialBoard = createInitialBoard(15);
      const shuffled = shuffleBoard(initialBoard, 4, 4);
      expect(isSolvable(shuffled, 4, 4)).toBe(true);
    });
  });
});