import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export class ImageService {
  // Запрос разрешений и выбор изображения
  static async pickImage(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        alert('Для выбора изображения нужны разрешения на доступ к галерее');
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

  static async getImageSize(uri: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
      );
    });
  }

  static async cropToSquare(uri: string): Promise<string | null> {
    try {
      console.log('Начинаем умную обрезку до квадрата...');

      // Получаем размеры исходного изображения
      const { width, height } = await this.getImageSize(uri);
      console.log(`Размеры исходного изображения: ${width}x${height}`);

      // Определяем размер квадрата (меньшая из сторон)
      const squareSize = Math.min(width, height);

      // Вычисляем координаты для обрезки из центра
      const cropX = (width - squareSize) / 2;
      const cropY = (height - squareSize) / 2;

      console.log(`Обрезаем до квадрата ${squareSize}x${squareSize} из координат (${cropX}, ${cropY})`);

      // Обрезаем изображение до квадрата из центра
      const croppedImage = await manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: squareSize,
              height: squareSize
            }
          }
        ],
        { compress: 0.9, format: SaveFormat.JPEG }
      );

      console.log('Умная обрезка завершена');
      return croppedImage.uri;
    } catch (error) {
      console.error('Ошибка умной обрезки:', error);
      return null;
    }
  }

  // Быстрая версия - без ресайза кусочков (для тестирования)
  static async quickSliceImage(uri: string, rows: number, columns: number): Promise<string[]> {
    try {
      const pieces: string[] = [];

      console.log('Обрезаем изображение до квадрата...');
      const squareUri = await this.cropToSquare(uri);

      if (!squareUri) {
        throw new Error('Не удалось обрезать изображение до квадрата');
      }

      // Оптимальный размер для качества
      const outputSize = Math.max(600, rows * 200);

      // Просто ресайзим изображение и нарезаем
      const preparedImage = await manipulateAsync(
        squareUri,
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