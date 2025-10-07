// components/GameControls.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import { useGameSettings, gameModes, GameMode } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';

type GameControlsProps = {
  onRestart: () => void;
  onMenu: () => void;
  showModeSelector?: boolean;
};

const GameControls: React.FC<GameControlsProps> = ({ onRestart, onMenu, showModeSelector = false }) => {
  const { theme, gameMode, setGameMode } = useGameSettings();
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

  return (
    <View style={{ alignItems: 'center', gap: 15 }}>
      {/* Селектор режима игры (если включен) */}
      {showModeSelector && (
        <TouchableOpacity
          style={[
            styles.Buttons.primary,
            {
              minWidth: 200,
            }
          ]}
          onPress={() => setShowModeModal(true)}
        >
          <Text style={styles.Typography.button}>{getCurrentModeLabel()}</Text>
        </TouchableOpacity>
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
              {gameModes.map((mode) => (
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
                  {mode.timeLimit > 0 && (
                    <Text style={[
                      styles.Typography.caption,
                      {
                        marginTop: 2,
                        fontStyle: 'italic',
                        color: gameMode === mode.value
                          ? styles.Colors.textLight
                          : styles.Colors.accent
                      }
                    ]}>
                      ⏱️ Лимит: {Math.floor(mode.timeLimit / 60)}:{(mode.timeLimit % 60).toString().padStart(2, '0')}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
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
