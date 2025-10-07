// components/GameControls.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import { useGameSettings, gameModes, GameMode, boardSizes } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';

type GameControlsProps = {
  onRestart: () => void;
  onMenu: () => void;
  showModeSelector?: boolean;
};

const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onMenu,
  showModeSelector = false
}) => {
  const { theme, gameMode, setGameMode, boardSize } = useGameSettings(); // Изменено: difficulty → boardSize
  const styles = createStyles(theme);
  const [showModeModal, setShowModeModal] = useState(false);

  const handleModeSelect = (selectedMode: GameMode) => {
    setGameMode(selectedMode);
    setShowModeModal(false);
  };

  const getCurrentModeLabel = () => {
    const currentMode = gameModes.find(mode => mode.value === gameMode);
    return currentMode?.label || '🏆 Классика';
  };

  // Получаем информацию о временном лимите для текущего размера поля
  const getTimeLimitInfo = () => {
    if (gameMode === 'time_attack') {
      const currentBoardSize = boardSizes.find((size: { label: string }) => size.label === boardSize.label); // Добавлен тип
      if (currentBoardSize) {
        const minutes = Math.floor(currentBoardSize.timeLimit / 60);
        const seconds = currentBoardSize.timeLimit % 60;
        return `Лимит: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    return '';
  };

  return (
    <View style={{ alignItems: 'center', gap: 15 }}>
      {/* Селектор режима игры (если включен) */}
      {showModeSelector && (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={[
              styles.Buttons.primary,
              {
                minWidth: 200,
                backgroundColor: styles.Colors.secondary
              }
            ]}
            onPress={() => setShowModeModal(true)}
          >
            <Text style={styles.Typography.button}>{getCurrentModeLabel()}</Text>
          </TouchableOpacity>
          {getTimeLimitInfo() && (
            <Text style={[styles.Typography.caption, { marginTop: 5, color: styles.Colors.accent }]}>
              {getTimeLimitInfo()}
            </Text>
          )}
        </View>
      )}

      {/* Основные кнопки управления */}
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <TouchableOpacity style={styles.Buttons.primary} onPress={onRestart}>
          <Text style={styles.Typography.button}>Заново</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Buttons.primary} onPress={onMenu}>
          <Text style={styles.Typography.button}>В меню</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно выбора режима */}
      <Modal
        visible={showModeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModeModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: styles.Colors.surface,
            borderRadius: 15,
            padding: 20,
            margin: 20,
            maxHeight: '80%',
            minWidth: 300
          }}>
            <Text style={[
              styles.Typography.subtitle,
              { marginBottom: 20, textAlign: 'center' }
            ]}>
              Выберите режим игры
            </Text>

            <ScrollView style={{ maxHeight: 400 }}>
              {gameModes.map((mode) => {
                // Для режима time_attack показываем лимит времени текущего размера поля
                let timeInfo = '';
                if (mode.value === 'time_attack') {
                  const currentBoardSize = boardSizes.find((size: { label: string }) => size.label === boardSize.label); // Добавлен тип
                  if (currentBoardSize) {
                    const minutes = Math.floor(currentBoardSize.timeLimit / 60);
                    const seconds = currentBoardSize.timeLimit % 60;
                    timeInfo = `Лимит: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                  }
                }

                return (
                  <TouchableOpacity
                    key={mode.value}
                    style={[
                      styles.Containers.card,
                      {
                        backgroundColor: gameMode === mode.value
                          ? styles.Colors.primary
                          : styles.Colors.surface,
                        marginVertical: 5,
                        borderWidth: 2,
                        borderColor: gameMode === mode.value
                          ? styles.Colors.primaryDark
                          : styles.Colors.border
                      }
                    ]}
                    onPress={() => handleModeSelect(mode.value)}
                  >
                    <Text style={[
                      styles.Typography.body,
                      {
                        fontWeight: 'bold',
                        color: gameMode === mode.value
                          ? styles.Colors.textLight
                          : styles.Colors.textPrimary
                      }
                    ]}>
                      {mode.label}
                    </Text>
                    <Text style={[
                      styles.Typography.caption,
                      {
                        marginTop: 5,
                        color: gameMode === mode.value
                          ? styles.Colors.textLight
                          : styles.Colors.textSecondary
                      }
                    ]}>
                      {mode.description}
                    </Text>
                    {timeInfo && (
                      <Text style={[
                        styles.Typography.caption,
                        {
                          marginTop: 2,
                          fontStyle: 'italic',
                          fontWeight: 'bold',
                          color: gameMode === mode.value
                            ? styles.Colors.textLight
                            : styles.Colors.accent
                        }
                      ]}>
                        ⏱️ {timeInfo}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.Buttons.outline,
                { marginTop: 15 }
              ]}
              onPress={() => setShowModeModal(false)}
            >
              <Text style={[
                styles.Typography.button,
                { color: styles.Colors.primary }
              ]}>
                Отмена
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GameControls;
