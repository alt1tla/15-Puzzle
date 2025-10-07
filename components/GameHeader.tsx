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
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Text style={styles.Typography.heading}>
        {getModeIcon()}Пазл {tails}
      </Text>
      <Text style={styles.Typography.body}>{rows} × {columns}</Text>
      {testMode && (
        <Text style={[styles.Typography.caption, { color: styles.Colors.accent, fontWeight: 'bold' }]}>
          🔧 Тестовый режим
        </Text>
      )}
      <Text style={styles.Typography.body}>Шаги: {moves}</Text>
      {time && (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
          <Text style={[
            styles.Typography.body, 
            { 
              fontWeight: 'bold', 
              color: isTimeCritical ? styles.Colors.accent : styles.Colors.primary 
            }
          ]}>
            {gameMode === 'time_attack' ? 'Осталось: ' : 'Время: '}{time}
          </Text>
          {gameMode === 'time_attack' && timeLimit && (
            <View style={{
              width: 150,
              height: 6,
              backgroundColor: styles.Colors.border,
              borderRadius: 3,
              marginTop: 5,
              overflow: 'hidden'
            }}>
              <View style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: isTimeCritical ? styles.Colors.accent : styles.Colors.primary,
                borderRadius: 3,
              }} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default GameHeader;
