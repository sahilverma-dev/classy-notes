// react native
import { View, Text, TouchableOpacity, Image } from "react-native";

// libraries
import MasonryList from "@react-native-seoul/masonry-list";

// icons
import { AntDesign, Feather } from "@expo/vector-icons";

// components
import NoteCard from "../components/NoteCard";
import Loader from "../components/Loader";
import Error from "../components/Error";

// react query
import { useQuery } from "react-query";

// firebase
import { getNotes } from "../firebase/calls/getNotes";

// context
import { useAuth } from "../contexts/AuthContext";

const Home = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const {
    data: notes,
    isError,
    isLoading,
    refetch,
  } = useQuery(["notes"], () => user && getNotes(user?.uid));

  const { navigate, replace } = navigation;

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between p-2">
        <Image
          source={{
            uri: user?.photoURL || "",
          }}
          style={{
            borderWidth: 1,
            aspectRatio: 1,
            borderRadius: 50,
            height: 40,
            width: 40,
          }}
        />
        <Text className="font-bold text-lg">Classy Notes</Text>
        <TouchableOpacity
          onPress={() => {
            logout();
            // replace("Login");
          }}
        >
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isError ? (
            <Error refresh={refetch} />
          ) : (
            <>
              {notes?.length === 0 ? (
                <View className="flex-1 w-full items-center justify-center">
                  <Text className="text-base font-medium">No notes found</Text>
                  <TouchableOpacity onPress={() => refetch()}>
                    <Text className="text-base text-blue-500 font-bold">
                      Try to refresh
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <MasonryList
                  data={notes || []}
                  keyExtractor={(item): string => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  // refreshing={isLoading}
                  onRefresh={refetch}
                  renderItem={({ item }) => (
                    <NoteCard
                      // @ts-ignore
                      note={item}
                    />
                  )}
                  onEndReachedThreshold={0.1}
                />
              )}
            </>
          )}
        </>
      )}

      <TouchableOpacity
        className="absolute right-2 bottom-4 bg-indigo-500 aspect-square items-center justify-center h-12 rounded-full"
        onPress={() => navigate("NewNote")}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
