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
  imagePieces?: string[];
};

const GameBoard: React.FC<GameBoardProps> = ({ board, columns, onCellPress, imagePieces }) => {
  const { theme, gameMode, imagePuzzleData } = useGameSettings();
  const styles = createStyles(theme);

  const cellSize = Utils.getCellSize(columns);
  const isImageMode = gameMode === 'image';


  return (
    <View style={[
      styles.GameStyles.board,
      {
        width: Utils.maxBoardSize,
        height: Utils.maxBoardSize,
        flexWrap: 'wrap',
        flexDirection: 'row'
      }
    ]}>
      {board.map((cell, index) => {
        const pieceIndex = cell - 1;
        const imageUri = isImageMode &&
          imagePieces &&
          cell !== 0 &&
          pieceIndex >= 0 &&
          pieceIndex < imagePieces.length
          ? imagePieces[pieceIndex]
          : undefined;

   
        return (
          <GameCell
            key={index}
            value={cell}
            index={index}
            cellSize={cellSize}
            onPress={onCellPress}
            imageUri={imageUri}
          />
        );
      })}
    </View>
  );
};

export default GameBoard;
