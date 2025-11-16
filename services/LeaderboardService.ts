import { Platform } from "react-native";

export interface LeaderboardEntry {
  id: number;
  device_id: string;
  player_name: string;
  time_seconds: number;
  moves: number;
  board_size: number;
  game_mode: "classic" | "timed";
  created_at: string;
}

export interface AddScoreRequest {
  device_id: string;
  player_name: string;
  time_seconds: number;
  moves: number;
  board_size: number;
  game_mode: "classic" | "timed";
}

class LeaderboardService {
  private getApiBaseUrl(): string {
    console.log('Platform.OS:', Platform.OS);
    // Для Android в Expo Go
    if (Platform.OS === "android") {
      return "http://10.0.2.2:8000";
    }
    // Для iOS в Expo Go и других случаев
    return "http://192.168.0.105:8000";
  }

  private async realFetch(endpoint: string, options: RequestInit = {}) {
    const baseUrl = this.getApiBaseUrl(); // ВЫЗЫВАЕМ функцию!
    const url = `${baseUrl}${endpoint}`;
    console.log(`📡 Making request to: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      console.log(`📨 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Request successful`);
      return result;
    } catch (error) {
      console.error("❌ Network error:", error);
      throw error;
    }
  }

  async addScore(scoreData: AddScoreRequest): Promise<LeaderboardEntry> {
    return await this.realFetch("/leaderboard/", {
      method: "POST",
      body: JSON.stringify(scoreData),
    });
  }

  async getLeaderboard(
    boardSize: number,
    gameMode: "classic" | "timed",
    limit: number = 50
  ): Promise<{ entries: LeaderboardEntry[]; total_count: number }> {
    try {
      return await this.realFetch(
        `/leaderboard/?board_size=${boardSize}&game_mode=${gameMode}&limit=${limit}`
      );
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  }

  async getTopPlayers(
    boardSize: number,
    gameMode: "classic" | "timed",
    topN: number = 10
  ): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.getLeaderboard(boardSize, gameMode, topN);
      return response.entries;
    } catch (error) {
      console.error("Error fetching top players:", error);
      throw error;
    }
  }

  async getPlayerStats(deviceId: string): Promise<any> {
    try {
      return await this.realFetch(`/stats/${deviceId}`);
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  }

  // Тестовая функция для проверки соединения
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing backend connection...');
      const result = await this.realFetch('/');
      console.log('✅ Backend connection test passed');
      return true;
    } catch (error) {
      console.error('❌ Backend connection test failed');
      return false;
    }
  }
}

export const leaderboardService = new LeaderboardService();
