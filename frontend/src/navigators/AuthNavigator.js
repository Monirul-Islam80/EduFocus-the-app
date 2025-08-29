import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import LoginScreen from "../screens/authScreens/LoginScreen";
import SignUpScreen from "../screens/authScreens/SignUpScreen";
import TaskScreen from "../screens/homeScreens/TaskScreen";
import MainNavigator from "./MainNavigator";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="App"
            component={MainNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
