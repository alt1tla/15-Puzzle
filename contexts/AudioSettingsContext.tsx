// contexts/AudioSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { audioService } from '../services/AudioService';

type AudioSettingsContextType = {
  isMusicEnabled: boolean;
  isSoundEffectsEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  toggleMusic: () => void;
  toggleSoundEffects: () => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
};

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined);

export const AudioSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSoundEffectsEnabled, setIsSoundEffectsEnabled] = useState(true);
  const [musicVolume, setMusicVolumeState] = useState(0.3);
  const [effectsVolume, setEffectsVolumeState] = useState(0.7);

  // Инициализация аудио сервиса при запуске приложения
  useEffect(() => {
    const initAudio = async () => {
      await audioService.initialize();
      // Автоматически запускаем музыку если она включена
      if (isMusicEnabled) {
        await audioService.playBackgroundMusic();
      }
    };
    initAudio();
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  const toggleMusic = async () => {
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);
    
    if (newState) {
      await audioService.playBackgroundMusic();
    } else {
      await audioService.stopBackgroundMusic();
    }
  };

  const toggleSoundEffects = () => {
    setIsSoundEffectsEnabled(!isSoundEffectsEnabled);
  };

  const setMusicVolume = async (volume: number) => {
    setMusicVolumeState(volume);
    await audioService.setBackgroundMusicVolume(volume);
  };

  const setEffectsVolume = async (volume: number) => {
    setEffectsVolumeState(volume);
    await audioService.setEffectsVolume(volume);
  };

  return (
    <AudioSettingsContext.Provider value={{
      isMusicEnabled,
      isSoundEffectsEnabled,
      musicVolume,
      effectsVolume,
      toggleMusic,
      toggleSoundEffects,
      setMusicVolume,
      setEffectsVolume,
    }}>
      {children}
    </AudioSettingsContext.Provider>
  );
};

export const useAudioSettings = () => {
  const context = useContext(AudioSettingsContext);
  if (context === undefined) {
    throw new Error('useAudioSettings must be used within an AudioSettingsProvider');
  }
  return context;
};
