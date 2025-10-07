// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { useGameSettings, difficultyLevels } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';

type Props = {
  navigation: any;
};

const SettingsScreen = ({ navigation }: Props) => {
  const { difficulty, setDifficulty, theme, setTheme, playerName } = useGameSettings();
  const styles = createStyles(theme);

  // Находим текущий индекс сложности
  const currentDifficultyIndex = difficultyLevels.findIndex(
    level => level.label === difficulty.label
  );

  // Обработчик переключения сложности вперед
  const handleNextDifficulty = () => {
    const nextIndex = (currentDifficultyIndex + 1) % difficultyLevels.length;
    setDifficulty(difficultyLevels[nextIndex]);
  };

  // Обработчик переключения сложности назад
  const handlePrevDifficulty = () => {
    const prevIndex = currentDifficultyIndex === 0
      ? difficultyLevels.length - 1
      : currentDifficultyIndex - 1;
    setDifficulty(difficultyLevels[prevIndex]);
  };

  // Обработчик выбора темы
  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'retro') => {
    setTheme(selectedTheme);
  };

  // Описания тем для отображения (только иконки)
  const themeOptions = [
    { value: 'light' as const, icon: '🌞', label: 'Светлая' },
    { value: 'dark' as const, icon: '🌙', label: 'Тёмная' },
    { value: 'retro' as const, icon: '🎮', label: 'Ретро' },
  ];

  // Высота статус-бара для разных платформ
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  return (
    <View style={{ flex: 1, backgroundColor: styles.Colors.background }}>
      {/* Статус-бар */}
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={styles.Colors.background}
      />

      <ScrollView
        style={styles.Containers.screen}
        contentContainerStyle={{
          paddingTop: statusBarHeight + 20, // Добавляем отступ сверху
          paddingBottom: 20
        }}
      >

        {/* Секция выбора темы */}
        <Text style={[styles.Typography.subtitle, { marginBottom: 20 }]}>Выбор темы</Text>

        {/* Контейнер для иконок тем в строку */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 40
        }}>
          {themeOptions.map((themeOption) => (
            <TouchableOpacity
              key={themeOption.value}
              style={[
                {
                  width: 100,
                  height: 100,
                  borderRadius: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme === themeOption.value
                    ? styles.Colors.primary
                    : styles.Colors.surface,
                  borderWidth: 3,
                  borderColor: theme === themeOption.value
                    ? styles.Colors.primaryDark
                    : styles.Colors.border,
                  elevation: theme === themeOption.value ? 4 : 2,
                  shadowColor: styles.Colors.textPrimary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }
              ]}
              onPress={() => handleThemeSelect(themeOption.value)}
            >
              <Text style={{ fontSize: 24 }}>{themeOption.icon}</Text>
              <Text style={[
                styles.Typography.caption,
                {
                  marginTop: 5,
                  color: theme === themeOption.value
                    ? styles.Colors.textLight
                    : styles.Colors.textSecondary,
                  fontWeight: theme === themeOption.value ? 'bold' : 'normal'
                }
              ]}>
                {themeOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Секция выбора сложности */}
        <Text style={[styles.Typography.subtitle, { marginBottom: 20 }]}>Настройки сложности</Text>

        {/* Карусель сложности */}
        <View style={{
          alignItems: 'center',
          marginBottom: 40,
          padding: 20,
          backgroundColor: styles.Colors.surface,
          borderRadius: 15,
          elevation: 3,
          shadowColor: styles.Colors.textPrimary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>

          {/* Отображение текущей сложности */}
          <Text style={[
            styles.Typography.heading,
            {
              fontSize: 22,
              marginBottom: 10,
              color: styles.Colors.primary,
              fontWeight: 'bold'
            }
          ]}>
            {difficulty.label}
          </Text>

          {/* Информация о размере поля */}
          <Text style={[
            styles.Typography.body,
            {
              marginBottom: 20,
              color: styles.Colors.textSecondary
            }
          ]}>
            Поле {difficulty.rows} × {difficulty.columns}
          </Text>

          {/* Кнопки навигации */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 30
          }}>

            {/* Кнопка назад */}
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: styles.Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
              }}
              onPress={handlePrevDifficulty}
            >
              <Text style={{
                fontSize: 20,
                color: styles.Colors.textLight,
                fontWeight: 'bold'
              }}>
                ←
              </Text>
            </TouchableOpacity>

            {/* Индикатор прогресса */}
            <View style={{ alignItems: 'center' }}>
              <Text style={[
                styles.Typography.caption,
                { color: styles.Colors.textSecondary }
              ]}>
                {currentDifficultyIndex + 1} / {difficultyLevels.length}
              </Text>
              {/* Точечный индикатор */}
              <View style={{
                flexDirection: 'row',
                gap: 5,
                marginTop: 5
              }}>
                {difficultyLevels.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: index === currentDifficultyIndex
                        ? styles.Colors.primary
                        : styles.Colors.border,
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Кнопка вперед */}
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: styles.Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
              }}
              onPress={handleNextDifficulty}
            >
              <Text style={{
                fontSize: 20,
                color: styles.Colors.textLight,
                fontWeight: 'bold'
              }}>
                →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Дополнительная информация о сложности */}
          <View style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: styles.Colors.background,
            borderRadius: 10,
            width: '100%'
          }}>
            <Text style={[
              styles.Typography.caption,
              {
                textAlign: 'center',
                color: styles.Colors.textSecondary,
                fontStyle: 'italic'
              }
            ]}>
              {difficulty.testMode
                ? 'Тестовый режим для отладки'
                : `Примерное время решения: ${getEstimatedTime(difficulty)}`}
            </Text>
          </View>
        </View>

        {/* Кнопка возврата */}
        <TouchableOpacity
          style={[
            styles.Buttons.primary,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.Typography.button}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Вспомогательная функция для оценки времени решения
const getEstimatedTime = (difficulty: any): string => {
  const times: { [key: string]: string } = {
    'Легкая (3x3)': '1-2 минуты',
    'Стандартная (4x4)': '3-5 минут',
    'Сложная (5x5)': '10-15 минут',
    'Эксперт (6x6)': '20-30 минут',
    'Тестовый (3x3)': 'менее минуты'
  };
  return times[difficulty.label] || 'неизвестно';
};

export default SettingsScreen;
