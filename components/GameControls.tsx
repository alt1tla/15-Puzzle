// components/GameControls.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import { useGameSettings, gameModes, GameMode, boardSizes } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import { useGameSounds } from '../hooks/useGameSound';

type GameControlsProps = {
  onRestart: () => void;
  onMenu: () => void;
  showModeSelector?: boolean;
  onOpenModeModal?: () => void;
  onCloseModeModal?: () => void;
  showModeModal?: boolean;
};

const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onMenu,
  showModeSelector = false,
  onOpenModeModal,
  onCloseModeModal,
  showModeModal = false
}) => {
  const { theme, gameMode, setGameMode, boardSize } = useGameSettings();
  const styles = createStyles(theme);
  const { playButtonSound } = useGameSounds();
  const [internalShowModeModal, setInternalShowModeModal] = useState(false);

  // Используем переданное состояние или внутреннее состояние
  const modalVisible = showModeModal !== undefined ? showModeModal : internalShowModeModal;

  const handleModeSelect = async (selectedMode: GameMode) => {
    await playButtonSound();
    setGameMode(selectedMode);
    handleCloseModal();
  };

  const handleOpenModal = async () => {
    await playButtonSound();
    if (onOpenModeModal) {
      onOpenModeModal();
    } else {
      setInternalShowModeModal(true);
    }
  };

  const handleCloseModal = async () => {
    await playButtonSound();
    if (onCloseModeModal) {
      onCloseModeModal();
    } else {
      setInternalShowModeModal(false);
    }
  };

  const handleRestartWithSound = async () => {
    await playButtonSound();
    onRestart();
  };

  const handleMenuWithSound = async () => {
    await playButtonSound();
    onMenu();
  };

  const getCurrentModeLabel = () => {
    const currentMode = gameModes.find(mode => mode.value === gameMode);
    return currentMode?.label || '🏆 Классика';
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
            onPress={handleOpenModal}
          >
            <Text style={styles.Typography.button}>{getCurrentModeLabel()}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Основные кнопки управления */}
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <TouchableOpacity style={styles.Buttons.primary} onPress={handleRestartWithSound}>
          <Text style={styles.Typography.button}>Заново</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Buttons.primary} onPress={handleMenuWithSound}>
          <Text style={styles.Typography.button}>В меню</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно выбора режима */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
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
                  const currentBoardSize = boardSizes.find((size: { label: string }) => size.label === boardSize.label);
                  if (currentBoardSize) {
                    const minutes = Math.floor(currentBoardSize.timeLimit / 60);
                    const seconds = currentBoardSize.timeLimit % 60;
                    timeInfo = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
              onPress={handleCloseModal}
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
