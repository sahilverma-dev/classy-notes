import { View, Text, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <View className="flex-1 flex items-center justify-center w-full h-full gap-y-2">
      <ActivityIndicator color="#6369d1" size="large" />
      <Text className="font-bold w-full text-center">Loading ...</Text>
    </View>
  );
};

export default Loader;
