export const boardSizes = {
  '3x3': { label: '3x3', tails: 8, rows: 3, columns: 3, timeLimit: 180 },
  '4x4': { label: '4x4', tails: 15, rows: 4, columns: 4, timeLimit: 300 },
  '5x5': { label: '5x5', tails: 24, rows: 5, columns: 5, timeLimit: 420 }
};

export const defaultSettings = {
  boardSize: boardSizes['4x4'],
  theme: 'dark' as const,
  playerName: 'Player',
  gameMode: 'classic' as const,
  scores: [],
  imagePuzzleData: null
};

// Mock функций
export const useGameSettings = jest.fn(() => ({
  settings: defaultSettings,
  updateSettings: jest.fn(),
  resetSettings: jest.fn()
}));

// Mock провайдера как простой объект
export const GameSettingsProvider = ({ children }: any) => children;