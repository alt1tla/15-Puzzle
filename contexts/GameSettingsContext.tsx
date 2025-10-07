// contexts/GameSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StorageService, AppSettings } from '../services/StorageService';

// Тип для настроек сложности
export type DifficultySettings = {
  tails: number;
  rows: number;
  columns: number;
  label: string;
  testMode?: boolean;
};

// Тип для темы приложения
export type Theme = 'light' | 'dark' | 'retro';

// Новый тип: режимы игры
export type GameMode = 'classic' | 'timed' | 'time_attack';

// Новый тип: запись в рейтинге
export interface ScoreRecord {
  playerName: string;
  difficulty: string;
  mode: GameMode;
  score: number; // время в секундах для timed/time_attack, ходы для classic
  date: string;
  moves?: number; // дополнительные ходы для режимов с временем
}

// Расширенный тип для контекста
type GameSettingsContextType = {
  difficulty: DifficultySettings;
  theme: Theme;
  playerName: string;
  gameMode: GameMode; // Новое: текущий режим игры
  scores: ScoreRecord[]; // Новое: локальный рейтинг
  setDifficulty: (settings: DifficultySettings) => void;
  setTheme: (theme: Theme) => void;
  setPlayerName: (name: string) => void;
  setGameMode: (mode: GameMode) => void; // Новое: установка режима игры
  addScore: (record: Omit<ScoreRecord, 'date' | 'playerName'>) => void; // Новое: добавление результата
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
};

// Варианты сложности игры
export const difficultyLevels: DifficultySettings[] = [
  { label: 'Легкая (3x3)', tails: 8, rows: 3, columns: 3 },
  { label: 'Стандартная (4x4)', tails: 15, rows: 4, columns: 4 },
  { label: 'Сложная (5x5)', tails: 24, rows: 5, columns: 5 },
  { label: 'Эксперт (6x6)', tails: 35, rows: 6, columns: 6 },
  { label: 'Тестовый (3x3)', tails: 8, rows: 3, columns: 3, testMode: true }
];

// Режимы игры
export const gameModes = [
  {
    value: 'classic' as GameMode,
    label: '🏆 Классика',
    description: 'Собрать за минимальное количество ходов',
    timeLimit: 0 // Без ограничения времени
  },
  {
    value: 'timed' as GameMode,
    label: '⏱️ С таймером',
    description: 'Собрать как можно быстрее',
    timeLimit: 0 // Без ограничения, просто показывает время
  },
  {
    value: 'time_attack' as GameMode,
    label: '🚨 На время',
    description: 'Собрать за ограниченное время',
    timeLimit: 300 // 5 минут ограничение
  },
];

// Настройки по умолчанию
const defaultSettings: AppSettings = {
  difficulty: difficultyLevels[1], // Стандартная сложность
  theme: 'light',
  playerName: 'Игрок',
  gameMode: 'classic', // Новое: режим по умолчанию
  scores: [], // Новое: пустой рейтинг
};

// Создаем контекст
const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

// Провайдер контекста
export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [difficulty, setDifficulty] = useState<DifficultySettings>(defaultSettings.difficulty);
  const [theme, setTheme] = useState<Theme>(defaultSettings.theme);
  const [playerName, setPlayerName] = useState<string>(defaultSettings.playerName);
  const [gameMode, setGameMode] = useState<GameMode>(defaultSettings.gameMode); // Новое состояние
  const [scores, setScores] = useState<ScoreRecord[]>(defaultSettings.scores); // Новое состояние

  // Добавление результата в рейтинг
  const addScore = (record: Omit<ScoreRecord, 'date' | 'playerName'>) => {
    const newScore: ScoreRecord = {
      ...record,
      playerName,
      date: new Date().toISOString(),
    };

    setScores(prevScores => {
      const updatedScores = [...prevScores, newScore]
        .sort((a, b) => {
          // Для режимов с временем - меньше время лучше
          if (a.mode !== 'classic' && b.mode !== 'classic') {
            return a.score - b.score;
          }
          // Для классики - меньше ходов лучше
          return a.score - b.score;
        })
        .slice(0, 50); // Сохраняем только топ-50 результатов

      return updatedScores;
    });
  };

  // Обертки для set-функций с автоматическим сохранением
  const setDifficultyAndSave = (newDifficulty: DifficultySettings) => {
    setDifficulty(newDifficulty);
  };

  const setThemeAndSave = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const setPlayerNameAndSave = (newName: string) => {
    setPlayerName(newName);
  };

  const setGameModeAndSave = (newMode: GameMode) => {
    setGameMode(newMode);
  };

  // Сохранение текущих настроек
  const saveSettings = async () => {
    try {
      const currentSettings: AppSettings = {
        difficulty,
        theme,
        playerName,
        gameMode,
        scores,
      };
      await StorageService.saveSettings(currentSettings);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  // Загрузка настроек при монтировании компонента
  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.loadSettings();
      if (savedSettings) {
        setDifficulty(savedSettings.difficulty);
        setTheme(savedSettings.theme);
        setPlayerName(savedSettings.playerName);
        setGameMode(savedSettings.gameMode || 'classic');
        setScores(savedSettings.scores || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  // Автоматическое сохранение при изменении настроек
  useEffect(() => {
    saveSettings();
  }, [difficulty, theme, playerName, gameMode, scores]);

  // Загружаем настройки при первом рендере
  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <GameSettingsContext.Provider value={{
      difficulty,
      theme,
      playerName,
      gameMode,
      scores,
      setDifficulty: setDifficultyAndSave,
      setTheme: setThemeAndSave,
      setPlayerName: setPlayerNameAndSave,
      setGameMode: setGameModeAndSave,
      addScore,
      saveSettings,
      loadSettings,
    }}>
      {children}
    </GameSettingsContext.Provider>
  );
};

// Хук для использования контекста
export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};
