import React, { useState, useEffect, useCallback } from 'react'; // Добавим useCallback
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar, Platform } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useDeviceId } from '../hooks/useDeviceId';
import { leaderboardService, LeaderboardEntry } from '../services/LeaderboardService';
import { createStyles } from '../styles/GlobalStyles';

type Props = {
  navigation: any;
};

const LeaderboardScreen = ({ navigation }: Props) => {
  const { theme, boardSize, playerName } = useGameSettings();
  const deviceId = useDeviceId();
  const styles = createStyles(theme);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [isUserInTop, setIsUserInTop] = useState<boolean>(false);
  const [selectedBoardSize, setSelectedBoardSize] = useState(boardSize.columns);
  const [selectedGameMode, setSelectedGameMode] = useState<'classic' | 'timed'>('classic');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Обернем в useCallback для стабильной ссылки
  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leaderboardService.getLeaderboard(
        selectedBoardSize,
        selectedGameMode,
        5,
        deviceId
      );

      setLeaderboard(response.entries);

      // Всегда сбрасываем состояние
      setIsUserInTop(false);
      setUserPosition(null);

      // Логика определения позиции пользователя
      if (response.user_position !== undefined && response.user_position !== null) {
        setUserPosition(response.user_position);
        // Если позиция пользователя в топ
        if (response.user_position <= 5) {
          setIsUserInTop(true);
        } else {
          setIsUserInTop(false);
        }
      }
    } catch (error) {

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedBoardSize, selectedGameMode, deviceId]); // Добавляем deviceId в зависимости

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]); // Теперь зависит от loadLeaderboard

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return '#FFD700'; // золото
    if (index === 1) return '#C0C0C0'; // серебро
    if (index === 2) return '#CD7F32'; // бронза
    return styles.Colors.textPrimary;
  };

  const renderUserPositionCard = () => {
    // Если пользователь в топе, не показываем отдельную карточку
    if (isUserInTop) {
      return null;
    }

    // Если есть данные о позиции пользователя
    if (userPosition !== null) {
      return (
        <View style={{ marginBottom: 20 }}>
          <View
            style={[
              styles.Containers.card,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: styles.Colors.primary,
                borderWidth: 2,
                backgroundColor: styles.Colors.primary + '10',
              }
            ]}
          >
            {/* ФИКС ДЛЯ ДВУЗНАЧНЫХ ЧИСЕЛ: динамическая ширина */}
            <Text style={[
              styles.Typography.heading,
              {
                minWidth: userPosition > 5 ? 40 : 30, // 40 для двузначных, 30 для однозначных
                textAlign: 'center',
                color: styles.Colors.primary,
                fontWeight: 'bold'
              }
            ]}>
              #{userPosition}
            </Text>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[styles.Typography.body, { fontWeight: 'bold' }]}
                numberOfLines={1} // Чтобы имя не переносилось
                ellipsizeMode="tail"
              >
                {playerName}
              </Text>
            </View>

            <Text style={[styles.Typography.caption, { color: styles.Colors.primary }]}>
              Вы
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <View style={[
            styles.Containers.card,
            {
              alignItems: 'center',
              padding: 20,
              borderColor: styles.Colors.primary,
              borderWidth: 1,
              borderStyle: 'dashed',
              backgroundColor: styles.Colors.surface,
            }
          ]}>
            <Text style={[styles.Typography.body, {
              textAlign: 'center',
              color: styles.Colors.secondary,
              marginBottom: 8
            }]}>
              У вас пока нет результата в этой категории
            </Text>

            <Text style={[styles.Typography.caption, {
              textAlign: 'center',
              color: styles.Colors.secondary
            }]}>
              Сыграйте в игру, чтобы появиться в рейтинге!
            </Text>

            {/* Кнопка для быстрого перехода к игре */}
            <TouchableOpacity
              style={{
                marginTop: 15,
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: styles.Colors.primary,
                borderRadius: 10,
                minWidth: 200,
              }}
              onPress={() => {
                // Переход на главный экран или экран игры
                navigation.navigate('Home'); // или 'Game'
              }}
            >
              <Text style={[
                styles.Typography.button,
                {
                  color: styles.Colors.textLight,
                  textAlign: 'center'
                }
              ]}>
                🎮 Сыграть сейчас
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };


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
        <Text style={[styles.Typography.title, { marginBottom: 20 }]}>
          Таблица рекордов
        </Text>


        {/* Фильтры по размеру поля */}
        <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[3, 4, 5].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                  },
                  selectedBoardSize === size
                    ? { backgroundColor: styles.Colors.primary }
                    : { backgroundColor: styles.Colors.surface }
                ]}
                onPress={() => setSelectedBoardSize(size)}
              >
                <Text style={[
                  styles.Typography.button,
                  selectedBoardSize === size
                    ? { color: styles.Colors.textLight }
                    : { color: styles.Colors.textPrimary }
                ]}>
                  {size}x{size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Фильтры по режиму игры */}
        <View style={{ flexDirection: 'row', marginBottom: 20, gap: 10 }}>
          <TouchableOpacity
            style={[
              {
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flex: 1,
              },
              selectedGameMode === 'classic'
                ? { backgroundColor: styles.Colors.primary }
                : { backgroundColor: styles.Colors.surface }
            ]}
            onPress={() => setSelectedGameMode('classic')}
          >
            <Text style={[
              styles.Typography.button,
              selectedGameMode === 'classic'
                ? { color: styles.Colors.textLight }
                : { color: styles.Colors.textPrimary }
            ]}>
              🏆 Классика
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flex: 1,
              },
              selectedGameMode === 'timed'
                ? { backgroundColor: styles.Colors.primary }
                : { backgroundColor: styles.Colors.surface }
            ]}
            onPress={() => setSelectedGameMode('timed')}
          >
            <Text style={[
              styles.Typography.button,
              selectedGameMode === 'timed'
                ? { color: styles.Colors.textLight }
                : { color: styles.Colors.textPrimary }
            ]}>
              ⏱️ С таймером
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={styles.Colors.primary} />
            <Text style={[styles.Typography.body, { marginTop: 10 }]}>
              Загрузка рейтинга...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={true}
          >
            {/* Позиция пользователя (если не в топ-9) */}
            {renderUserPositionCard()}

            <Text style={[
              styles.Typography.subtitle,
              {
                marginBottom: 10,
                marginTop: (userPosition !== null && !isUserInTop) ? 0 : 20
              }
            ]}>
              Топ-5 игроков
            </Text>

            {leaderboard.map((entry, index) => (
              <View
                key={`${entry.id}_${entry.device_id}`} // Уникальный ключ
                style={[
                  styles.Containers.card,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                    minHeight: 60, // Минимальная высота для консистентности
                    borderColor: entry.device_id === deviceId ? styles.Colors.primary : 'transparent',
                    borderWidth: entry.device_id === deviceId ? 2 : 0,
                    backgroundColor: entry.device_id === deviceId ? styles.Colors.primary + '10' : undefined,
                  }
                ]}
              >
                {/* ФИКС ДЛЯ ТОП-9: динамическая ширина для номеров */}
                <Text style={[
                  styles.Typography.heading,
                  {
                    minWidth: index >= 9 ? 40 : 30, // 40 для 10+ (хотя в топе только 1-9)
                    textAlign: 'center',
                    color: getRankColor(index),
                    fontWeight: 'bold'
                  }
                ]}>
                  #{index + 1}
                </Text>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[styles.Typography.body, { fontWeight: 'bold' }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {entry.player_name}
                  </Text>
                  <Text style={styles.Typography.caption}>
                    {selectedGameMode === 'classic'
                      ? `${entry.moves} ходов • ${formatTime(entry.time_seconds)} `
                      : `${formatTime(entry.time_seconds)} • ${entry.moves} ходов`
                    }
                  </Text>
                </View>

                {entry.device_id === deviceId && (
                  <Text style={[
                    styles.Typography.caption,
                    {
                      color: styles.Colors.primary,
                      paddingLeft: 8 // Отступ чтобы не слипалось
                    }
                  ]}>
                    Вы
                  </Text>
                )}
              </View>
            ))}

            {leaderboard.length === 0 && !loading && (
              <View style={{ alignItems: 'center', marginTop: 40, padding: 20 }}>
                <Text style={[styles.Typography.body, { textAlign: 'center' }]}>
                  Пока нет записей в рейтинге
                </Text>
                <Text style={[styles.Typography.caption, { textAlign: 'center', marginTop: 8 }]}>
                  Сыграйте в игру, чтобы появиться здесь!
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
};

export default LeaderboardScreen;
