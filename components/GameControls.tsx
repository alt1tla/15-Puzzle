// components/GameControls.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useGameSettings, gameModes, GameMode, boardSizes } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import { useGameSounds } from '../hooks/useGameSound';
import { ImageService } from '../services/ImageService';
import { VibrationService } from '../services/VibrationService';

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
  showModeModal = false,
}) => {
  const { theme, gameMode, setGameMode, boardSize, setImagePuzzleData } = useGameSettings();
  const styles = createStyles(theme);
  const { playButtonSound } = useGameSounds();
  const [internalShowModeModal, setInternalShowModeModal] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Используем переданное состояние или внутреннее состояние
  const modalVisible = showModeModal !== undefined ? showModeModal : internalShowModeModal;

  const handleModeSelect = async (selectedMode: GameMode) => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    if (selectedMode === 'image') {
      await handleImageModeSelect();
    } else {
      setGameMode(selectedMode);
      handleCloseModal();
    }
  };

  const handleImageModeSelect = async () => {
    setIsLoadingImage(true);

    try {
      const imageUri = await ImageService.pickImage();

      if (imageUri) {
        // Используем быструю версию для тестирования
        const pieces = await ImageService.quickSliceImage(
        imageUri, 
        boardSize.rows, 
        boardSize.columns
      );


        if (pieces.length === boardSize.rows * boardSize.columns) {
          // Сохраняем данные изображения
          setImagePuzzleData({
          originalUri: imageUri,
          pieces,
          currentBoardSize: boardSize.label
        });

          // Переключаемся в режим изображения
          setGameMode('image');
          handleCloseModal();
        } else {
          alert('Не удалось обработать изображение. Попробуйте другое изображение.');
        }
      }
    } catch (error) {
      alert('Не удалось обработать изображение. Попробуйте другое.');
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleOpenModal = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    if (onOpenModeModal) {
      onOpenModeModal();
    } else {
      setInternalShowModeModal(true);
    }
  };

  const handleCloseModal = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    if (onCloseModeModal) {
      onCloseModeModal();
    } else {
      setInternalShowModeModal(false);
    }
  };

  const handleRestartWithSound = async () => {
    await playButtonSound();
    VibrationService.playErrorVibration()
    onRestart();
  };

  const handleMenuWithSound = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
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

            {isLoadingImage ? (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <ActivityIndicator size="large" color={styles.Colors.primary} />
                <Text style={[styles.Typography.body, { marginTop: 20, textAlign: 'center' }]}>
                  Загрузка изображения...
                </Text>
                <Text style={[styles.Typography.caption, { marginTop: 10, textAlign: 'center' }]}>
                  Выберите изображение из галереи
                </Text>
              </View>
            ) : (
              <>
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
                              : 'transparent',
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 }}>
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
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GameControls;
