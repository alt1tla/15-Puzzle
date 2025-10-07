// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { useGameSettings, boardSizes } from '../contexts/GameSettingsContext'; // Изменено
import { createStyles } from '../styles/GlobalStyles';

type Props = {
  navigation: any;
};

const SettingsScreen = ({ navigation }: Props) => {
  const { boardSize, setBoardSize, theme, setTheme, playerName } = useGameSettings(); // Изменено
  const styles = createStyles(theme);

  // Находим текущий индекс размера поля
  const currentBoardSizeIndex = boardSizes.findIndex( // Изменено
    size => size.label === boardSize.label // Изменено
  );

  // Обработчик переключения размера поля вперед
  const handleNextBoardSize = () => { // Изменено
    const nextIndex = (currentBoardSizeIndex + 1) % boardSizes.length; // Изменено
    setBoardSize(boardSizes[nextIndex]); // Изменено
  };

  // Обработчик переключения размера поля назад
  const handlePrevBoardSize = () => { // Изменено
    const prevIndex = currentBoardSizeIndex === 0
      ? boardSizes.length - 1 // Изменено
      : currentBoardSizeIndex - 1;
    setBoardSize(boardSizes[prevIndex]); // Изменено
  };

  // Обработчик выбора темы
  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'retro') => {
    setTheme(selectedTheme);
  };

  // Описания тем для отображения
  const themeOptions = [
    { value: 'light' as const, icon: '🌞', label: 'Светлая' },
    { value: 'dark' as const, icon: '🌙', label: 'Тёмная' },
    { value: 'retro' as const, icon: '🎮', label: 'Ретро' },
  ];

  // Высота статус-бара для разных платформ
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  return (
    <View style={{ flex: 1, backgroundColor: styles.Colors.background }}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={styles.Colors.background}
      />

      <ScrollView
        style={styles.Containers.screen}
        contentContainerStyle={{
          paddingTop: statusBarHeight + 20,
          paddingBottom: 20
        }}
      >
        <Text style={[styles.Typography.subtitle, { marginBottom: 20 }]}>Выбор темы</Text>
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
        <Text style={[styles.Typography.subtitle, { marginBottom: 20 }]}>Настройки размера поля</Text>
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
          <Text style={[
            styles.Typography.heading,
            {
              fontSize: 22,
              marginBottom: 10,
              color: styles.Colors.primary,
              fontWeight: 'bold'
            }
          ]}>
            {boardSize.label}
          </Text>
          <Text style={[
            styles.Typography.body,
            {
              marginBottom: 20,
              color: styles.Colors.textSecondary
            }
          ]}>
            Поле {boardSize.rows} × {boardSize.columns}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 30
          }}>
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
              onPress={handlePrevBoardSize}
            >
              <Text style={{
                fontSize: 20,
                color: styles.Colors.textLight,
                fontWeight: 'bold'
              }}>
                ←
              </Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={[
                styles.Typography.caption,
                { color: styles.Colors.textSecondary }
              ]}>
                {currentBoardSizeIndex + 1} / {boardSizes.length}
              </Text>
              <View style={{
                flexDirection: 'row',
                gap: 5,
                marginTop: 5
              }}>
                {boardSizes.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: index === currentBoardSizeIndex
                        ? styles.Colors.primary
                        : styles.Colors.border,
                    }}
                  />
                ))}
              </View>
            </View>

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
              onPress={handleNextBoardSize}
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
              {boardSize.testMode
                ? 'Тестовый режим для отладки'
                : `Примерное время решения: ${getEstimatedTime(boardSize)}`}
            </Text>
          </View>
        </View>
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
const getEstimatedTime = (boardSize: any): string => { // Изменено
  const times: { [key: string]: string } = {
    '3x3': '1-2 минуты',
    '4x4': '3-5 минут',
    '5x5': '10-15 минут',
    '6x6': '20-30 минут',
    'Тестовый 3x3': 'менее минуты'
  };
  return times[boardSize.label] || 'неизвестно';
};

export default SettingsScreen;
