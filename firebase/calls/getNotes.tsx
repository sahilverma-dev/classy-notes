import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../config";
import { Note } from "../../interfaces";

type Type = (userId: string) => Promise<Note[]>;

// @ts-ignore

export const getNotes: Type = async (userId) => {
  try {
    const notesRef = collection(firestore, `users/${userId}/notes`);
    const q = query(notesRef, orderBy("timestamp", "desc"));
    let data = await getDocs(q);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
