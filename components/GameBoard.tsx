// components/GameBoard.tsx
import React from 'react';
import { View } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles, Utils } from '../styles/GlobalStyles';
import GameCell from './GameCell';

type GameBoardProps = {
  board: number[];
  columns: number;
  onCellPress: (index: number) => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, columns, onCellPress }) => {
  const { theme } = useGameSettings();
  const styles = createStyles(theme);
  
  const cellSize = Utils.getCellSize(columns);

  return (
    <View style={[
      styles.GameStyles.board,
      {
        width: Utils.maxBoardSize,
        height: Utils.maxBoardSize,
        flexWrap: 'wrap' as 'wrap',
        flexDirection: 'row' as 'row'
      }
    ]}>
      {board.map((cell, index) => (
        <GameCell
          key={index}
          value={cell}
          index={index}
          cellSize={cellSize}
          onPress={onCellPress}
        />
      ))}
    </View>
  );
};

export default GameBoard;
