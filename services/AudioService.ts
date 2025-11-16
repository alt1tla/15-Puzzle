// services/AudioService.ts
import { Audio } from "expo-av";

// Типы звуков
export type SoundType =
  | "background"
  | "move"
  | "cantMove"
  | "win"
  | "gameOver"
  | "button";

class AudioService {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private isBackgroundMusicPlaying = false;
  private backgroundMusicVolume = 0.3;
  private effectsVolume = 0.7;
  private isInitialized = false;

  // Инициализация аудио
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Загружаем звуки
      await this.loadAllSounds();
      
      this.isInitialized = true;
    } catch (error) {
    }
  }

  // Загрузка всех звуков
  private async loadAllSounds() {
    try {
      // Прямая загрузка звуков через require
      const soundDefinitions = [
        { 
          type: 'background' as SoundType, 
          source: require('../assets/audio/153.mp3') 
        },
        { 
          type: 'move' as SoundType, 
          source: require('../assets/audio/movetile.mp3') 
        },
        { 
          type: 'cantMove' as SoundType, 
          source: require('../assets/audio/cantmovetile.mp3') 
        },
        { 
          type: 'win' as SoundType, 
          source: require('../assets/audio/win.mp3') 
        },
        { 
          type: 'gameOver' as SoundType, 
          source: require('../assets/audio/gameover.mp3') 
        },
        { 
          type: 'button' as SoundType, 
          source: require('../assets/audio/button.mp3') 
        },
      ];

      for (const { type, source } of soundDefinitions) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            source,
            {
              volume: type === "background"
                ? this.backgroundMusicVolume
                : this.effectsVolume,
              isLooping: type === "background",
              shouldPlay: false,
            }
          );

          this.sounds.set(type, sound);
        } catch (error) {
        }
      }
    } catch (error) {
    }
  }

  // Воспроизведение звука
  async playSound(type: SoundType): Promise<void> {
    try {
      if (!this.isInitialized) {
        return;
      }

      const sound = this.sounds.get(type);
      if (sound) {
        // Для звуковых эффектов останавливаем и перематываем
        if (type !== 'background') {
          await sound.stopAsync();
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
      } else {
      }
    } catch (error) {
    }
  }

  // Управление фоновой музыкой
  async playBackgroundMusic(): Promise<void> {
    try {
      const sound = this.sounds.get("background");
      if (sound && !this.isBackgroundMusicPlaying) {
        await sound.playAsync();
        this.isBackgroundMusicPlaying = true;
      }
    } catch (error) {
    }
  }

  async stopBackgroundMusic(): Promise<void> {
    try {
      const sound = this.sounds.get("background");
      if (sound && this.isBackgroundMusicPlaying) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        this.isBackgroundMusicPlaying = false;
      }
    } catch (error) {
    }
  }

  // Настройка громкости
  async setBackgroundMusicVolume(volume: number): Promise<void> {
    this.backgroundMusicVolume = volume;
    const sound = this.sounds.get("background");
    if (sound) {
      await sound.setVolumeAsync(volume);
    }
  }

  async setEffectsVolume(volume: number): Promise<void> {
    this.effectsVolume = volume;
    for (const [type, sound] of this.sounds.entries()) {
      if (type !== "background") {
        await sound.setVolumeAsync(volume);
      }
    }
  }

  // Получение статуса музыки
  getBackgroundMusicStatus(): boolean {
    return this.isBackgroundMusicPlaying;
  }

  // Очистка ресурсов
  async unloadAllSounds(): Promise<void> {
    try {
      for (const [type, sound] of this.sounds.entries()) {
        await sound.unloadAsync();
      }
      this.sounds.clear();
      this.isBackgroundMusicPlaying = false;
      this.isInitialized = false;
    } catch (error) {
    }
  }
}

// Экспортируем singleton экземпляр
export const audioService = new AudioService();
