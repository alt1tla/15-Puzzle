// screens/LeaderboardScreen.tsx
import { View, Text } from 'react-native';

// Определяем тип для свойств компонента (пропсов)
type Props = {
  navigation: any; // Объект навигации для перехода между экранами
};

// Экран таблицы лидеров
const LeaderboardScreen = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Текст-заглушка */}
      <Text>Таблица рекордов - скоро!</Text>
    </View>

  )
};

export default LeaderboardScreen
