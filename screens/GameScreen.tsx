// screens/GameScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import GameHeader from '../components/GameHeader';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import { useGameSounds } from '../hooks/useGameSound';
import {
  createInitialBoard,
  createTestBoard,
  shuffleBoard,
  isSolved
} from '../utils/gameLogic';
import { VibrationService } from '../services/VibrationService';

type Props = {
  navigation: any;
  route: any;
};

const GameScreen = ({ navigation, route }: Props) => {
  const { theme, gameMode, addScore, boardSize, getTimeLimit, imagePuzzleData } = useGameSettings();
  const styles = createStyles(theme);
  const {
    playMoveSound,
    playCantMoveSound,
    playWinSound,
    playGameOverSound,
    playButtonSound
  } = useGameSounds();

  const { tails = 15, rows = 4, columns = 4, testMode = false } = route.params || {};

  // Проверка корректности параметров игрового поля
  if (rows * columns !== tails + 1) {
    Alert.alert('Ошибка', 'Некорректные параметры поля');
    navigation.goBack();
    return null;
  }

  const [board, setBoard] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Новое состояние для отслеживания запуска таймера
  const [showModeModal, setShowModeModal] = useState(false); // Новое состояние для модального окна

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeLimit = getTimeLimit();

  // Функция запуска таймера
  const startTimer = () => {
    if (!isTimerRunning && gameMode !== 'classic') {
      setIsTimerRunning(true);
    }
  };

  // Функция остановки таймера
  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  // Запуск/остановка таймера в зависимости от режима и состояния
  useEffect(() => {
    if (isGameActive && isTimerRunning && gameMode !== 'classic' && !showModeModal) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          // Проверка лимита времени только для time_attack
          if (gameMode === 'time_attack' && timeLimit > 0) {
            if (prevTime >= timeLimit) {
              handleTimeUp();
              return timeLimit;
            }
          }
          return prevTime + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameActive, isTimerRunning, gameMode, timeLimit, showModeModal]); // Добавлена зависимость showModeModal

  // Обработка окончания времени в режиме time_attack
  const handleTimeUp = async () => {
    setIsGameActive(false);
    setIsTimerRunning(false);

    // Воспроизводим звук окончания игры
    await playGameOverSound();

    const minutes = Math.floor(timeLimit / 60);
    const seconds = timeLimit % 60;
    VibrationService.playErrorVibration()
    Alert.alert(
      'Время вышло!',
      `Лимит времени (${minutes}:${seconds.toString().padStart(2, '0')}) истек. Сделано ходов: ${moves}`,
      [
        { text: 'Попробовать снова', onPress: initGame },
        { text: 'В меню', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleRestart = async () => {
    await playButtonSound();
    VibrationService.playErrorVibration()
    initGame();
  };

  const handleMenu = async () => {
    await playButtonSound();
    VibrationService.playButtonPressVibration()
    navigation.goBack();
  };

  // Функция инициализации новой игры
  const initGame = () => {
    let initialBoard;
    if (testMode) {
      initialBoard = createTestBoard(tails);
    } else {
      initialBoard = createInitialBoard(tails);

      initialBoard = shuffleBoard(initialBoard, rows, columns);
    }

    setBoard(initialBoard);
    setMoves(0);
    setTime(0);
    setIsGameActive(true);
    setIsTimerRunning(false);
    setShowModeModal(false);
  };

  // Эффект для инициализации игры при изменении параметров
  useEffect(() => {
    initGame();
  }, [tails, rows, columns, testMode, gameMode]);

  // Эффект для проверки победы
  useEffect(() => {
    if (board.length > 0 && isSolved(board) && isGameActive) {
      setIsGameActive(false);
      setIsTimerRunning(false);

      // Воспроизводим звук победы
      playWinSound();
      VibrationService.playWinVibration()

      // Сохранение результата
      const scoreRecord = {
        boardSize: boardSize.label,
        mode: gameMode,
        score: gameMode === 'classic' ? moves : time,
        moves: moves
      };
      addScore(scoreRecord);

      // Сообщение о победе в зависимости от режима
      let message = '';
      if (gameMode === 'classic') {
        message = `Вы собрали головоломку за ${moves} ходов!`;
      } else {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (gameMode === 'timed') {
          message = `Вы собрали головоломку за ${timeString} и ${moves} ходов!`;
        } else if (gameMode === 'time_attack') {
          const timeLeft = timeLimit - time;
          const minutesLeft = Math.floor(timeLeft / 60);
          const secondsLeft = timeLeft % 60;
          message = `Вы собрали головоломку за ${timeString} и ${moves} ходов!\nОсталось времени: ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
        }
      }
      Alert.alert('Победа!', message, [
        { text: 'На главную', onPress: () => navigation.goBack() },
        { text: 'Играть еще', onPress: initGame }
      ]);
    }
  }, [board, moves, isGameActive]);

  // Обработчик нажатия на клетку
  const handleCellPress = async (index: number) => {
    if (board[index] === 0 || !isGameActive) return;

    // Запускаем таймер при первом прикосновении
    if (!isTimerRunning && gameMode !== 'classic') {
      startTimer();
    }

    const emptyIndex = board.indexOf(0);
    const row = Math.floor(index / columns);
    const column = index % columns;
    const emptyRow = Math.floor(emptyIndex / columns);
    const emptyColumn = emptyIndex % columns;

    const isNeighbor = (Math.abs(row - emptyRow) === 1 && column === emptyColumn) ||
      (Math.abs(column - emptyColumn) === 1 && row === emptyRow);

    if (isNeighbor) {
      const newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
      setMoves(moves + 1);
      await playMoveSound(); // Звук перемещения
      VibrationService.playMoveVibration()
    } else {
      await playCantMoveSound(); // Звук невозможности перемещения
      VibrationService.playErrorVibration()
    }
  };

  // Обработчик открытия модального окна выбора режима
  const handleOpenModeModal = () => {
    stopTimer(); // Останавливаем таймер при открытии модального окна
    setShowModeModal(true);
  };

  // Обработчик закрытия модального окна выбора режима
  const handleCloseModeModal = () => {
    setShowModeModal(false);
    // Таймер не возобновляется автоматически после закрытия модального окна
  };

  // Форматирование времени для отображения
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Расчет оставшегося времени для time_attack
  const getRemainingTime = () => {
    if (gameMode === 'time_attack' && timeLimit > 0) {
      const remaining = timeLimit - time;
      return formatTime(Math.max(0, remaining));
    }
    return formatTime(time);
  };

  return (
    <View style={styles.Containers.centered}>
      <GameHeader
        tails={tails}
        rows={rows}
        columns={columns}
        moves={moves}
        testMode={testMode}
        time={gameMode !== 'classic' ? getRemainingTime() : undefined}
        gameMode={gameMode}
        timeLimit={gameMode === 'time_attack' ? timeLimit : undefined}
        currentTime={time}
      />

      <GameBoard
        board={board}
        columns={columns}
        onCellPress={handleCellPress}
        imagePieces={imagePuzzleData?.pieces}
      />

      <GameControls
        onRestart={handleRestart}
        onMenu={handleMenu}
        showModeSelector={true}
        onOpenModeModal={handleOpenModeModal} // Передаем обработчик открытия модального окна
        onCloseModeModal={handleCloseModeModal} // Передаем обработчик закрытия модального окна
        showModeModal={showModeModal} // Передаем состояние модального окна
      />
    </View>
  );
};

export default GameScreen;
