// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useGameSettings, gameModes } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import { useGameSounds } from '../hooks/useGameSound';
import { VibrationService } from '../services/VibrationService';

type Props = {
  navigation: any;
};

const themeOptions = [
  { value: 'light' as const, icon: '🌞', label: 'Светлая' },
  { value: 'dark' as const, icon: '🌚', label: 'Тёмная' },
  { value: 'chinese' as const, icon: '🐲', label: 'Китай' },
];

const HomeScreen = ({ navigation }: Props) => {
  const { boardSize, theme, playerName, gameMode, imagePuzzleData, updateImageForCurrentBoardSize } = useGameSettings();
  const styles = createStyles(theme);
  const { playButtonSound } = useGameSounds();


  const handlePlay = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    if (gameMode === 'image' &&
      imagePuzzleData &&
      imagePuzzleData.currentBoardSize !== boardSize.label) {
      await updateImageForCurrentBoardSize();
    }
    navigation.navigate('Game', boardSize);
  };

  const handleLeaderboard = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    navigation.navigate('Leaderboard');
  };

  const handleSettings = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    navigation.navigate('Settings');
  };

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;


  return (
    <View style={styles.Containers.screen}>
      <View style={[
        styles.Containers.card,
        {
          position: 'absolute',
          top: statusBarHeight + 20 + 20,
          left: 20,
          zIndex: 1,
          backgroundColor: styles.Colors.surface,
        }
      ]}>
        <View style={{ gap: 5 }}>
          <Text style={styles.Typography.caption}>
            👤 {playerName}
          </Text>
        </View>
      </View>
      <View style={styles.Containers.centered}>
        <Text style={styles.Typography.title}>15 Puzzle</Text>

        <View style={{ gap: 5, width: 250, marginTop: 40 }}>
          <TouchableOpacity
            style={[styles.Buttons.primary, { marginBottom: 30 }]}
            onPress={handlePlay}
          >
            <Text style={[styles.Typography.button, { fontWeight: 'bold' }]}>
              Играть {boardSize.label}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttons.secondary}
            onPress={handleLeaderboard}
          >
            <Text style={styles.Typography.button}>Рейтинг (скоро)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttons.secondary}
            onPress={handleSettings}
          >
            <Text style={styles.Typography.button}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
