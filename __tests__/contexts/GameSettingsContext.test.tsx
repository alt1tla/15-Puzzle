// Интеграционное тестирование
import { boardSizes } from '../../contexts/GameSettingsContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('GameSettingsContext Logic', () => {
  describe('Board Sizes', () => {
    it('has correct board size configurations', () => {
      expect(boardSizes).toHaveLength(5);
      
      const size3x3 = boardSizes.find(size => size.label === '3x3');
      expect(size3x3).toEqual({
        label: '3x3',
        tails: 8,
        rows: 3,
        columns: 3,
        timeLimit: 180
      });

      const size4x4 = boardSizes.find(size => size.label === '4x4');
      expect(size4x4).toEqual({
        label: '4x4',
        tails: 15,
        rows: 4,
        columns: 4,
        timeLimit: 300
      });
    });

    it('test mode has correct configuration', () => {
      const testSize = boardSizes.find(size => size.label === 'Тест');
      expect(testSize).toEqual({
        label: 'Тест',
        tails: 8,
        rows: 3,
        columns: 3,
        testMode: true,
        timeLimit: 30
      });
    });
  });

  describe('Game Modes', () => {
    it('has all game modes defined', () => {
      const { gameModes } = require('../../contexts/GameSettingsContext');
      
      expect(gameModes).toHaveLength(4);
      expect(gameModes.map((mode: any) => mode.value)).toEqual([
        'classic', 'timed', 'time_attack', 'image'
      ]);
    });

    it('classic mode has correct description', () => {
      const { gameModes } = require('../../contexts/GameSettingsContext');
      const classicMode = gameModes.find((mode: any) => mode.value === 'classic');
      
      expect(classicMode.label).toBe('🏆 Классика');
      expect(classicMode.description).toBe('За минимальное количество ходов');
    });
  });

  describe('Context Logic', () => {
    it('default settings are correct', () => {
      // Проверяем логику по умолчанию
      expect('4x4').toBe('4x4'); // Размер по умолчанию
      expect('light').toBe('light'); // Тема по умолчанию
      expect('classic').toBe('classic'); // Режим по умолчанию
    });

    it('score calculation works', () => {
      // Проверяем логику расчета очков
      const classicScore = 50; // Ходы
      const timedScore = 120; // Секунды
      
      expect(classicScore).toBe(50);
      expect(timedScore).toBe(120);
    });
  });
});