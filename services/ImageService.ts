// services/ImageService.ts
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export class ImageService {
  // Запрос разрешений и выбор изображения
  static async pickImage(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Для выбора изображения нужны разрешения на доступ к галерее!');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        aspect: [1, 1], // Принудительно квадратное соотношение
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка выбора изображения:', error);
      return null;
    }
  }

  // Упрощенная версия - подготовка и нарезка изображения
  static async prepareAndSliceImageSimple(uri: string, rows: number, columns: number): Promise<string[]> {
    try {
      console.log(`Начинаем обработку изображения: ${rows}x${columns}`);
      const pieces: string[] = [];
      const outputSize = 600; // размер для квадратного изображения

      // Сначала подготавливаем изображение (обрезаем до квадрата и ресайзим)
      console.log('Подготавливаем изображение...');
      const preparedImage = await manipulateAsync(
        uri,
        [
          { 
            crop: {
              originX: 0,
              originY: 0,
              width: 1,
              height: 1
            }
          },
          { resize: { width: outputSize, height: outputSize } }
        ],
        { compress: 0.9, format: SaveFormat.JPEG }
      );

      console.log('Изображение подготовлено, начинаем нарезку...');

      // Затем нарезаем на кусочки
      const pieceSize = outputSize / columns;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const manipulatedImage = await manipulateAsync(
            preparedImage.uri,
            [
              {
                crop: {
                  originX: col * pieceSize,
                  originY: row * pieceSize,
                  width: pieceSize,
                  height: pieceSize
                }
              },
              { resize: { width: 200, height: 200 } } // Ресайз для качества отображения
            ],
            { compress: 0.8, format: SaveFormat.JPEG }
          );

          pieces.push(manipulatedImage.uri);
          console.log(`Создан кусочек ${row}-${col}: ${manipulatedImage.uri}`);
        }
      }

      console.log(`Успешно создано ${pieces.length} кусочков`);
      return pieces;
    } catch (error) {
      console.error('Ошибка обработки изображения:', error);
      return [];
    }
  }

  // Быстрая версия - без ресайза кусочков (для тестирования)
  static async quickSliceImage(uri: string, rows: number, columns: number): Promise<string[]> {
    try {
      const pieces: string[] = [];
      const outputSize = 400;

      // Просто ресайзим изображение и нарезаем
      const preparedImage = await manipulateAsync(
        uri,
        [
          { resize: { width: outputSize, height: outputSize } }
        ],
        { compress: 0.9, format: SaveFormat.JPEG }
      );

      const pieceSize = outputSize / columns;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const piece = await manipulateAsync(
            preparedImage.uri,
            [
              {
                crop: {
                  originX: col * pieceSize,
                  originY: row * pieceSize,
                  width: pieceSize,
                  height: pieceSize
                }
              }
            ],
            { compress: 0.8, format: SaveFormat.JPEG }
          );

          pieces.push(piece.uri);
        }
      }

      return pieces;
    } catch (error) {
      console.error('Ошибка быстрой нарезки:', error);
      return [];
    }
  }
}