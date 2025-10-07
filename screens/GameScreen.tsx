// screens/GameScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles } from '../styles/GlobalStyles';
import GameHeader from '../components/GameHeader';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import { 
  createInitialBoard, 
  createTestBoard, 
  shuffleBoard, 
  isSolved 
} from '../utils/gameLogic';

type Props = {
  navigation: any;
  route: any;
};

const GameScreen = ({ navigation, route }: Props) => {
  const { theme, gameMode, addScore, difficulty } = useGameSettings();
  const styles = createStyles(theme);

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
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  };

  // Запуск/остановка таймера в зависимости от режима
  useEffect(() => {
    if (isGameActive && gameMode !== 'classic') {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          // Проверка лимита времени для time_attack
          if (gameMode === 'time_attack') {
            const timeLimit = 300; // 5 минут в секундах
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
  }, [isGameActive, gameMode]);

  // Обработка окончания времени в режиме time_attack
  const handleTimeUp = () => {
    setIsGameActive(false);
    Alert.alert(
      'Время вышло!', 
      `Вы не успели собрать пазл за отведенное время. Сделано ходов: ${moves}`,
      [
        { text: 'Попробовать снова', onPress: initGame },
        { text: 'В меню', onPress: () => navigation.goBack() }
      ]
    );
  };

  // Эффект для инициализации игры при изменении параметров
  useEffect(() => {
    initGame();
  }, [tails, rows, columns, testMode]);

  // Эффект для проверки победы
  useEffect(() => {
    if (board.length > 0 && isSolved(board) && isGameActive) {
      setIsGameActive(false);
      
      // Сохранение результата
      const scoreRecord = {
        difficulty: difficulty.label,
        mode: gameMode,
        score: gameMode === 'classic' ? moves : time,
        moves: moves
      };
      addScore(scoreRecord);

      // Сообщение о победе в зависимости от режима
      let message = '';
      if (gameMode === 'classic') {
        message = `Вы собрали головоломку за ${moves} ходов!`;
      } else if (gameMode === 'timed') {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        message = `Вы собрали головоломку за ${minutes}:${seconds.toString().padStart(2, '0')} и ${moves} ходов!`;
      } else if (gameMode === 'time_attack') {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        message = `Вы собрали головоломку за ${minutes}:${seconds.toString().padStart(2, '0')} и ${moves} ходов!`;
      }

      Alert.alert('Победа!', message, [
        { text: 'На главную', onPress: () => navigation.goBack() },
        { text: 'Играть еще', onPress: initGame }
      ]);
    }
  }, [board, moves, isGameActive]);

  // Обработчик нажатия на клетку
  const handleCellPress = (index: number) => {
    if (board[index] === 0 || !isGameActive) return;

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
    }
  };

  // Форматирование времени для отображения
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.Containers.centered}>
      <GameHeader 
        tails={tails}
        rows={rows}
        columns={columns}
        moves={moves}
        testMode={testMode}
        time={gameMode !== 'classic' ? formatTime(time) : undefined}
        gameMode={gameMode}
      />
      
      <GameBoard 
        board={board}
        columns={columns}
        onCellPress={handleCellPress}
      />
      
      <GameControls 
        onRestart={initGame}
        onMenu={() => navigation.goBack()}
        showModeSelector={true}
      />
    </View>
  );
};

export default GameScreen;
