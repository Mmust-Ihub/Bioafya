import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthContext";
import NetInfo from "@react-native-community/netinfo";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const mockAnimals = [
  { id: "1", name: "Cow A", temperature: "38", heartRate: "72" },
  { id: "2", name: "Sheep B", temperature: "39", heartRate: "80" },
  { id: "3", name: "Goat C", temperature: "37.5", heartRate: "78" },
];

function HomeScreen() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();

  useEffect(() => {
    const handleNetworkChange = (state: { isConnected: boolean | null }) => {
      setIsConnected(state.isConnected);
    };
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Network Status */}
      {isConnected === false && (
        <Text style={styles.networkWarning}>No Internet Connection</Text>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Animal Monitoring
        </Text>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={themeColors.text}
        />
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Welcome, {authContext?.user?.name}
        </Text>
      </View>

      {/* List of Animals */}
      <FlatList
        data={mockAnimals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            style={styles.animalCard}
            //  route to animal page and send item on animal/:id page
            href={{
              pathname: `/animal/[id]`,
              params: { id: item.id, animal: JSON.stringify(item) },
            }}
          >
            <View>
              <Text style={styles.animalName}>{item.name}</Text>
              <Text>Temperature: {item.temperature} °C</Text>
              <Text>Heart Rate: {item.heartRate} bpm</Text>
            </View>
          </Link>
        )}
      />

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="call" size={22} color="white" />
            <Text style={styles.actionText}>Call Vet</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="add-circle-outline" size={22} color="white" />
            <Text style={styles.actionText}>Add Farm</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Entypo name="bar-graph" size={22} color="white" />
            <Text style={styles.actionText}>View Reports</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingVertical: 10 },
  networkWarning: {
    color: "white",
    backgroundColor: "tomato",
    padding: 10,
    textAlign: "center",
    borderRadius: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  section: { marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  animalCard: {
    padding: 15,
    backgroundColor: "#eef",
    borderRadius: 10,
    marginBottom: 10,
  },
  animalName: { fontSize: 16, fontWeight: "bold" },
  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: { color: "white", marginTop: 5, fontSize: 12 },
});

export default HomeScreen;
