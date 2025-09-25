// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
  navigation: any;
};

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>15 Puzzle</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Играть"
          onPress={() => navigation.navigate('Game')}
        />
        <Button
          title="Рейтинг"
          onPress={() => navigation.navigate('Leaderboard')}
        />
        <Button
          title="Настройки"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  buttonContainer: {
    gap: 15,
    width: 200,
  },
});

export default HomeScreen;
