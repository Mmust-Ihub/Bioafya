import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { BarChart } from "react-native-chart-kit";
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust import if needed

interface AnimalData {
  heartRate: number; // from "ecg_value"
  temperature: number; // from "temp"
  activityLevel: number; // from "activity" (or set to 0 if you don't have it)
  name: string; // from "number"
  accel: number[]; // e.g., [x, y, z]
  gyro: number[]; // e.g., [x, y, z]
}

const AnimalDetails = () => {
  // Grab route params from [id].tsx, including `id` (livestockId) and `farmerId`
  const { id, farmerId, name } = useLocalSearchParams();
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (!id || !farmerId) return;

    // Query Firestore for a document matching this farmerId & livestockId
    const livestockRef = collection(db, "livestock");
    const q = query(
      livestockRef,
      where("farmerId", "==", farmerId),
      where("livestockId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Take the first matching doc (assuming only one doc matches)
        const docData = snapshot.docs[0].data() as DocumentData;

        // Map Firestore fields to AnimalData interface
        const mappedData: AnimalData = {
          heartRate: docData.ecg_value ?? 0,
          temperature: docData.temp ?? 0,
          activityLevel: docData.activity ?? 0,
          name: docData.number ?? "Unnamed",
          accel: docData.accel ?? [0, 0, 0],
          gyro: docData.gyro ?? [0, 0, 0],
        };

        setAnimalData(mappedData);
      } else {
        setAnimalData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, farmerId]);

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <ActivityIndicator size="large" color={themeColors.text} />
      </View>
    );
  }

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

  /**
   * Utility functions for health metrics
   */
  const getHeartRateStatus = (heartRate: number) => {
    if (heartRate < 40) return "Low ⬇️";
    if (heartRate > 100) return "High ⬆️";
    return "Normal ✅";
  };

  const getTemperatureStatus = (temperature: number) => {
    if (temperature < 36) return "Low ❄️";
    if (temperature > 39) return "High 🔥";
    return "Normal ✅";
  };

  const calculateHealthScore = (
    heartRate: number,
    temperature: number,
    activityLevel: number
  ) => {
    let score = 100;
    if (heartRate < 40 || heartRate > 100) score -= 20;
    if (temperature < 36 || temperature > 39) score -= 20;
    if (activityLevel < 3) score -= 15;
    return Math.max(score, 0);
  };

  // Derive statuses & health score
  const heartRateStatus = getHeartRateStatus(animalData.heartRate);
  const temperatureStatus = getTemperatureStatus(animalData.temperature);
  const healthScore = calculateHealthScore(
    animalData.heartRate,
    animalData.temperature,
    animalData.activityLevel
  );

  /**
   * Interpretation logic to help the farmer understand
   * what's going on with these metrics.
   */
  const getInterpretation = (data: AnimalData) => {
    const lines: string[] = [];

    // Heart Rate interpretation
    if (data.heartRate < 40) {
      lines.push(
        "• Heart rate is below normal. The animal may be sedated or have a slow pulse."
      );
    } else if (data.heartRate > 100) {
      lines.push(
        "• Heart rate is above normal. The animal may be stressed, overheated, or have a fast pulse."
      );
    } else {
      lines.push("• Heart rate is within a normal range.");
    }

    // Temperature interpretation
    if (data.temperature < 36) {
      lines.push(
        "• Temperature is below normal. The animal could be cold or hypothermic."
      );
    } else if (data.temperature > 39) {
      lines.push(
        "• Temperature is above normal. The animal could have a fever or be overheated."
      );
    } else {
      lines.push("• Temperature is within a normal range.");
    }

    // Activity interpretation
    if (data.activityLevel < 3) {
      lines.push(
        "• Activity level is low. The animal might be resting or inactive."
      );
    } else if (data.activityLevel > 7) {
      lines.push(
        "• Activity level is high. The animal might be moving around a lot or agitated."
      );
    } else {
      lines.push("• Activity level is moderate.");
    }

    // Accel interpretation (magnitude of X/Y/Z)
    const accelMag = Math.sqrt(
      data.accel[0] ** 2 + data.accel[1] ** 2 + data.accel[2] ** 2
    );
    if (accelMag < 0.5) {
      lines.push(
        "• Low acceleration. The animal is mostly still or moving slowly."
      );
    } else if (accelMag > 1.5) {
      lines.push(
        "• High acceleration. The animal may be running, jumping, or very active."
      );
    } else {
      lines.push(
        "• Moderate acceleration. The animal is moving at a normal pace."
      );
    }

    // Gyro interpretation (magnitude of rotation)
    const gyroMag = Math.sqrt(
      data.gyro[0] ** 2 + data.gyro[1] ** 2 + data.gyro[2] ** 2
    );
    if (gyroMag < 0.5) {
      lines.push(
        "• Low rotational movement. The animal’s orientation is fairly stable."
      );
    } else if (gyroMag > 1.5) {
      lines.push(
        "• High rotational movement. The animal might be turning quickly or shaking its head."
      );
    } else {
      lines.push(
        "• Moderate rotational movement. The animal is moving its head or body normally."
      );
    }

    return lines.join("\n");
  };

  // Generate a combined interpretation message
  const interpretationText = getInterpretation(animalData);

  // Prepare data for the main BarChart (Heart Rate & Temperature)
  const mainChartData = {
    labels: ["Heart Rate", "Temperature"],
    datasets: [
      {
        data: [animalData.heartRate, animalData.temperature],
      },
    ],
  };

  // Prepare data for Accel & Gyro BarCharts
  const accelData = {
    labels: ["X", "Y", "Z"],
    datasets: [
      {
        data: animalData.accel,
      },
    ],
  };

  const gyroData = {
    labels: ["X", "Y", "Z"],
    datasets: [
      {
        data: animalData.gyro,
      },
    ],
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        {name} {" "}
        {animalData.name}
      </Text>

      {/* Vital Stats Card */}
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

        {/* Display Accel & Gyro as text */}
        <Text style={styles.vitalText}>
          Accel: X={animalData.accel[0].toFixed(2)}, Y=
          {animalData.accel[1].toFixed(2)}, Z={animalData.accel[2].toFixed(2)}
        </Text>
        <Text style={styles.vitalText}>
          Gyro: X={animalData.gyro[0].toFixed(2)}, Y=
          {animalData.gyro[1].toFixed(2)}, Z={animalData.gyro[2].toFixed(2)}
        </Text>
      </View>

      <ScrollView>
        {/* Main Heart Rate / Temperature Chart */}
        <Text style={[styles.chartTitle, { color: themeColors.text }]}>
          Health Vitals
        </Text>
        <BarChart
          data={mainChartData}
          width={screenWidth - 30}
          height={250}
          fromZero={true}
          yAxisLabel=""
          yAxisSuffix="bpm/°C"
          chartConfig={{
            backgroundColor: themeColors.background,
            backgroundGradientFrom: themeColors.background,
            backgroundGradientTo: themeColors.background,
            decimalPlaces: 1,
            barPercentage: 0.5,
            color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`,
            labelColor: () => themeColors.text,
            propsForLabels: {
              fontSize: 8, // Adjust this value to change the font size of y-axis labels (including the suffix)
            },
          }}
          style={styles.chart}
        />

        <Text style={[styles.chartTitle, { color: themeColors.text }]}>
          Accelerometer (X/Y/Z)
        </Text>
        <BarChart
          data={accelData}
          width={screenWidth - 30}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: themeColors.background,
            backgroundGradientFrom: themeColors.background,
            backgroundGradientTo: themeColors.background,
            decimalPlaces: 2,
            barPercentage: 0.5,
            color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
            labelColor: () => themeColors.text,
          }}
          style={styles.chart}
        />

        {/* Gyroscope Bar Chart */}
        <Text style={[styles.chartTitle, { color: themeColors.text }]}>
          Gyroscope (X/Y/Z)
        </Text>
        <BarChart
          data={gyroData}
          width={screenWidth - 30}
          height={220}
          fromZero={true}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: themeColors.background,
            backgroundGradientFrom: themeColors.background,
            backgroundGradientTo: themeColors.background,
            decimalPlaces: 2,
            barPercentage: 0.5,
            color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
            labelColor: () => themeColors.text,
          }}
          style={styles.chart}
        />

        {/* Interpretation / Explanation */}
        <View style={styles.interpretationContainer}>
          <Text
            style={[styles.interpretationHeader, { color: themeColors.text }]}
          >
            What does this mean?
          </Text>
          <Text
            style={[styles.interpretationText, { color: themeColors.text }]}
          >
            {interpretationText}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnimalDetails;

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
  interpretationContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  interpretationHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
