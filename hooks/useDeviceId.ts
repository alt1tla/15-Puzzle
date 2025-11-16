import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    const getOrCreateDeviceId = async () => {
      try {
        // Пытаемся получить существующий ID из AsyncStorage
        let identifier = await AsyncStorage.getItem('@device_id');
        
        if (!identifier) {
          // Создаем новый ID если его нет
          identifier = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem('@device_id', identifier);
        }
        
        setDeviceId(identifier);
      } catch (error) {
        // Fallback - генерируем случайный ID
        const fallbackId = `player_${Date.now()}`;
        setDeviceId(fallbackId);
      }
    };

    getOrCreateDeviceId();
  }, []);

  return deviceId;
};
