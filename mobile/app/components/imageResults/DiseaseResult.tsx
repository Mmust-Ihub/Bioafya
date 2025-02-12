import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import Markdown from "react-native-markdown-display";
import { AnimalDiseaseInfo, Vet } from "@/constants/types";
import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";
import { apiUrl } from "@/constants/api";

export default function DiseaseResult(results: AnimalDiseaseInfo) {
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext,  must be used within their providers");
  }

  const { userToken } = authContext;

  const markdownStyles = {
    body: { color: themeColors.text },
    heading1: { color: themeColors.tint },
    heading2: { color: themeColors.tint },
  };

  const handleContactVet = async (vet: Vet, results: AnimalDiseaseInfo) => {
    try {
      const response = await fetch(`${apiUrl}/user/select-vet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          vetId: vet._id,
          animal: results.animal,
          disease: results.disease,
          image_url: results.image_url,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        Alert.alert("Vet Notified", "Vet has been notified of your request");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <View
        style={[styles.majorInfo, { backgroundColor: themeColors.background }]}
      >
        <Text style={[styles.majorInfoText, { color: themeColors.text }]}>
          Animal: {results.animal}
        </Text>
        <Text style={[styles.majorInfoText, { color: themeColors.text }]}>
          Disease: {results.disease}
        </Text>
      </View>
      {/* 
      {results.image_url && (
        <Image source={{ uri: results.image_url }} style={styles.image} />
      )} */}

      {(["symptoms", "cause", "preventive_measures", "remedy"] as const).map(
        (key) =>
          Array.isArray(results[key]) &&
          results[key].length > 0 && (
            <View key={key} style={styles.resultsContainer}>
              <Text
                style={[styles.resultsSubHeading, { color: themeColors.tint }]}
              >
                {key.replace("_", " ").toUpperCase()}
              </Text>
              {(results[key] as string[]).map((item, index) => (
                <Markdown key={index} style={markdownStyles}>
                  {item}
                </Markdown>
              ))}
            </View>
          )
      )}

      {results.nearbyVets.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsSubHeading, { color: themeColors.tint }]}>
            Chose A Nearby Vet to contact
          </Text>
          {results.nearbyVets.map((vet, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.vetItem, { backgroundColor: themeColors.cardBg }]}
              onPress={() => {
                setSelectedVet(vet);
                setModalVisible(true);
              }}
            >
              <Text style={{ color: themeColors.text }}>{vet.username}</Text>
              <Text style={{ color: themeColors.text }}>
                {vet.phone_number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeColors.background },
            ]}
          >
            {selectedVet && (
              <>
                <Text style={[styles.modalTitle, { color: themeColors.tint }]}>
                  {selectedVet.username}
                </Text>
                <Text style={{ color: themeColors.text }}>
                  Phone: {selectedVet.phone_number}
                </Text>
                <Text style={{ color: themeColors.text }}>
                  Email: {selectedVet.email}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleContactVet(selectedVet, results)}
                    style={{ ...styles.closeButton, backgroundColor: "green" }}
                  >
                    <Text style={{ color: "white" }}>Request Checkup</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  majorInfo: {
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 5,
  },
  majorInfoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  resultsSubHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  vetItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
});
