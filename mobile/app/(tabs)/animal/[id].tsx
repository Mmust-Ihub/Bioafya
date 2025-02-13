import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router"; // Import this
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";

const AnimalDetails = () => {
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  // Get params from router
  const { animal } = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;
  // Parse the JSON string into an object
  const animalData = typeof animal === "string" ? JSON.parse(animal) : null;

  if (!animalData) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          Animal Not Found
        </Text>
      </View>
    );
  }

  // ✅ Heart Rate Status
  interface HeartRateStatus {
    (heartRate: number): string;
  }

  const getHeartRateStatus: HeartRateStatus = (heartRate) => {
    if (heartRate < 40) return "Low ⬇️";
    if (heartRate > 100) return "High ⬆️";
    return "Normal ✅";
  };

  // ✅ Temperature Status
  interface TemperatureStatus {
    (temperature: number): string;
  }

  const getTemperatureStatus: TemperatureStatus = (temperature) => {
    if (temperature < 36) return "Low ❄️";
    if (temperature > 39) return "High 🔥";
    return "Normal ✅";
  };

  // ✅ Generate Health Score (Out of 100)
  interface AnimalData {
    heartRate: number;
    temperature: number;
    activityLevel: number;
    name: string;
  }

  const calculateHealthScore = (
    heartRate: number,
    temperature: number,
    activityLevel: number
  ): number => {
    let score = 100;

    // Adjust score based on vitals
    if (heartRate < 40 || heartRate > 100) score -= 20;
    if (temperature < 36 || temperature > 39) score -= 20;
    if (activityLevel < 3) score -= 15; // Low activity impact

    return Math.max(score, 0); // Ensure score doesn't go below 0
  };

  // Compute Stats
  const heartRateStatus = getHeartRateStatus(animalData.heartRate);
  const temperatureStatus = getTemperatureStatus(animalData.temperature);
  const healthScore = calculateHealthScore(
    animalData.heartRate,
    animalData.temperature,
    animalData.activityLevel
  );

  console.log("animalData.temperature: ", animalData.temperature);

  const data = {
    labels: ["Heart Rate", "Temperature"],
    datasets: [
      {
        data: [animalData.heartRate, animalData.temperature],
      },
    ],
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        {animalData.name}
      </Text>

      {/* Animal Vitals */}
      <View style={styles.vitalCard}>
        <Text style={styles.vitalText}>
          ❤️ Heart Rate: {animalData.heartRate} bpm ({heartRateStatus})
        </Text>
        <Text style={styles.vitalText}>
          🌡 Temperature: {animalData.temperature} °C ({temperatureStatus})
        </Text>
        <Text style={styles.vitalText}>
          ⚡ Activity: {animalData.activityLevel}/10
        </Text>
        <Text
          style={[
            styles.healthScore,
            { color: healthScore < 50 ? "red" : "green" },
          ]}
        >
          🏥 Health Score: {healthScore}/100
        </Text>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {animalData.name}
        </Text>

        {/* Bar Chart */}
        <Text style={[styles.chartTitle, { color: themeColors.text }]}>
          Health Vitals
        </Text>
        <BarChart
          data={data}
          width={screenWidth - 30}
          height={250}
          yAxisLabel=""
          yAxisSuffix="bpm/°C"
          yAxisInterval={1} // Ensures better spacing between ticks
          fromZero={true} // Ensures the scale starts at zero
          withInnerLines={true} // Adds horizontal grid lines for better readability
          chartConfig={{
            backgroundColor: themeColors.background,
            backgroundGradientFrom: themeColors.background,
            backgroundGradientTo: themeColors.background,
            decimalPlaces: 1, // Allow decimal points for more accuracy
            barPercentage: 0.5, // Adjusts bar width to improve visibility
            color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`,
            labelColor: (opacity = 1) => themeColors.text,
            propsForBackgroundLines: {
              strokeDasharray: "3", // Makes grid lines dashed for better visibility
            },
            propsForLabels: {
              fontSize: 10, // Increase label size
            },
          }}
          style={styles.chart}
        />
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton}>
          <Ionicons name="call" size={22} color="white" />
          <Text style={styles.actionText}>Call Vet</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <MaterialCommunityIcons name="stethoscope" size={22} color="white" />
          <Text style={styles.actionText}>Request Checkup</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Ionicons name="document-text-outline" size={22} color="white" />
          <Text style={styles.actionText}>View History</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vitalCard: {
    padding: 15,
    backgroundColor: "#eef",
    borderRadius: 10,
    marginBottom: 20,
  },
  vitalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  healthScore: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
  backgroundColor: "#4CD964",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
});

export default AnimalDetails;
