import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { useAuth } from "../contexts/AuthContext";

import Lottie from "lottie-react-native";

const Login = () => {
  const { googleLogin } = useAuth();
  const { width } = Dimensions.get("window");

  return (
    <View className="flex-1 bg-indigo-500 items-center justify-center">
      <View
        style={{
          height: 500,
          width: width,
          marginBottom: 20,
        }}
      >
        <Lottie
          source={require("../assets/animations/welcome.json")}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
        />
      </View>
      <TouchableOpacity
        onPress={googleLogin}
        className="bg-white flex-row shadow-md py-2 px-5 rounded-md items-center gap-x-3"
      >
        <Image
          source={require("../assets/icons/google.png")}
          style={{
            height: 30,
            width: 30,
          }}
        />
        <Text className="text-base text-black font-bold text-center mr-3">
          Login with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
