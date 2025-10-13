// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGameSettings, gameModes } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import { useGameSounds } from '../hooks/useGameSound';

type Props = {
  navigation: any;
};

const themeOptions = [
  { value: 'light' as const, icon: '🌞', label: 'Светлая' },
  { value: 'dark' as const, icon: '🌙', label: 'Тёмная' },
  { value: 'chinese' as const, icon: '🎮', label: 'Ретро' },
];

const HomeScreen = ({ navigation }: Props) => {
  const { boardSize, theme, playerName, gameMode } = useGameSettings();
  const styles = createStyles(theme);
  const { playButtonSound } = useGameSounds();


  const handlePlay = async () => {
    await playButtonSound();
    navigation.navigate('Game', boardSize);
  };

  const handleLeaderboard = async () => {
    await playButtonSound();
    navigation.navigate('Leaderboard');
  };

  const handleSettings = async () => {
    await playButtonSound();
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.Containers.screen}>
      <View style={styles.Containers.centered}>
        <Text style={styles.Typography.title}>15 Puzzle</Text>

        <View style={{ gap: 15, width: 250, marginTop: 50 }}>
          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={handlePlay}
          >
            <Text style={styles.Typography.button}>
              Играть
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={handleLeaderboard}
          >
            <Text style={styles.Typography.button}>Рейтинг</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={handleSettings}
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
