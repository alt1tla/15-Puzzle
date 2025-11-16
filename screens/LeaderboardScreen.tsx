import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useDeviceId } from '../hooks/useDeviceId';
import { leaderboardService, LeaderboardEntry } from '../services/LeaderboardService';
import { createStyles } from '../styles/GlobalStyles';

type Props = {
  navigation: any;
};

const LeaderboardScreen = ({ navigation }: Props) => {
  const { theme } = useGameSettings();
  const deviceId = useDeviceId();
  const styles = createStyles(theme);
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedBoardSize, setSelectedBoardSize] = useState(4);
  const [selectedGameMode, setSelectedGameMode] = useState<'classic' | 'timed'>('classic');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardService.getLeaderboard(
        selectedBoardSize,
        selectedGameMode,
        20
      );
      setLeaderboard(response.entries);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  useEffect(() => {
    loadLeaderboard();
  }, [selectedBoardSize, selectedGameMode]);

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

  return (
    <View style={[styles.Containers.screen, { padding: 20 }]}>
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
            ⏱️ На время
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
        >
          {leaderboard.map((entry, index) => (
            <View
              key={entry.id}
              style={[
                styles.Containers.card,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                  borderColor: entry.device_id === deviceId ? styles.Colors.primary : 'transparent',
                  borderWidth: entry.device_id === deviceId ? 2 : 0,
                }
              ]}
            >
              <Text style={[
                styles.Typography.heading,
                {
                  width: 30,
                  color: getRankColor(index),
                  fontWeight: 'bold'
                }
              ]}>
                #{index + 1}
              </Text>
              
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.Typography.body, { fontWeight: 'bold' }]}>
                  {entry.player_name}
                </Text>
                <Text style={styles.Typography.caption}>
                  {selectedGameMode === 'classic' 
                    ? `${entry.moves} ходов` 
                    : `${formatTime(entry.time_seconds)} • ${entry.moves} ходов`
                  }
                </Text>
              </View>

              {entry.device_id === deviceId && (
                <Text style={[styles.Typography.caption, { color: styles.Colors.primary }]}>
                  Вы
                </Text>
              )}
            </View>
          ))}

          {leaderboard.length === 0 && !loading && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
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
    </View>
  );
};

export default LeaderboardScreen;
