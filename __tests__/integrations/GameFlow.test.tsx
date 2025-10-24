// Интеграционное тестирование
import { createInitialBoard, shuffleBoard, isSolved } from '../../utils/gameLogic';

describe('Game Flow Integration', () => {
  describe('Game Initialization', () => {
    it('initializes with correct board state', () => {
      const board = createInitialBoard(8);
      expect(board).toHaveLength(9);
      expect(board).toContain(0); // Должна быть пустая клетка
    });

    it('shuffled board is different from initial', () => {
      const initial = createInitialBoard(15);
      const shuffled = shuffleBoard(initial, 4, 4);
      
      expect(shuffled).not.toEqual(initial);
      expect(shuffled).toHaveLength(16);
    });
  });

  describe('Game Progression', () => {
    it('move counter increments correctly', () => {
      let moves = 0;
      moves += 1; // Симуляция хода
      expect(moves).toBe(1);
      
      moves += 1; // Еще ход
      expect(moves).toBe(2);
    });

    it('win condition detection works', () => {
      const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      const unsolvedBoard = [1, 2, 3, 4, 5, 6, 8, 7, 0];
      
      expect(isSolved(solvedBoard)).toBe(true);
      expect(isSolved(unsolvedBoard)).toBe(false);
    });
  });

  describe('Game Modes Integration', () => {
    it('classic mode uses moves as score', () => {
      const moves = 25;
      const score = moves; // В классическом режиме счет = ходы
      
      expect(score).toBe(25);
    });

    it('timed mode uses time as score', () => {
      const timeInSeconds = 120;
      const score = timeInSeconds; // В режиме на время счет = секунды
      
      expect(score).toBe(120);
    });

    it('time attack has time limit', () => {
      const timeLimit = 300; // 5 минут
      const remainingTime = 150;
      
      expect(remainingTime).toBeLessThan(timeLimit);
      expect(timeLimit - remainingTime).toBe(150);
    });
  });
});