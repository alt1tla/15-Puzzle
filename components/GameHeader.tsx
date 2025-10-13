// components/GameHeader.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';

type GameHeaderProps = {
  tails: number;
  rows: number;
  columns: number;
  moves: number;
  testMode: boolean;
  time?: string;
  gameMode?: string;
  timeLimit?: number;
  currentTime?: number;
};

const GameHeader: React.FC<GameHeaderProps> = ({
  tails,
  rows,
  columns,
  moves,
  testMode,
  time,
  gameMode,
  timeLimit,
  currentTime = 0
}) => {
  const { theme } = useGameSettings();
  const styles = createStyles(theme);

  const getModeIcon = () => {
    switch (gameMode) {
      case 'timed': return '⏱️ ';
      case 'time_attack': return '🚨 ';
      default: return '🏆 ';
    }
  };

  // Расчет прогресса времени для time_attack
  const getTimeProgress = () => {
    if (gameMode === 'time_attack' && timeLimit && timeLimit > 0) {
      return Math.max(0, ((timeLimit - currentTime) / timeLimit) * 100);
    }
    return 100;
  };

  const progress = getTimeProgress();
  const isTimeCritical = progress < 25;

  return (
    <View style={{ alignItems: 'center', marginBottom: 15, }}>
      {testMode && (
        <Text style={[styles.Typography.caption, { color: styles.Colors.accent, fontWeight: 'bold', marginBottom: 30 }]}>
          Тестовый режим
        </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 40, justifyContent: 'flex-start' }}>
        <View style={{ alignItems: 'center', }}>
          <Text style={styles.Typography.title}>{moves}</Text>
          <Text style={styles.Typography.body}>Шаги</Text>
        </View>
        {time && (
          <View style={{ alignItems: 'center', }}>
            <Text style={[styles.Typography.title,
            {
              color: isTimeCritical ? styles.Colors.primary : styles.Colors.textPrimary
            }
            ]}>{time}</Text>
            <Text style={[
              styles.Typography.body,
              { color: styles.Colors.textPrimary }
            ]}>
              Время
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default GameHeader;
