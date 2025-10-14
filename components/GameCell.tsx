// components/GameCell.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';

type GameCellProps = {
  value: number;
  index: number;
  cellSize: number;
  onPress: (index: number) => void;
};

const GameCell: React.FC<GameCellProps> = ({ value, index, cellSize, onPress }) => {
  const { theme } = useGameSettings();
  const styles = createStyles(theme);
  
  const isEmpty = value === 0;

  return (
    <TouchableOpacity
      style={[
        styles.GameStyles.cell,
        isEmpty && styles.GameStyles.emptyCell,
        {
          width: cellSize,
          height: cellSize,
          margin: 2.5
        }
      ]}
      onPress={() => onPress(index)}
      disabled={isEmpty}
    >
      {!isEmpty && <Text style={styles.GameStyles.cellText}>{value}</Text>}
    </TouchableOpacity>
  );
};

export default GameCell;
