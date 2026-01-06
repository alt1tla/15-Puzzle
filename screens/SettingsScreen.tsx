// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Platform, Switch, TextInput, Alert } from 'react-native';
import { useGameSettings, boardSizes } from '../contexts/GameSettingsContext';
import { useAudioSettings } from '../contexts/AudioSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import { useGameSounds } from '../hooks/useGameSound';
import { VibrationService } from '../services/VibrationService';

type Props = {
  navigation: any;
};

const SettingsScreen = ({ navigation }: Props) => {
  const { boardSize, setBoardSize, theme, setTheme, playerName, setPlayerName } = useGameSettings();
  const styles = createStyles(theme);
  const { playButtonSound } = useGameSounds();

  // Состояние для режима редактирования
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempPlayerName, setTempPlayerName] = useState(playerName);

  // Обработчик сохранения имени
  const handleSaveName = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration();

    const trimmedName = tempPlayerName.trim();

    if (!trimmedName) {
      Alert.alert(
        'Ошибка',
        'Имя не может быть пустым',
        [{ text: 'OK', onPress: () => setTempPlayerName(playerName) }]
      );
      return;
    }

    if (trimmedName.length > 20) {
      Alert.alert(
        'Ошибка',
        'Имя не может быть длиннее 20 символов',
        [{ text: 'OK' }]
      );
      return;
    }

    // Сохраняем новое имя
    setPlayerName(trimmedName);
    setIsEditingName(false);

    // Показываем уведомление об успешном сохранении
    Alert.alert(
      'Сохранено',
      `Имя изменено на "${trimmedName}"`,
      [{ text: 'OK' }]
    );
  };

  // Добавляем настройки аудио
  const {
    isMusicEnabled,
    isSoundEffectsEnabled,
    musicVolume,
    effectsVolume,
    toggleMusic,
    toggleSoundEffects,
    setMusicVolume,
    setEffectsVolume,
  } = useAudioSettings();

  // Находим текущий индекс размера поля
  const currentBoardSizeIndex = boardSizes.findIndex(
    size => size.label === boardSize.label
  );

  // Обработчик переключения размера поля вперед
  const handleNextBoardSize = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    const nextIndex = (currentBoardSizeIndex + 1) % boardSizes.length;
    setBoardSize(boardSizes[nextIndex]);
  };

  // Обработчик переключения размера поля назад
  const handlePrevBoardSize = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    const prevIndex = currentBoardSizeIndex === 0
      ? boardSizes.length - 1
      : currentBoardSizeIndex - 1;
    setBoardSize(boardSizes[prevIndex]);
  };

  // Обработчик выбора темы
  const handleThemeSelect = async (selectedTheme: 'light' | 'dark' | 'chinese') => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    setTheme(selectedTheme);
  };

  // Обработчик сохранения и возврата
  const handleSave = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration();

    // Если режим редактирования активен, сохраняем имя перед выходом
    if (isEditingName && tempPlayerName.trim()) {
      setPlayerName(tempPlayerName.trim());
    }

    navigation.goBack();
  };

  // Обработчик переключения музыки
  const handleToggleMusic = async () => {
    await playButtonSound();
    toggleMusic();
  };

  // Обработчик переключения звуковых эффектов
  const handleToggleSoundEffects = async () => {
    await playButtonSound();
    toggleSoundEffects();
  };

  // Обработчик изменения громкости музыки
  const handleMusicVolumeChange = async (volume: number) => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    setMusicVolume(volume);
  };

  // Обработчик изменения громкости эффектов
  const handleEffectsVolumeChange = async (volume: number) => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    setEffectsVolume(volume);
  };

  // Описания тем для отображения
  const themeOptions = [
    { value: 'light' as const, icon: '🌞', label: 'Светлая' },
    { value: 'dark' as const, icon: '🌚', label: 'Тёмная' },
    { value: 'chinese' as const, icon: '🐲', label: 'Китай' },
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

        <Text style={[styles.Typography.title, { marginBottom: 40 }]}>Настройки</Text>

        {/* Секция редактирования имени */}
        <Text style={[styles.Typography.subtitle, { marginBottom: 10 }]}>Имя игрока</Text>

        <View style={[
          styles.Containers.card,
          { marginBottom: 30 }
        ]}>
          {isEditingName ? (
            // Режим редактирования
            <View>
              <TextInput
                style={[
                  styles.Typography.body,
                  {
                    padding: 12,
                    backgroundColor: styles.Colors.surface,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: styles.Colors.primary,
                    color: styles.Colors.textPrimary,
                    marginBottom: 15,
                    fontSize: 16,
                  }
                ]}
                value={tempPlayerName}
                onChangeText={setTempPlayerName}
                placeholder="Введите ваше имя"
                placeholderTextColor={styles.Colors.secondary}
                autoFocus
                maxLength={20}
                onSubmitEditing={() => handleSaveName()}
              />

              <View style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'flex-end'
              }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: styles.Colors.accent,
                  }}
                  onPress={() => {
                    setIsEditingName(false);
                    setTempPlayerName(playerName); // Сброс к исходному имени
                    VibrationService.playButtonPressVibration();
                  }}
                >
                  <Text style={[
                    styles.Typography.button,
                    { color: styles.Colors.textLight }
                  ]}>
                    Отмена
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: styles.Colors.primary,
                  }}
                  onPress={() => handleSaveName()}
                >
                  <Text style={[
                    styles.Typography.button,
                    { color: styles.Colors.textLight }
                  ]}>
                    Сохранить
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Режим просмотра
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}
              onPress={() => {
                setIsEditingName(true);
                VibrationService.playButtonPressVibration();
              }}
            >
              <View>
                <Text style={[styles.Typography.body, { fontWeight: 'bold' }]}>
                  {playerName || 'Не задано'}
                </Text>
                <Text style={[
                  styles.Typography.caption,
                  { marginTop: 4, color: styles.Colors.secondary }
                ]}>
                  Нажмите для изменения
                </Text>
              </View>

              <View style={{
                padding: 8,
                backgroundColor: styles.Colors.primary + '20',
                borderRadius: 8,
              }}>
                <Text style={{ color: styles.Colors.primary }}>✏️</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.Typography.subtitle, { marginBottom: 10 }]}>
          Размер поля
        </Text>

        <Text style={[styles.Typography.subtitle, { marginBottom: 10 }]}>Тема</Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
          backgroundColor: styles.Colors.surface,
          padding: 5,
          borderRadius: 20
        }}>
          {themeOptions.map((themeOption) => (
            <TouchableOpacity
              key={themeOption.value}
              style={[
                {
                  flexGrow: 1,
                  height: 100,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme === themeOption.value
                    ? styles.Colors.primary
                    : 'transrepment',
                }
              ]}
              onPress={() => handleThemeSelect(themeOption.value)}
            >
              <Text style={{ fontSize: 48 }}>{themeOption.icon}</Text>
              <Text style={[
                styles.Typography.caption,
                {
                  marginTop: 5,
                  color: theme === themeOption.value
                    ? styles.Colors.textLight
                    : styles.Colors.textPrimary,
                  fontWeight: 'normal'
                }
              ]}>
                {themeOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.Typography.subtitle, { marginBottom: 10 }]}>
          Размер поля
        </Text>

        <View style={{
          alignItems: 'center',
          marginBottom: 30,
          elevation: 3,
          height: 100,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 5,
            width: '100%',
            maxWidth: '100%'
          }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: '100%',
                borderRadius: 20,
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

            <View style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: styles.Colors.surface,
              padding: 15,
              borderRadius: 20,
              flexGrow: 1
            }}>
              <Text style={[
                styles.Typography.heading,
                {
                  color: styles.Colors.primary,
                  fontSize: 48,
                  lineHeight: 48
                }
              ]}>
                {boardSize.label}
              </Text>
              <Text style={[
                styles.Typography.body,
                {
                  color: styles.Colors.textPrimary
                }
              ]}>
                {boardSize.testMode
                  ? 'Тестовый режим'
                  : `${getEstimatedTime(boardSize)}`}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 50,
                height: '100%',
                borderRadius: 20,
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
        </View>

        <Text style={[styles.Typography.subtitle, { marginBottom: 10 }]}>Музыка и звуки</Text>

        <View style={[
          styles.Containers.card,
        ]}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5
          }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.Typography.body, { fontWeight: 'bold' }]}>
                🎵 Фоновая музыка
              </Text>
              <Text style={[styles.Typography.caption, { marginTop: 4 }]}>
                Атмосферная мелодия во время игры
              </Text>
            </View>
            <Switch
              value={isMusicEnabled}
              onValueChange={handleToggleMusic}
              trackColor={{ false: styles.Colors.border, true: styles.Colors.primary }}
              thumbColor={styles.Colors.surface}
            />
          </View>

          {isMusicEnabled && (
            <View style={{ marginTop: 15 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}>
                <Text style={styles.Typography.caption}>🔈</Text>
                <View style={{
                  flex: 1,
                  height: 30,
                  justifyContent: 'center'
                }}>
                  <View style={{
                    height: 6,
                    backgroundColor: styles.Colors.border,
                    borderRadius: 3,
                  }}>
                    <View style={{
                      width: `${musicVolume * 100}%`,
                      height: '100%',
                      backgroundColor: styles.Colors.primary,
                      borderRadius: 3,
                    }} />
                  </View>
                </View>
                <Text style={styles.Typography.caption}>🔊</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between'
              }}>
                {[0, 0.25, 0.5, 0.75, 1].map((volume) => (
                  <TouchableOpacity
                    key={volume}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      borderRadius: 6,
                      backgroundColor: musicVolume === volume
                        ? styles.Colors.primary
                        : 'transparent',
                    }}
                    onPress={() => handleMusicVolumeChange(volume)}
                  >
                    <Text style={[
                      styles.Typography.caption,
                      {
                        fontWeight: musicVolume === volume ? 'bold' : 'normal',
                        color: musicVolume === volume
                          ? styles.Colors.textLight
                          : styles.Colors.textPrimary
                      }
                    ]}>
                      {Math.round(volume * 100)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={[
          styles.Containers.card,
          { marginBottom: 30 }
        ]}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5
          }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.Typography.body, { fontWeight: 'bold' }]}>
                🎮 Звуковые эффекты
              </Text>
              <Text style={[styles.Typography.caption, { marginTop: 4 }]}>
                Звуки перемещения, победы и кнопок
              </Text>
            </View>
            <Switch
              value={isSoundEffectsEnabled}
              onValueChange={handleToggleSoundEffects}
              trackColor={{ false: styles.Colors.border, true: styles.Colors.primary }}
              thumbColor={styles.Colors.surface}
            />
          </View>

          {isSoundEffectsEnabled && (
            <View style={{ marginTop: 15 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}>
                <Text style={styles.Typography.caption}>🔈</Text>
                <View style={{
                  flex: 1,
                  height: 30,
                  justifyContent: 'center'
                }}>
                  <View style={{
                    height: 6,
                    backgroundColor: styles.Colors.border,
                    borderRadius: 3,
                  }}>
                    <View style={{
                      width: `${effectsVolume * 100}%`,
                      height: '100%',
                      backgroundColor: styles.Colors.primary,
                      borderRadius: 3,
                    }} />
                  </View>
                </View>
                <Text style={styles.Typography.caption}>🔊</Text>
              </View>

              {/* Быстрый выбор громкости */}
              <View style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between'
              }}>
                {[0, 0.25, 0.5, 0.75, 1].map((volume) => (
                  <TouchableOpacity
                    key={volume}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      borderRadius: 6,
                      backgroundColor: effectsVolume === volume
                        ? styles.Colors.primary
                        : 'transparent',
                    }}
                    onPress={() => handleEffectsVolumeChange(volume)}
                  >
                    <Text style={[
                      styles.Typography.caption,
                      {
                        fontWeight: effectsVolume === volume ? 'bold' : 'normal',
                        color: effectsVolume === volume
                          ? styles.Colors.textLight
                          : styles.Colors.textPrimary
                      }
                    ]}>
                      {Math.round(volume * 100)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.Buttons.primary,
          ]}
          onPress={handleSave}
        >
          <Text style={[styles.Typography.button, { fontWeight: 'bold' }]}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Вспомогательная функция для оценки времени решения
const getEstimatedTime = (boardSize: any): string => {
  const times: { [key: string]: string } = {
    '3x3': 'Решается за 2 минуты',
    '4x4': 'База на 5 минут',
    '5x5': 'Займёт 15 минут',
    '6x6': 'Влипнешь на 30 минут',
    'Тестовый': 'менее минуты'
  };
  return times[boardSize.label] || 'неизвестно';
};

export default SettingsScreen;
