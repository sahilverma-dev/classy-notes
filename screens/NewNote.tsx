import { useRef, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

// icons
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useToast } from "react-native-toast-notifications";

import { useMutation } from "react-query";
import { useAuth } from "../contexts/AuthContext";

const handleHead = ({ tintColor }: any) => (
  <Text style={{ color: tintColor }}>H1</Text>
);
const NewNote = ({ navigation, route }: any) => {
  const toast = useToast();
  const { user } = useAuth();

  const richText = useRef<any>();
  const { goBack, replace } = navigation;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const saveNote = async () => {
    const notesRef = collection(firestore, `users/${user?.uid}/notes`);
    try {
      const note = await addDoc(notesRef, {
        title,
        content,
        isBookmarked,
        timestamp: serverTimestamp(),
        lastEdit: serverTimestamp(),
      });

      toast.show("Note Added");

      replace("Note", {
        note: {
          id: note.id,
          title,
          content,
          isBookmarked,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const { mutateAsync, isLoading } = useMutation(["notes"], saveNote);

  return (
    <SafeAreaView className="p-2 flex-1">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity
            style={{
              opacity:
                title.length === 0 || content.length === 0 || isLoading
                  ? 0.5
                  : 1,
            }}
            disabled={title.length === 0 || content.length === 0 || isLoading}
            onPress={() => setIsBookmarked((state) => !state)}
          >
            {isBookmarked ? (
              <Ionicons name="bookmark" size={25} color="#6369d1" />
            ) : (
              <Ionicons name="bookmark-outline" size={25} color="black" />
            )}
          </TouchableOpacity>
          {isLoading ? (
            <ActivityIndicator color="#6369d1" size={30} />
          ) : (
            <TouchableOpacity
              onPress={() => mutateAsync()}
              style={{
                opacity: title.length === 0 || content.length === 0 ? 0.5 : 1,
              }}
              disabled={title.length === 0 || content.length === 0}
            >
              <Ionicons name="save" size={24} color={"black"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <View className="p-2">
          <TextInput
            placeholder="Title"
            className="text-xl"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "space-between" }}
        >
          <RichEditor
            ref={richText}
            androidLayerType="software"
            placeholder="Write your note...."
            onChange={(text) => setContent(text)}
            // containerStyle={{
            //   borderBlockColor: "red",
            //   borderWidth: 1,
            //   borderRadius: 10,
            // }}
            editorStyle={{
              backgroundColor: "transparent",
            }}
          />
        </KeyboardAvoidingView>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.alignCenter,
            actions.alignFull,
            actions.alignLeft,
            actions.blockquote,
            actions.code,
            actions.heading1,
          ]}
          iconMap={{ [actions.heading1]: handleHead }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewNote;
