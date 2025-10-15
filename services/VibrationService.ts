import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

export class VibrationService {
  // Разные паттерны вибрации для iOS и Android
  static async playMoveVibration() {
    if (Platform.OS === 'ios') {
      // iOS: тактильный отклик
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Android: короткая вибрация
      Vibration.vibrate(50);
    }
  }

  static async playWinVibration() {
    if (Platform.OS === 'ios') {
      // iOS: успешный тактильный отклик
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Android: паттерн победы
      Vibration.vibrate([0, 100, 200, 100]);
    }
  }

  static async playErrorVibration() {
    if (Platform.OS === 'ios') {
      // iOS: ошибка
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      // Android: паттерн ошибки
      Vibration.vibrate([0, 50, 100, 50]);
    }
  }

  static async playButtonPressVibration() {
    if (Platform.OS === 'ios') {
      // iOS: легкий отклик
      await Haptics.selectionAsync();
    } else {
      // Android: очень короткая вибрация
      Vibration.vibrate(25);
    }
  }
}