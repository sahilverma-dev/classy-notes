import { View, Text, TouchableOpacity } from "react-native";
import { FC } from "react";

import Lottie from "lottie-react-native";

const Error: FC<{ refresh: () => void }> = ({ refresh }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Lottie
        source={require("../assets/animations/error.json")}
        autoPlay={true}
        loop={false}
        resizeMode="contain"
        style={{
          height: 100,
          width: 100,
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        onPress={refresh}
        className="bg-indigo-500 py-2 px-8 rounded-md items-center justify-center"
      >
        <Text className="text-base text-white font-bold text-center">
          Refresh
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;
