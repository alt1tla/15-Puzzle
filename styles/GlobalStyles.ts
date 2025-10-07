// styles/GlobalStyles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

// Цветовые палитры для разных тем
export const colorSchemes = {
  light: {
    primary: "#2196F3",
    primaryDark: "#1976D2",
    secondary: "#4CAF50",
    accent: "#FF9800",
    background: "#f0f0f0",
    surface: "#ffffff",
    textPrimary: "#333333",
    textSecondary: "#666666",
    textLight: "#ffffff",
    border: "#dddddd",
    disabled: "#e0e0e0",
  },
  dark: {
    primary: "#2196F3",
    primaryDark: "#1976D2",
    secondary: "#4CAF50",
    accent: "#FF9800",
    background: "#121212",
    surface: "#1e1e1e",
    textPrimary: "#ffffff",
    textSecondary: "#aaaaaa",
    textLight: "#ffffff",
    border: "#333333",
    disabled: "#2a2a2a",
  },
  retro: {
    primary: "#FF9800",
    primaryDark: "#F57C00",
    secondary: "#795548",
    accent: "#FF5722",
    background: "#2d2d2d",
    surface: "#3d3d3d",
    textPrimary: "#ffeb3b",
    textSecondary: "#ffc107",
    textLight: "#2d2d2d",
    border: "#5d4037",
    disabled: "#4d4d4d",
  },
};

// Функция для создания стилей на основе темы
export const createStyles = (theme: "light" | "dark" | "retro" = "light") => {
  const Colors = colorSchemes[theme];

  const styles = {
    Typography: StyleSheet.create({
      title: {
        fontSize: 32,
        fontWeight: "bold" as "bold",
        color: Colors.textPrimary,
        textAlign: "center" as "center",
      },
      subtitle: {
        fontSize: 24,
        fontWeight: "bold" as "bold",
        color: Colors.textPrimary,
        textAlign: "center" as "center",
      },
      heading: {
        fontSize: 28,
        fontWeight: "bold" as "bold",
        color: Colors.textPrimary,
      },
      body: {
        fontSize: 16,
        color: Colors.textSecondary,
      },
      caption: {
        fontSize: 14,
        color: Colors.textSecondary,
      },
      button: {
        fontSize: 16,
        fontWeight: "bold" as "bold",
        color: Colors.textLight,
        textAlign: "center" as "center",
      },
    }),

    Containers: StyleSheet.create({
      screen: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
      },
      centered: {
        flex: 1,
        justifyContent: "center" as "center",
        alignItems: "center" as "center",
        backgroundColor: Colors.background,
        padding: 20,
      },
      card: {
        backgroundColor: Colors.surface,
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        elevation: 2,
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),

    Buttons: StyleSheet.create({
      primary: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 3,
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      secondary: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
      },
      disabled: {
        backgroundColor: Colors.disabled,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
      },
    }),

    GameStyles: StyleSheet.create({
      board: {
        backgroundColor: Colors.border,
        borderRadius: 10,
        padding: 5,
        marginVertical: 20,
      },
      cell: {
        backgroundColor: Colors.secondary,
        justifyContent: "center" as "center",
        alignItems: "center" as "center",
        borderRadius: 8,
        elevation: 3,
        shadowColor: Colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      emptyCell: {
        backgroundColor: "transparent",
        elevation: 0,
        shadowOpacity: 0,
      },
      cellText: {
        fontSize: 20,
        fontWeight: "bold" as "bold",
        color: Colors.textLight,
      },
    }),

    Colors, // Экспортируем Colors для прямого доступа
  };

  return styles;
};

// Утилиты (не зависят от темы)
export const Utils = {
  maxBoardSize: Math.min(screenWidth - 40, 350),
  getCellSize: (columns: number) =>
    (Math.min(screenWidth - 40, 350) - 10) / columns - 10,
};

// Экспорт для обратной совместимости
export { colorSchemes as Colors };
