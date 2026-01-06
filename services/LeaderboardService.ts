import { SetStateAction } from "react";
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
    // Для Android в Expo Go
    if (Platform.OS === "android") {
      return "http://10.0.2.2:8000";
    }
    // Для iOS в Expo Go и других случаев
    // return "http://192.168.1.8:8000";
    // return "http://172.20.10.6:8000";
    return "http://192.168.68.108:8000";
  }

  private async realFetch(endpoint: string, options: RequestInit = {}) {
    const baseUrl = this.getApiBaseUrl(); 
    const url = `${baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (error) {

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
    limit: number = 50, 
    deviceId: string,
  ): Promise<{
    user_entry: SetStateAction<LeaderboardEntry | null>;
    user_position: any;entries: LeaderboardEntry[]; total_count: number, 
}> {
    try {
      return await this.realFetch(
        `/leaderboard/?board_size=${boardSize}&game_mode=${gameMode}&limit=${limit}&device_id=${deviceId}`
      );
    } catch (error) {
     throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();
