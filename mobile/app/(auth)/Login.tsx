import React, { useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/contexts/AuthContext";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext"; // For theme management
import { Colors } from "@/constants/Colors"; // Custom colors based on themes

export default function Login() {
  const [Email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    throw new Error("Contexts not found");
  }

  const { login, isLoading } = authContext;
  const { isDarkMode } = themeContext;

  const handleLogin = () => {
    if (!Email || !password) {
      setModalMessage("All fields are required");
      setIsModalVisible(true);
      return;
    }
    const emailTest =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!emailTest.test(Email.trim())) {
      setModalMessage("Invalid email address");
      setIsModalVisible(true);
      return;
    }
    Keyboard.dismiss();
    login(Email, password);
  };

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Set theme-based colors
  const backgroundColor = isDarkMode
    ? Colors.dark.background
    : Colors.light.background;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const inputBorderColor = isDarkMode ? Colors.dark.tint : Colors.light.tint;
  const iconColor = isDarkMode ? Colors.dark.icon : Colors.light.icon;

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ backgroundColor, opacity: 0.6 }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={{ color: textColor }} className="text-lg mt-4">
          Logging in...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ backgroundColor, position: "relative" }}
      className="flex-1 relative"
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View>
        {/* wave like header */}
        <View
          style={{
            backgroundColor: Colors.light.tint,
            height: 100,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 0,
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex justify-center items-center h-screen px-4 space-y-6 w-screen z-50"
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="gap-4">
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: 300,
                height: 100,
                alignSelf: "center",
                resizeMode: "cover",
                top: 2,
              }}
            />

            {/* Email input with icon */}
            <Text className="font-bold" style={{ color: textColor }}>
              Email
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons name="mail-outline" size={20} color={iconColor} />
              <TextInput
                onChange={(e) => setEmail(e.nativeEvent.text.trim())}
                className="ml-2 flex-1"
                placeholder="Email..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
            </View>

            {/* Password input with icon */}
            <Text className="font-bold" style={{ color: textColor }}>
              Password
            </Text>
            <View
              style={{ borderColor: inputBorderColor }}
              className="border rounded-lg w-full flex flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={iconColor}
              />
              <TextInput
                onChange={(e) => setPassword(e.nativeEvent.text)}
                secureTextEntry={!isOpen}
                className="ml-2 flex-1"
                placeholder="Password..."
                placeholderTextColor={iconColor}
                style={{ color: textColor }}
              />
              <TouchableOpacity onPress={handleOpen}>
                <Feather
                  name={isOpen ? "eye" : "eye-off"}
                  size={24}
                  color={iconColor}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password link */}
            <View className="w-full">
              <TouchableOpacity className="mt-2">
                <Text
                  style={{ color: Colors.light.tint }}
                  className="text-lg text-right underline"
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login button */}
            <View className="w-full flex flex-row justify-center items-center ">
              <TouchableOpacity
                className="bg-[#2ecc40] rounded-lg w-full px-4 py-4"
                onPress={handleLogin}
              >
                <Text className="text-white text-center font-bold">Login</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up link */}
            <View className="w-full flex flex-row justify-start mt-2">
              <TouchableOpacity
                className="flex flex-row justify-center items-center"
                onPress={() => router.replace("/(auth)/register")}
              >
                <Text
                  style={{ color: Colors.light.tint }}
                  className="text-lg underline"
                >
                  Don't have an account?{" "}
                </Text>
                <Text
                  style={{ color: Colors.light.tint }}
                  className="text-lg font-bold underline  "
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
            Error
          </Text>
          <Text style={{ fontSize: 16, marginTop: 10, textAlign: "center" }}>
            {modalMessage}
          </Text>
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={{
              backgroundColor: "#2ecc40",
              padding: 10,
              marginTop: 20,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                paddingHorizontal: 20,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View>
        {/* wave like header */}
        <View
          style={{
            backgroundColor: Colors.light.tint,
            height: 100,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            position: "absolute",
            bottom: -100,
            left: 0,
            right: 0,
            zIndex: 0,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
