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
};

const GameHeader: React.FC<GameHeaderProps> = ({ 
  tails, 
  rows, 
  columns, 
  moves, 
  testMode,
  time,
  gameMode
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
        <Text style={[styles.Typography.body, { fontWeight: 'bold', color: styles.Colors.primary }]}>
          Время: {time}
        </Text>
      )}
    </View>
  );
};

export default GameHeader;
