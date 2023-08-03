import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

// @ts-ignore
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { setItem } from "../utils";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleDone = () => {
    // @ts-ignore
    navigation.replace("Login");
    setItem("onboarded", "1");
  };

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  };

  const onboardingData = [
    {
      backgroundColor: "#0163a2",
      image: (
        <View style={styles.lottie}>
          <Lottie
            source={require("../assets/animations/boost.json")}
            autoPlay
            loop
          />
        </View>
      ),
      title: "Welcome to Classy Notes!",
      subtitle:
        "Simplify note-taking and organization for a more productive you.",
    },
    {
      backgroundColor: "#6369d1",
      image: (
        <View style={styles.lottie}>
          <Lottie
            source={require("../assets/animations/work.json")}
            autoPlay
            loop
          />
        </View>
      ),
      title: "Mastery of Note-Taking",
      subtitle:
        "Efficiently capture, categorize, and access insights for enhanced productivity.",
    },
    {
      backgroundColor: "#008083",
      image: (
        <View style={styles.lottie}>
          <Lottie
            source={require("../assets/animations/achieve.json")}
            autoPlay
            loop
          />
        </View>
      ),
      title: "Boost Productivity with Classy Notes",
      subtitle:
        "Elevate focus and collaboration with our powerful, intuitive note-taking solution.",
    },
  ];

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        DoneButtonComponent={doneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={onboardingData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
  },
});
