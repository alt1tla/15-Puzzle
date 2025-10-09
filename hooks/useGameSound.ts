// hooks/useGameSound.ts
import { useEffect } from 'react';
import { audioService } from '../services/AudioService';
import { useAudioSettings } from '../contexts/AudioSettingsContext';

export const useGameSounds = () => {
  const { isMusicEnabled, isSoundEffectsEnabled } = useAudioSettings();

  // Инициализация аудио при монтировании
  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioService.initialize();
        console.log('Game sounds initialized');
      } catch (error) {
        console.error('Failed to initialize game sounds:', error);
      }
    };

    initAudio();

    return () => {
      audioService.unloadAllSounds();
    };
  }, []);

  // Управление фоновой музыкой
  useEffect(() => {
    const handleBackgroundMusic = async () => {
      try {
        if (isMusicEnabled) {
          await audioService.playBackgroundMusic();
        } else {
          await audioService.stopBackgroundMusic();
        }
      } catch (error) {
        console.error('Error handling background music:', error);
      }
    };

    handleBackgroundMusic();
  }, [isMusicEnabled]);

  // Функции для воспроизведения звуков
  const playMoveSound = async () => {
    if (isSoundEffectsEnabled) {
      await audioService.playSound('move');
    }
  };

  const playCantMoveSound = async () => {
    if (isSoundEffectsEnabled) {
      await audioService.playSound('cantMove');
    }
  };

  const playWinSound = async () => {
    if (isSoundEffectsEnabled) {
      await audioService.playSound('win');
    }
  };

  const playGameOverSound = async () => {
    if (isSoundEffectsEnabled) {
      await audioService.playSound('gameOver');
    }
  };

  const playButtonSound = async () => {
    if (isSoundEffectsEnabled) {
      await audioService.playSound('button');
    }
  };

  return {
    playMoveSound,
    playCantMoveSound,
    playWinSound,
    playGameOverSound,
    playButtonSound,
  };
};
