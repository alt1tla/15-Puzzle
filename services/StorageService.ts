// services/StorageService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Типы для данных приложения
export interface AppSettings {
  difficulty: {
    label: string;
    tails: number;
    rows: number;
    columns: number;
    testMode?: boolean;
  };
  theme: "light" | "dark" | "retro";
  playerName: string;
  // Новые поля для режимов игры и рейтинга
  gameMode: "classic" | "timed" | "time_attack";
  scores: ScoreRecord[];
}

// Новый тип: запись в рейтинге
export interface ScoreRecord {
  playerName: string;
  difficulty: string;
  mode: "classic" | "timed" | "time_attack";
  score: number; // время в секундах для timed/time_attack, ходы для classic
  date: string;
  moves?: number; // дополнительные ходы для режимов с временем
}

// Сервис для работы с локальным хранилищем
export const StorageService = {
  // Ключи для хранения данных
  STORAGE_KEYS: {
    SETTINGS: "app_settings",
  },

  // Сохранение настроек приложения
  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        StorageService.STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
      console.log("Настройки успешно сохранены");
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
      throw error;
    }
  },

  // Загрузка настроек приложения
  loadSettings: async (): Promise<AppSettings | null> => {
    try {
      const settingsJson = await AsyncStorage.getItem(
        StorageService.STORAGE_KEYS.SETTINGS
      );
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        console.log("Настройки успешно загружены");

        // Обеспечиваем обратную совместимость - если старые настройки без новых полей
        return {
          difficulty: settings.difficulty || {
            label: "Стандартная (4x4)",
            tails: 15,
            rows: 4,
            columns: 4,
          },
          theme: settings.theme || "light",
          playerName: settings.playerName || "Игрок",
          gameMode: settings.gameMode || "classic", // Значение по умолчанию
          scores: settings.scores || [], // Пустой массив по умолчанию
        };
      }
      console.log("Настройки не найдены, используются значения по умолчанию");
      return null;
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
      return null;
    }
  },

  // Очистка всех данных
  clearStorage: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      console.log("Хранилище очищено");
    } catch (error) {
      console.error("Ошибка очистки хранилища:", error);
      throw error;
    }
  },
};
