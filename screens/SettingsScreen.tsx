// screens/SettingsScreen.tsx
import { View, Text } from 'react-native';

// Определяем тип для свойств компонента (пропсов)
type Props = {
  navigation: any; // Объект навигации для перехода между экранами
};

// Экран настроек приложения 
const SettingsScreen = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Текст-заглушка */}
      <Text>Настройки - скоро!</Text>
    </View>

  )
};

export default SettingsScreen
