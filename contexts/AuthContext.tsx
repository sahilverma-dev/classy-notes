import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";

import { createContext, useContext, useState, useEffect } from "react";
import Loading from "../components/Loading";

import * as Google from "expo-auth-session/providers/google";

import { auth } from "../firebase/config";

// interfaces
import { AuthContextReturnType, AuthProviderType } from "../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<AuthContextReturnType | null>(null);

const AuthProvider = ({ children }: AuthProviderType) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [_, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "####################################################",
    androidClientId: "####################################################",
  });

  const googleLogin = () => promptAsync();

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    signOut(auth);
  };

  useEffect(() => {
    const getData = async () => {
      if (response?.type === "success") {
        const credentials = GoogleAuthProvider.credential(
          response.authentication?.idToken,
          response.authentication?.accessToken
        );
        await signInWithCredential(auth, credentials);
      }
    };

    getData();
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } else setUser(null);

      setLoading(true);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        googleLogin,
      }}
    >
      {loading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  } else {
    throw new Error("Something is wrong with auth context");
  }
};

export { AuthProvider, useAuth };
