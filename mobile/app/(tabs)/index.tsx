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
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons, Entypo, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthContext";
import NetInfo from "@react-native-community/netinfo";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { apiUrl } from "@/constants/api";
import { Alert } from "react-native";
import { useUserContext } from "@/contexts/userContext";

const mockAnimals = [
  { id: "1", name: "Cow A", temperature: "38", heartRate: "72" },
  { id: "2", name: "Sheep B", temperature: "39", heartRate: "80" },
  { id: "3", name: "Goat C", temperature: "37.5", heartRate: "78" },
];

function HomeScreen() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [livestockName, setLivestockName] = useState("");
  const [cattleNumber, setCattleNumber] = useState("");
  const [livestocks, setLivestocks] = useState([]);

  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const userContext = useUserContext();

  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();
  console.log("user", userContext);

  useEffect(() => {
    const handleNetworkChange = (state: { isConnected: boolean | null }) => {
      setIsConnected(state.isConnected);
      getAllLivestock();
    };
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
    return () => unsubscribe();
  }, []);

  const getAllLivestock = async () => {
    try {
      const response = await fetch(`${apiUrl}/livestock`, {
        headers: {
          Authorization: `Bearer ${authContext?.userToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLivestocks(data);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddLivestock = async () => {
    Keyboard.dismiss();
    if (!livestockName || !cattleNumber) {
      Alert.alert("All fields are required");
      return;
    }
    if (isNaN(Number(cattleNumber))) {
      Alert.alert("Cattle Number must be a number");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/livestock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext?.userToken}`,
        },
        body: JSON.stringify({
          name: livestockName,
          number: cattleNumber,
        }),
      });
      console.log("res", response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        Alert.alert("Livestock Added", "Livestock has been added successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalVisible(false);
      setLivestockName("");
      setCattleNumber("");
    }
  };

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
          Hello 👋, {userContext.userProfile?.username}
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
          <Pressable
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={22} color="white" />
            <Text style={styles.actionText}>Add Livestock</Text>
          </Pressable>
          <Link
            style={styles.actionButton}
            href={{
              pathname: "/(tabs)/animal/livestocks",
              params: { animal: JSON.stringify(livestocks) },
            }}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <FontAwesome6 name="cow" size={22} color="white" />
              <Text style={styles.actionText}>View Livestock</Text>
            </View>
          </Link>
        </View>
      </View>
      {/* Add Livestock Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Livestock</Text>
            <TextInput
              style={styles.input}
              placeholder="Livestock Name"
              value={livestockName}
              onChangeText={setLivestockName}
            />
            <TextInput
              style={styles.input}
              placeholder="Cattle Number"
              value={cattleNumber}
              onChangeText={setCattleNumber}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddLivestock}
              >
                <Text style={styles.buttonText}>Add Livestock</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: { fontSize: 22, fontWeight: "bold",marginBottom: 10 },
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
    backgroundColor: "#4CD964",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    flexDirection: "column",
    fontWeight: "heavy",
  },
  actionText: { color: "white", marginTop: 5, fontSize: 12, fontWeight: "900" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "#4CD964", padding: 10, borderRadius: 5 },
  cancelButton: { backgroundColor: "#ff5c5c" },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default HomeScreen;
