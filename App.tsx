// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import { AudioSettingsProvider } from './contexts/AudioSettingsContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameSettingsProvider>
      <AudioSettingsProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{
            headerShown: false // Убираем заголовок для всех экранов
          }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AudioSettingsProvider>
    </GameSettingsProvider>
  );
}
