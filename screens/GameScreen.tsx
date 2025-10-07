// screens/GameScreen.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
// Импорт глобальных стилей и контекста настроек
import { useGameSettings } from '../contexts/GameSettingsContext';
import { createStyles, Utils } from '../styles/GlobalStyles'

// Определение типа для свойств компонента (пропсов)
type Props = {
  navigation: any; // Объект для навигации между экранами
  route: any; // Параметры, переданные при переходе на этот экран
};

// Функция создания начального игрового поля с числами по порядку
const createInitialBoard = (tails: number): number[] => {
  // Создание массива чисел от 1 до tails и добавление 0 в конец
  return [...Array(tails).keys()].map(i => i + 1).concat(0);
};

// Функция создания тестового поля для отладки (переставлены последние две клетки)
const createTestBoard = (tails: number): number[] => {
  const solvedBoard = createInitialBoard(tails); // Получаем решенное поле
  if (tails === 8) {
    const testBoard = [...solvedBoard]; // Создаем копию массива
    [testBoard[7], testBoard[8]] = [testBoard[8], testBoard[7]]; // Меняем местами последние две клетки
    return testBoard; // Возвращаем тестовое поле [1,2,3,4,5,6,7,0,8]
  }
  return solvedBoard; // Для других размеров возвращаем обычное поле
};

// Функция проверки решаемости головоломки
const isSolvable = (board: number[], rows: number, columns: number): boolean => {
  let inversions = 0;
  const flatBoard = board.filter(cell => cell !== 0); // Убираем пустую клетку из расчета

  // Считаем количество инверсий (когда большее число стоит перед меньшим)
  for (let i = 0; i < flatBoard.length; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i] > flatBoard[j]) inversions++;
    }
  }

  // Логика проверки решаемости в зависимости от четности количества строк
  if (rows % 2 === 1) {
    // Для нечетных сеток (3x3, 5x5) - должно быть четное число инверсий
    return inversions % 2 === 0;
  } else {
    // Для четных сеток (4x4) - учитываем положение пустой клетки (снизу-вверх)
    const emptyRowFromBottom = rows - Math.floor(board.indexOf(0) / rows);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }
};

// Умная функция перемешивания, гарантирующая решаемость
const shuffleBoard = (initialBoard: number[], rows: number, columns: number): number[] => {
  let shuffled;
  let attempts = 0;
  const maxAttempts = 100; // Защита от бесконечного цикла

  // Цикл поиска решаемой конфигурации
  do {
    // Алгоритм Фишера-Йейтса для случайного перемешивания
    shuffled = [...initialBoard];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;

    // Защита от бесконечного цикла - если долго не находится решаемая конфигурация
    if (attempts > maxAttempts) {
      // Альтернативный подход: создаем решаемую конфигурацию через случайные ходы
      const tempBoard = [...initialBoard];
      const emptyIndex = tempBoard.indexOf(0);
      const possibleMoves = [];

      // Находим все возможные ходы из решенного состояния
      const emptyRow = Math.floor(emptyIndex / rows);
      const emptyCol = emptyIndex % columns;

      // Добавляем возможные направления движения пустой клетки
      if (emptyRow > 0) possibleMoves.push(emptyIndex - columns); // сверху
      if (emptyRow < rows - 1) possibleMoves.push(emptyIndex + columns); // снизу
      if (emptyCol > 0) possibleMoves.push(emptyIndex - 1); // слева
      if (emptyCol < columns - 1) possibleMoves.push(emptyIndex + 1); // справа

      // Делаем 20 случайных ходов для перемешивания
      let currentBoard = [...tempBoard];
      for (let i = 0; i < 20; i++) {
        const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const emptyIdx = currentBoard.indexOf(0);
        [currentBoard[moveIndex], currentBoard[emptyIdx]] = [currentBoard[emptyIdx], currentBoard[moveIndex]];
      }
      return currentBoard;
    }
  } while (!isSolvable(shuffled, rows, columns)); // Повторяем пока не найдем решаемую конфигурацию

  return shuffled;
};

