// contexts/GameSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StorageService, AppSettings } from '../services/StorageService';

// Тип для настроек размера поля
export type BoardSizeSettings = {
  tails: number;
  rows: number;
  columns: number;
  label: string;
  testMode?: boolean;
  timeLimit: number; // Лимит времени для режима time_attack
};

// Тип для темы приложения
export type Theme = 'light' | 'dark' | 'chinese';

// Тип: режимы игры
export type GameMode = 'classic' | 'timed' | 'time_attack';

// Тип: запись в рейтинге
export interface ScoreRecord {
  playerName: string;
  boardSize: string; // Изменено с difficulty на boardSize
  mode: GameMode;
  score: number; // время в секундах для timed/time_attack, ходы для classic
  date: string;
  moves?: number;
}

// Тип для контекста
type GameSettingsContextType = {
  boardSize: BoardSizeSettings; // Изменено с difficulty на boardSize
  theme: Theme;
  playerName: string;
  gameMode: GameMode;
  scores: ScoreRecord[];
  setBoardSize: (settings: BoardSizeSettings) => void; // Изменено
  setTheme: (theme: Theme) => void;
  setPlayerName: (name: string) => void;
  setGameMode: (mode: GameMode) => void;
  addScore: (record: Omit<ScoreRecord, 'date' | 'playerName'>) => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  getTimeLimit: () => number;
};

// Варианты размеров поля с индивидуальными временными лимитами для time_attack
export const boardSizes: BoardSizeSettings[] = [
  { 
    label: '3x3', 
    tails: 8, 
    rows: 3, 
    columns: 3, 
    timeLimit: 180 // 3 минуты
  },
  { 
    label: '4x4', 
    tails: 15, 
    rows: 4, 
    columns: 4, 
    timeLimit: 300 // 5 минут
  },
  { 
    label: '5x5', 
    tails: 24, 
    rows: 5, 
    columns: 5, 
    timeLimit: 600 // 10 минут
  },
  { 
    label: '6x6', 
    tails: 35, 
    rows: 6, 
    columns: 6, 
    timeLimit: 900 // 15 минут
  },
  { 
    label: 'Тест', 
    tails: 8, 
    rows: 3, 
    columns: 3, 
    testMode: true, 
    timeLimit: 30 // 30 секунд для тестирования
  }
];

// Режимы игры
export const gameModes = [
  {
    value: 'classic' as GameMode,
    label: '🏆 Классика',
    description: 'Собрать за минимальное количество ходов',
  },
  {
    value: 'timed' as GameMode,
    label: '⏱️ С таймером',
    description: 'Собрать как можно быстрее',
  },
  {
    value: 'time_attack' as GameMode,
    label: '🚨 На время',
    description: 'Собрать за ограниченное время',
  },
];

// Настройки по умолчанию
const defaultSettings: AppSettings = {
  boardSize: boardSizes[1], // 4x4 по умолчанию
  theme: 'light',
  playerName: 'Игрок',
  gameMode: 'classic',
  scores: [],
};

// Создаем контекст
const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

// Вспомогательная функция для получения BoardSizeSettings с timeLimit
const getBoardSizeWithTimeLimit = (boardSize: any): BoardSizeSettings => {
  // Ищем соответствующий размер в boardSizes
  const foundSize = boardSizes.find(size => size.label === boardSize.label);
  
  if (foundSize) {
    return foundSize;
  }
  
  // Если не нашли, создаем с timeLimit по умолчанию
  return {
    ...boardSize,
    timeLimit: defaultSettings.boardSize.timeLimit
  };
};

// Провайдер контекста
export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [boardSize, setBoardSize] = useState<BoardSizeSettings>(defaultSettings.boardSize);
  const [theme, setTheme] = useState<Theme>(defaultSettings.theme);
  const [playerName, setPlayerName] = useState<string>(defaultSettings.playerName);
  const [gameMode, setGameMode] = useState<GameMode>(defaultSettings.gameMode);
  const [scores, setScores] = useState<ScoreRecord[]>(defaultSettings.scores);

  // Функция для получения лимита времени (только для time_attack)
  const getTimeLimit = (): number => {
    if (gameMode === 'time_attack') {
      return boardSize.timeLimit;
    }
    return 0; // Для classic и timed лимита нет
  };

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
          if (a.mode !== 'classic' && b.mode !== 'classic') {
            return a.score - b.score;
          }
          return a.score - b.score;
        })
        .slice(0, 50);
      return updatedScores;
    });
  };

  // Обертки для set-функций с автоматическим сохранением
  const setBoardSizeAndSave = (newBoardSize: BoardSizeSettings) => {
    setBoardSize(newBoardSize);
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
        boardSize,
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
        // Обрабатываем boardSize с обеспечением наличия timeLimit
        let loadedBoardSize: BoardSizeSettings;
        
        if (savedSettings.boardSize) {
          loadedBoardSize = getBoardSizeWithTimeLimit(savedSettings.boardSize);
        } else {
          loadedBoardSize = defaultSettings.boardSize;
        }

        setBoardSize(loadedBoardSize);
        setTheme(savedSettings.theme || defaultSettings.theme);
        setPlayerName(savedSettings.playerName || defaultSettings.playerName);
        setGameMode(savedSettings.gameMode || defaultSettings.gameMode);
        setScores(savedSettings.scores || defaultSettings.scores);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  // Автоматическое сохранение при изменении настроек
  useEffect(() => {
    saveSettings();
  }, [boardSize, theme, playerName, gameMode, scores]);

  // Загружаем настройки при первом рендере
  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <GameSettingsContext.Provider value={{
      boardSize, // Изменено
      theme,
      playerName,
      gameMode,
      scores,
      setBoardSize: setBoardSizeAndSave, // Изменено
      setTheme: setThemeAndSave,
      setPlayerName: setPlayerNameAndSave,
      setGameMode: setGameModeAndSave,
      addScore,
      saveSettings,
      loadSettings,
      getTimeLimit,
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
