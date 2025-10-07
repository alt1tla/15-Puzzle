// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGameSettings, gameModes } from '../contexts/GameSettingsContext'; // Добавлен импорт gameModes
import { createStyles } from '../styles/GlobalStyles';

type Props = {
  navigation: any;
};

const themeOptions = [
  { value: 'light' as const, icon: '🌞', label: 'Светлая' },
  { value: 'dark' as const, icon: '🌙', label: 'Тёмная' },
  { value: 'retro' as const, icon: '🎮', label: 'Ретро' },
];

const HomeScreen = ({ navigation }: Props) => {
  const { boardSize, theme, playerName, gameMode } = useGameSettings();
  const styles = createStyles(theme);

  const getCurrentModeLabel = () => {
    const currentMode = gameModes.find(mode => mode.value === gameMode); // Исправлено: gameModes.find вместо gameMode.find
    return currentMode?.label || '🏆 Классика';
  };

  return (
    <View style={styles.Containers.screen}>
      <View style={styles.Containers.centered}>
        <Text style={styles.Typography.title}>15 Puzzle</Text>

        <View style={{ gap: 15, width: 250, marginTop: 50 }}>
          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={() => navigation.navigate('Game', boardSize)}
          >
            <Text style={styles.Typography.button}>
              Играть
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={styles.Typography.button}>Рейтинг</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.Typography.button}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[
        styles.Containers.card,
        {
          marginTop: -50,
          backgroundColor: styles.Colors.surface,
        }
      ]}>
        <View style={{ gap: 5 }}>
          <Text style={styles.Typography.caption}>
            🎨 Тема: {themeOptions.find(t => t.value === theme)?.label}
          </Text>
          <Text style={styles.Typography.caption}>
            🧩 Размер: {boardSize.label}
          </Text>
          <Text style={styles.Typography.caption}>
            👤 Игрок: {playerName}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
