import React, { useContext } from "react";
import { SafeAreaView, Image, StyleSheet } from "react-native";
import { OnboardingContext } from "@/contexts/OnBoardingContext";
import { router } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import Login from "./Login";
import { StatusBar } from "expo-status-bar";
import Onboarding from "react-native-onboarding-swiper";

const OnBoarding = () => {
  const authContext = useContext(AuthContext);
  const onboardingContext = useContext(OnboardingContext);

  if (!authContext || !onboardingContext) {
    throw new Error(
      "AuthContext and OnboardingContext must be used within their providers"
    );
  }
  const { userToken } = authContext;
  const { isOnboardingCompleted, completeOnboarding } = onboardingContext;

  if (isOnboardingCompleted && !userToken) {
    return <Login />;
  }

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/(auth)/Login");
  };

  if (isOnboardingCompleted) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Onboarding
        onSkip={handleComplete}
        onDone={handleComplete}
        pages={[
          {
            backgroundColor: "rgba(246,204,244,0.1)",
            image: (
              <Image
                source={require("../../assets/images/download.jpg")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Welcome to BioAfya",
            subtitle:
              "BioAfya is IoT-based livestock health monitoring system.",
            titleStyles: styles.title1,
            subTitleStyles: styles.subtitle1,
          },
          {
            backgroundColor: "rgba(46,204,64,0.6)",
            image: (
              <Image
                source={require("../../assets/images/image2.png")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "Track vital signs and detect disease ",
            subtitle:
              " Use wearable sensors to track vital signs and detect disease early.",
            titleStyles: styles.title2,
            subTitleStyles: styles.subtitle2,
          },
          {
            backgroundColor: "rgba(207, 203, 167, 0.4)",
            image: (
              <Image
                source={require("../../assets/images/image1.png")}
                style={styles.image}
                resizeMode="cover"
              />
            ),
            title: "AI-driven disease prediction",
            subtitle: "Alerts  when abnormal patterns are detected",
            titleStyles: styles.title3,
            subTitleStyles: styles.subtitle3,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    overflow: "hidden",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  title1: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 24,
  },
  subtitle1: {
    color: "#333",
    fontWeight: "semibold",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
  },
  title2: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 24,
  },
  subtitle2: {
    color: "#333",
    fontWeight: "semibold",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
  },
  title3: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 24,
  },
  subtitle3: {
    color: "#333",
    fontWeight: "semibold",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default OnBoarding;
