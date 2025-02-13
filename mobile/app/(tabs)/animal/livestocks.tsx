import { View, Text, FlatList } from "react-native";
import React, { useContext } from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

const livestock = () => {
  function extractDate(timestamp: string): string {
    return timestamp.split("T")[0]; // Extracts YYYY-MM-DD
  }
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const { animal } = useLocalSearchParams();
  const animalData = typeof animal === "string" ? JSON.parse(animal) : null;
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: themeColors.background,
      }}
    >
      {/* <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",

          marginTop: 20,
        }}
      >
        All livestock
      </Text> */}
     
    </View>
  );
};

export default livestock;
