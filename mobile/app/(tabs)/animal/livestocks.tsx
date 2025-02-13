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
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
          marginTop: 20,
          color: themeColors.text,
        }}
      >
        Total number of livestock:{"   "}
        {animalData?.length}
      </Text>

      {/* map all animaldata in a flatlist*/}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
            color: themeColors.text,
          }}
        >
          Name
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
            color: themeColors.text,
          }}
        >
          Date added
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
            color: themeColors.text,
          }}
        >
          Livestock number
        </Text>
      </View>
      <FlatList
        data={animalData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            key={item._id} 
            style={{
              padding: 15,
              backgroundColor: "#eef",
              borderRadius: 10,
              marginBottom: 10,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{item.name}</Text>
            <Text>{extractDate(item.createdAt)}</Text>
            <Text>{item.number}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default livestock;
