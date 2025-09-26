// screens/GameScreen.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'

// Тип для свойств компонента (пропсов)
type Props = {
  navigation: any; // Объект навигации для перехода между экранами
};

// Функция создания начального игрового поля (числа 1-15 + пустая клетка 0)
const createInitialBoard = (): number[] => {
  return [...Array(15).keys()].map(i => i + 1).concat(0);
};

// Основной компонент игрового экрана
const GameScreen = ({ navigation }: Props) => {
  // Состояние игрового поля (массив чисел)
  const [board, setBoard] = useState<number[]>([]);
  // Состояние счетчика ходов
  const [moves, setMoves] = useState(0);

  // Функция инициализации новой игры
  const initGame = () => {
    const initialBoard = createInitialBoard()
    // Перемешиваем клетки случайным образом
    const shuffled = [...initialBoard].sort(() => Math.random() - 0.5)
    setBoard(shuffled)
    setMoves(0)
  };

  // Эффект для запуска игры при монтировании компонента
  useEffect(() => {
    initGame();
  }, [])

  // Функция проверки, решена ли головоломка
  const isSolved = (currentBoard: number[]): boolean => {
    const solvedBoard = createInitialBoard();
    return currentBoard.every((cell, index) => cell === solvedBoard[index]);
  };

  // Обработчик нажатия на клетку
  const handleCellPress = (index: number) => {
    // Игнорируем нажатие на пустую клетку
    if (board[index] === 0) return;

    // Находим индекс пустой клетки
    const emptyIndex = board.indexOf(0);
    // Вычисляем строку и столбец нажатой клетки
    const row = Math.floor(index / 4)
    const column = index % 4;
    // Вычисляем строку и столбец пустой клетки
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyColumn = emptyIndex % 4;

    // Проверяем, является ли клетка соседней с пустой (по вертикали или горизонтали)
    const isNeighbor = (Math.abs(row - emptyRow) === 1 && column === emptyColumn) ||
      (Math.abs(column - emptyColumn) === 1 && row === emptyRow);

    // Если клетка соседняя с пустой - перемещаем ее
    if (isNeighbor) {
      const newBoard = [...board];
      // Меняем местами нажатую клетку и пустую клетку
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]]

      setBoard(newBoard);
      setMoves(moves + 1);

      // Проверяем, решена ли головоломка после хода
      if (isSolved(newBoard)) {
        Alert.alert('Победа', `Шаги: ${moves + 1}`, [{ text: 'На главную', onPress: () => navigation.navigate('Home') }]);
      };
    };
  };

  // Функция рендеринга одной клетки игрового поля
  const renderCell = (value: number, index: number) => {
    const isEmpty = value === 0;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.cell, isEmpty && styles.emptyCell]}
        onPress={() => handleCellPress(index)}
        disabled={isEmpty}>
        {/* Отображаем число, если клетка не пустая */}
        {!isEmpty && (<Text style={styles.cellText}>{value}</Text>)}
      </TouchableOpacity>
    )
  };

  // Основной рендеринг компонента
  return (
    <View style={styles.container}>
      {/* Заголовок игры */}
      <Text style={styles.title}>15 Puzzle</Text>
      {/* Счетчик ходов */}
      <Text style={styles.moves}>Шаги: {moves}</Text>

      {/* Игровое поле 4x4 */}
      <View style={styles.board}>
        {board.map((cell, index) => renderCell(cell, index))}
      </View>

      {/* Панель управления */}
      <View style={styles.buttons}>
        {/* Кнопка начала новой игры */}
        <TouchableOpacity style={styles.button} onPress={initGame}>
          <Text style={styles.buttonText}>Заново</Text>
        </TouchableOpacity>
        {/* Кнопка возврата в главное меню */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} >
          <Text style={styles.buttonText}>В меню</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  // Основной контейнер экрана
  container: {
    flex: 1, // Занимает все доступное пространство
    alignItems: 'center', // Выравнивание по центру по горизонтали
    justifyContent: 'center', // Выравнивание по центру по вертикали
    backgroundColor: '#f0f0f0', // Светло-серый фон
    padding: 20, // Внутренние отступы
  },
  // Стиль заголовка игры
  title: {
    fontSize: 28, // Размер шрифта
    fontWeight: 'bold', // Жирное начертание
    marginBottom: 10, // Отступ снизу
  },
  // Стиль счетчика ходов
  moves: {
    fontSize: 18, // Размер шрифта
    marginBottom: 20, // Отступ снизу
    color: '#666', // Серый цвет текста
  },
  // Стиль игрового поля
  board: {
    flexDirection: 'row', // Расположение в строку
    flexWrap: 'wrap', // Перенос на новую строку
    width: 300, // Фиксированная ширина
    height: 300, // Фиксированная высота
    backgroundColor: '#ddd', // Серый фон поля
    borderRadius: 10, // Закругленные углы
    padding: 5, // Внутренние отступы
    marginBottom: 20, // Отступ снизу
  },
  // Стиль обычной клетки
  cell: {
    width: '23%', // Ширина 23% от родителя
    height: '23%', // Высота 23% от родителя
    margin: '1%', // Внешние отступы
    backgroundColor: '#4CAF50', // Зеленый цвет фона
    justifyContent: 'center', // Выравнивание по центру по вертикали
    alignItems: 'center', // Выравнивание по центру по горизонтали
    borderRadius: 8, // Закругленные углы
    elevation: 3, // Тень для Android
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени
    shadowOpacity: 0.2, // Прозрачность тени
    shadowRadius: 2, // Размытие тени
  },
  // Стиль пустой клетки
  emptyCell: {
    backgroundColor: 'transparent', // Прозрачный фон
    elevation: 0, // Без тени
    shadowOpacity: 0, // Без тени
  },
  // Стиль текста в клетке
  cellText: {
    fontSize: 20, // Размер шрифта
    fontWeight: 'bold', // Жирное начертание
    color: 'white', // Белый цвет текста
  },
  // Контейнер для кнопок
  buttons: {
    flexDirection: 'row', // Расположение в строку
    gap: 15, // Расстояние между кнопками
  },
  // Стиль кнопки
  button: {
    backgroundColor: '#2196F3', // Синий цвет фона
    paddingHorizontal: 20, // Горизонтальные отступы
    paddingVertical: 10, // Вертикальные отступы
    borderRadius: 8, // Закругленные углы
  },
  // Стиль текста кнопки
  buttonText: {
    color: 'white', // Белый цвет текста
    fontWeight: 'bold', // Жирное начертание
  },
});

export default GameScreen;
