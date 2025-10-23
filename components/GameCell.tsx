import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';

type GameCellProps = {
  value: number;
  index: number;
  cellSize: number;
  onPress: (index: number) => void;
  imageUri?: string;
};

const GameCell: React.FC<GameCellProps> = ({ value, index, cellSize, onPress, imageUri }) => {
  const { theme, gameMode } = useGameSettings();
  const styles = createStyles(theme);

  const isEmpty = value === 0;
  const isImageMode = gameMode === 'image';
  const shouldShowImage = isImageMode && imageUri && !isEmpty;

  console.log(`GameCell ${index}: value=${value}, shouldShowImage=${shouldShowImage}`);


  return (
    <TouchableOpacity
      style={[
        styles.GameStyles.cell,
        isEmpty && styles.GameStyles.emptyCell,
        {
          width: cellSize,
          height: cellSize,
          margin: 2.5,
          overflow: 'hidden',
          backgroundColor: isEmpty ? 'transparent' : styles.GameStyles.cell.backgroundColor,
        }
      ]}
      onPress={() => onPress(index)}
      disabled={isEmpty}
    >{!isEmpty && (
      <>
        {isImageMode && imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8
            }}
            resizeMode="cover"
            onError={(error) => console.log('❌ Ошибка загрузки изображения:', error.nativeEvent.error)}
            onLoad={() => console.log('✅ Изображение загружено для клетки', index)}
          />
        ) : (
          <Text style={styles.GameStyles.cellText}>{value}</Text>
        )}
      </>
    )}
    </TouchableOpacity>
  );
};

export default GameCell;
