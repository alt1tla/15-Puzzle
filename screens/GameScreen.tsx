// screens/GameScreen.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'

type Props = { navigation: any }

const createInitialBoard = (): number[] => {
  return [...Array(15).keys()].map(i => i + 1).concat(0);
}

const GameScreen = ({ navigation }: Props) => {
  const [board, setBoard] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const initialBoard = createInitialBoard()

    const shuffled = [...initialBoard].sort(() => Math.random() - 0.5)
    setBoard(shuffled)
    setMoves(0)
  }

  useEffect(() => {
    initGame();
  }, ([]))

  
}


