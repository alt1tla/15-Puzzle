// services/StorageService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImagePuzzleData } from "../contexts/GameSettingsContext";

// Типы для данных приложения
export interface AppSettings {
  boardSize: { // Изменено с difficulty на boardSize
    label: string;
    tails: number;
    rows: number;
    columns: number;
    testMode?: boolean;
    timeLimit: number; // Теперь обязательное поле
  };
  theme: "light" | "dark" | "chinese";
  playerName: string;
  gameMode: "classic" | "timed" | "time_attack" | "image";
  scores: ScoreRecord[];
  imagePuzzleData?: {
    originalUri: string;
    pieces: string[];
    currentBoardSize: string;
  } | null;
}

export interface ScoreRecord {
  playerName: string;
  boardSize: string; // Изменено с difficulty на boardSize
  mode: "classic" | "timed" | "time_attack" | "image";
  score: number;
  date: string;
  moves?: number;
}

// Сервис для работы с локальным хранилищем
export const StorageService = {
  STORAGE_KEYS: {
    SETTINGS: "app_settings",
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        StorageService.STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      throw error;
    }
  },

  loadSettings: async (): Promise<AppSettings | null> => {
    try {
      const settingsJson = await AsyncStorage.getItem(
        StorageService.STORAGE_KEYS.SETTINGS
      );
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);

        // Обеспечиваем обратную совместимость
        const boardSize = settings.boardSize || settings.difficulty || { // Поддержка старых настроек
          label: "4x4",
          tails: 15,
          rows: 4,
          columns: 4,
          timeLimit: 300
        };

        return {
          boardSize: {
            ...boardSize,
            timeLimit: boardSize.timeLimit || 300 // Гарантируем наличие timeLimit
          },
          theme: settings.theme || "light",
          playerName: settings.playerName || "Игрок",
          gameMode: settings.gameMode || "classic",
          scores: settings.scores || [],
          imagePuzzleData: settings.imagePuzzleData || null,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  clearStorage: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw error;
    }
  },
};
