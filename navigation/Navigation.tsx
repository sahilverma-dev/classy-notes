import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import Home from "../screens/Home";
import Login from "../screens/Login";
import Note from "../screens/Note";
import NewNote from "../screens/NewNote";
import Onboarding from "../screens/Onboarding";

import { useAuth } from "../contexts/AuthContext";
import { getItem } from "../utils";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<null | boolean>(null);

  useEffect(() => {
    async function checkIfAlreadyOnboarded() {
      const onboarded = await getItem("onboarded");
      setShowOnboarding(!onboarded);
    }
    checkIfAlreadyOnboarded();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar />
      {showOnboarding !== null && (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={
            showOnboarding ? "Onboarding" : user !== null ? "Home" : "Login"
          }
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Note" component={Note} />
              <Stack.Screen name="NewNote" component={NewNote} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Onboarding" component={Onboarding} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
