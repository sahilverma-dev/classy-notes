import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timestamp } from "firebase/firestore";

export const convertTimestamp = (timestamp: Timestamp) => {
  const dateObject = timestamp.toDate();
  const currentDate = new Date();

  const timeDiffInSeconds = Math.floor(
    (currentDate.getTime() - dateObject.getTime()) / 1000
  );

  if (timeDiffInSeconds < 60) {
    return `${timeDiffInSeconds}s`;
  } else if (timeDiffInSeconds < 3600) {
    const minutes = Math.floor(timeDiffInSeconds / 60);
    return `${minutes}m`;
  } else if (timeDiffInSeconds < 86400) {
    const hours = Math.floor(timeDiffInSeconds / 3600);
    return `${hours}h`;
  } else if (timeDiffInSeconds < 2592000) {
    const days = Math.floor(timeDiffInSeconds / 86400);
    return `${days}d`;
  } else {
    return dateObject.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

export const htmlToSimpleText = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  let text = doc.body.innerText.trim();

  const maxLength = 150;
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim();
  }

  return text;
};

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.log("Error retrieving value: ", error);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};
