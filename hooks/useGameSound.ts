// hooks/useGameSound.ts
import { useEffect } from 'react';
import { audioService } from '../services/AudioService';
import { useAudioSettings } from '../contexts/AudioSettingsContext';

export const useGameSounds = () => {
  const { isSoundEffectsEnabled } = useAudioSettings();

  // Убираем инициализацию аудио здесь - она теперь в провайдере
  // Убираем управление фоновой музыкой - она теперь глобальная

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