// Основной компонент игрового экрана
const GameScreen = ({ navigation, route }: Props) => {
  // Получение текущей темы из контекста настроек
  const { theme } = useGameSettings();
  // Создание стилей на основе текущей темы
  const styles = createStyles(theme);

  // Получение параметров игры из навигации или установка значений по умолчанию
  const { tails = 15, rows = 4, columns = 4, testMode = false } = route.params || {};

  // Проверка корректности параметров игрового поля
  if (rows * columns !== tails + 1) {
    Alert.alert('Ошибка', 'Некорректные параметры поля');
    navigation.goBack(); // Возврат на предыдущий экран при ошибке
    return null; // Прекращение рендеринга компонента
  }

  // Состояние для хранения текущего игрового поля
  const [board, setBoard] = useState<number[]>([]);
  // Состояние для подсчета количества ходов
  const [moves, setMoves] = useState(0);

  // Расчет размера клетки на основе количества колонок
  const cellSize = Utils.getCellSize(columns);

  // Функция инициализации новой игры
  const initGame = () => {
    let initialBoard;
    if (testMode) {
      // В тестовом режиме используем специальное поле
      initialBoard = createTestBoard(tails);
    } else {
      // В обычном режиме создаем и умно перемешиваем поле
      initialBoard = createInitialBoard(tails);
      initialBoard = shuffleBoard(initialBoard, rows, columns);
    }
    // Установка начального состояния игры
    setBoard(initialBoard);
    setMoves(0);
  };

  // Эффект для инициализации игры при изменении параметров
  useEffect(() => {
    initGame();
  }, [tails, rows, columns, testMode]); // Зависимости: параметры игры

  // Функция проверки, решена ли головоломка
  const isSolved = (currentBoard: number[]): boolean => {
    return currentBoard.every((cell, index) => {
      if (index === currentBoard.length - 1) {
        return cell === 0; // Последняя клетка должна быть пустой
      }
      return cell === index + 1; // Все остальные клетки должны быть по порядку
    });
  };

  // Эффект для проверки победы при изменении состояния поля или количества ходов
  useEffect(() => {
    if (board.length > 0 && isSolved(board)) {
      // Показ уведомления о победе
      Alert.alert('Победа!', `Вы собрали головоломку за ${moves} ходов!`, [
        { text: 'На главную', onPress: () => navigation.goBack() }
      ]);
    }
  }, [board, moves]); // Срабатывает при изменении игрового поля или количества ходов

  // Обработчик нажатия на клетку игрового поля
  const handleCellPress = (index: number) => {
    if (board[index] === 0) return; // Игнорирование нажатия на пустую клетку

    // Поиск индекса пустой клетки
    const emptyIndex = board.indexOf(0);

    // Расчет координат нажатой клетки
    const row = Math.floor(index / columns);
    const column = index % columns;

    // Расчет координат пустой клетки
    const emptyRow = Math.floor(emptyIndex / columns);
    const emptyColumn = emptyIndex % columns;

    // Проверка, является ли нажатая клетка соседней с пустой
    const isNeighbor = (Math.abs(row - emptyRow) === 1 && column === emptyColumn) ||
      (Math.abs(column - emptyColumn) === 1 && row === emptyRow);

    // Если клетка соседняя - выполняем перемещение
    if (isNeighbor) {
      const newBoard = [...board]; // Создаем копию массива
      // Меняем местами нажатую клетку и пустую клетку
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];

      // Обновление состояния игры
      setBoard(newBoard);
      setMoves(moves + 1);
    }
  };

  // Функция рендеринга одной клетки игрового поля
  const renderCell = (value: number, index: number) => {
    const isEmpty = value === 0; // Проверка, является ли клетка пустой

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.GameStyles.cell,
          isEmpty && styles.GameStyles.emptyCell,
          {
            width: cellSize,
            height: cellSize,
            margin: 5
          }
        ]}
        onPress={() => handleCellPress(index)}
        disabled={isEmpty}
      >
        {!isEmpty && (<Text style={styles.GameStyles.cellText}>{value}</Text>)}
      </TouchableOpacity>
    );
  };

  // Основной рендеринг компонента
  return (
    <View style={styles.Containers.centered}>
      <Text style={styles.Typography.heading}>Пазл {tails}</Text>
      <Text style={styles.Typography.body}>{rows} × {columns}</Text>
      {testMode && (
        <Text style={[styles.Typography.caption, { color: styles.Colors.accent, fontWeight: 'bold' }]}>
          🔧 Тестовый режим
        </Text>
      )}
      <Text style={styles.Typography.body}>Шаги: {moves}</Text>
      <View style={[
        styles.GameStyles.board,
        {
          width: Utils.maxBoardSize,
          height: Utils.maxBoardSize,
          flexWrap: 'wrap' as 'wrap',
          flexDirection: 'row' as 'row'
        }
      ]}>
        {board.map((cell, index) => renderCell(cell, index))}
      </View>
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <TouchableOpacity style={styles.Buttons.primary} onPress={initGame}>
          <Text style={styles.Typography.button}>Заново</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Buttons.primary} onPress={() => navigation.goBack()}>
          <Text style={styles.Typography.button}>В меню</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameScreen;
