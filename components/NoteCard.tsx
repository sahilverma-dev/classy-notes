import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FC, useState } from "react";
import { Note } from "../interfaces";

import { useNavigation } from "@react-navigation/native";

// icons
import { Ionicons } from "@expo/vector-icons";
import { convertTimestamp } from "../utils";

import RenderHTML from "react-native-render-html";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useAuth } from "../contexts/AuthContext";

const NoteCard: FC<{ note: Note }> = ({ note }) => {
  const { navigate } = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(note.isBookmarked);
  const toast = useToast();
  const { user } = useAuth();

  const toggleBookmark = async () => {
    const noteRef = doc(firestore, `users/${user?.uid}/notes/${note?.id}`);
    try {
      await setDoc(
        noteRef,
        {
          isBookmarked: !isBookmarked,
        },
        {
          merge: true,
        }
      );
      setIsBookmarked(!isBookmarked);
      toast.show(isBookmarked ? "Bookmark Removed" : "Bookmark Added");
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const toggleBookmarkMutation = useMutation(["notes"], toggleBookmark);

  return (
    <TouchableOpacity
      className="p-2"
      onPress={() => {
        // @ts-ignore
        navigate("Note", { note });
      }}
    >
      <View className="p-2 rounded-md bg-white shadow-md">
        <Text className="text-gray-500 text-xs">
          {convertTimestamp(note?.lastEdit || note.timestamp)}
        </Text>
        <View className="flex-row items-center justify-between w-full">
          <Text className="font-bold text-lg max-w-[80%]" numberOfLines={1}>
            {note.title}
          </Text>
          {toggleBookmarkMutation.isLoading ? (
            <ActivityIndicator color="#6369d1" size={20} />
          ) : (
            <TouchableOpacity
              onPress={() => toggleBookmarkMutation.mutateAsync()}
              className="aspect-square p-2"
              disabled={toggleBookmarkMutation.isLoading}
            >
              {isBookmarked ? (
                <Ionicons name="bookmark" size={18} color="#6369d1" />
              ) : (
                <Ionicons name="bookmark-outline" size={18} color="black" />
              )}
            </TouchableOpacity>
          )}
        </View>
        <RenderHTML
          contentWidth={200}
          source={{
            html: note.content?.slice(0, 50).trim(),
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;
