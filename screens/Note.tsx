import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useToast } from "react-native-toast-notifications";
import { Note } from "../interfaces";
import { useMutation, useQueryClient } from "react-query";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { useAuth } from "../contexts/AuthContext";

const handleHead = ({ tintColor }: any) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const NewNote = ({ navigation, route }: any) => {
  const { width, height } = Dimensions.get("window");
  const toast = useToast();
  const { user } = useAuth();

  const richText = useRef<any>();
  const { goBack } = navigation;

  const note: Note = route?.params?.note;

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isBookmarked, setIsBookmarked] = useState(note?.isBookmarked || false);

  const updateNote = async () => {
    const noteRef = doc(firestore, `users/${user?.uid}/notes/${note?.id}`);
    try {
      await setDoc(
        noteRef,
        {
          title,
          content,
          isBookmarked,
          lastEdit: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      toast.show("Note Updated");
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const deleteNote = async () => {
    const noteRef = doc(firestore, `users/${user?.uid}/notes/${note?.id}`);
    try {
      await deleteDoc(noteRef);

      toast.show("Note Deleted");
      goBack();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const queryClient = useQueryClient();
  const updateMutation = useMutation(["notes"], updateNote);
  const deleteMutation = useMutation(["notes"], deleteNote);

  const isSaveDisabled = title.length === 0 || content.length === 0;
  const isDeleteDisabled =
    isSaveDisabled || updateMutation.isLoading || deleteMutation.isLoading;

  return (
    <SafeAreaView className="p-2 flex-1">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-x-3">
          {deleteMutation.isLoading ? (
            <ActivityIndicator color="#6369d1" size={30} />
          ) : (
            <TouchableOpacity
              style={{ opacity: isDeleteDisabled ? 0.5 : 1 }}
              disabled={isDeleteDisabled}
              onPress={() => deleteMutation.mutateAsync()}
            >
              <FontAwesome5 name="trash" size={18} color="#ed4c4c" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ opacity: isSaveDisabled ? 0.5 : 1 }}
            disabled={isSaveDisabled}
            onPress={() => setIsBookmarked((state) => !state)}
          >
            {isBookmarked ? (
              <Ionicons name="bookmark" size={25} color="#6369d1" />
            ) : (
              <Ionicons name="bookmark-outline" size={25} color="black" />
            )}
          </TouchableOpacity>
          {updateMutation.isLoading ? (
            <ActivityIndicator color="#6369d1" size={30} />
          ) : (
            <TouchableOpacity
              onPress={() => updateMutation.mutateAsync()}
              style={{ opacity: isSaveDisabled ? 0.5 : 1 }}
              disabled={isSaveDisabled}
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
            initialContentHTML={note?.content || ""}
            onChange={(text) => setContent(text)}
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
