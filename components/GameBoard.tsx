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

  console.log('GameBoard render:', {
    isImageMode,
    imagePiecesCount: imagePieces?.length,
    boardLength: board.length,
    imagePuzzleData: imagePuzzleData ? 'exists' : 'null'
  });


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
        const imageUri = isImageMode && imagePieces && pieceIndex >= 0 ? imagePieces[pieceIndex] : undefined;

        console.log(`Cell ${index}: value=${cell}, pieceIndex=${pieceIndex}, imageUri=${imageUri ? 'exists' : 'null'}`);

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