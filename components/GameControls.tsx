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
    <View style={{ alignItems: 'center', }}>
      {/* Селектор режима игры (если включен) */}
      {showModeSelector && (
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'space-between', width: '100%' }}>
          <TouchableOpacity style={styles.Buttons.secondary} onPress={handleMenuWithSound}>
            <Text style={styles.Typography.button}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.Buttons.primary,
              {
                minWidth: 200,
                backgroundColor: styles.Colors.primary,
                flexGrow: 1
              }
            ]}
            onPress={handleOpenModal}
          >
            <Text style={[styles.Typography.button, { fontWeight: 'bold' }]}>{getCurrentModeLabel()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Buttons.secondary} onPress={handleRestartWithSound}>
            <Text style={styles.Typography.button}>↺</Text>
          </TouchableOpacity>
        </View>
      )}

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
            backgroundColor: styles.Colors.background,
            borderRadius: 20,
            padding: 15,
            minWidth: 350
          }}>
            <Text style={[
              styles.Typography.subtitle,
              { marginBottom: 40, textAlign: 'center' }
            ]}>
              Режим игры
            </Text>

            <View style={{ backgroundColor: styles.Colors.surface, flexDirection: 'column', borderRadius: 20, padding: 5 }}>
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
                          : 'transparment',
                        borderRadius: 15,
                        marginBottom: 0,
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
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5,}}>
                      <Text style={[
                        styles.Typography.caption,
                        {
                          color: gameMode === mode.value
                            ? styles.Colors.textLight
                            : styles.Colors.textPrimary
                        }
                      ]}>
                        {mode.description}
                      </Text>
                      {timeInfo && (
                        <Text style={[
                          styles.Typography.caption,
                          {
                            // fontStyle: 'italic',
                            // fontWeight: 'bold',
                            color: gameMode === mode.value
                              ? styles.Colors.textLight
                              : styles.Colors.textPrimary
                          }
                        ]}>
                          {timeInfo}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.Buttons.primary,
                { marginTop: 30 }
              ]}
              onPress={handleCloseModal}
            >
              <Text style={[
                styles.Typography.button,
                { fontWeight: 'bold' }
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
