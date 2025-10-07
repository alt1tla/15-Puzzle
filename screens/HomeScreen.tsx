// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
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
  const { difficulty, setDifficulty, theme, setTheme, playerName } = useGameSettings();
  const styles = createStyles(theme);

  return (
    <View style={styles.Containers.screen}>
      <View style={styles.Containers.centered}>
        <Text style={styles.Typography.title}>15 Puzzle</Text>

        <View style={{ gap: 15, width: 250, marginTop: 50 }}>
          <TouchableOpacity
            style={styles.Buttons.primary}
            onPress={() => navigation.navigate('Game', difficulty)}
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
            🧩 Сложность: {difficulty.label}
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
