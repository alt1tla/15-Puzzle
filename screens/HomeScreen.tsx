// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Определяем тип для свойств компонента (пропсов)
type Props = {
  navigation: any; // Объект навигации для перехода между экранами
};

// Главный экран приложения - меню
const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      {/* Заголовок игры */}
      <Text style={styles.title}>15 Puzzle</Text>

      {/* Контейнер с кнопками меню */}
      <View style={styles.buttonContainer}>
        {/* Кнопка перехода к экрану игры */}
        <Button
          title="Играть"
          onPress={() => navigation.navigate('Game')} // Переход на экран игры
        />

        {/* Кнопка перехода к таблице рекордов */}
        <Button
          title="Рейтинг"
          onPress={() => navigation.navigate('Leaderboard')} // Переход на экран рейтинга
        />

        {/* Кнопка перехода к настройкам */}
        <Button
          title="Настройки"
          onPress={() => navigation.navigate('Settings')} // Переход на экран настроек
        />
      </View>
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  // Основной контейнер экрана
  container: {
    flex: 1, // Занимает все доступное пространство
    justifyContent: 'center', // Выравнивание по центру по вертикали
    alignItems: 'center', // Выравнивание по центру по горизонтали
    backgroundColor: '#f0f0f0', // Светло-серый фон
  },
  // Стиль заголовка
  title: {
    fontSize: 32, // Размер шрифта
    fontWeight: 'bold', // Жирное начертание
    marginBottom: 50, // Отступ снизу
  },
  // Контейнер для кнопок
  buttonContainer: {
    gap: 15, // Расстояние между кнопками
    width: 200, // Фиксированная ширина контейнера
  },
});

export default HomeScreen;
