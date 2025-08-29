import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import logo from "../../../assets/edufocusicon.png";
import { getIp } from "../../utils/ipaddress";
// import GoogleLogin from "./GoogleSignIn";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  // const googleSignIn = async () => {
  //   try {
  //     const response = await GoogleLogin();

  //     const { idToken, user } = response.data ?? {};

  //     if (idToken) {
  //       dispatch(setUser(user.email));
  //       console.log("Google Sign-In successful", user);
  //     }
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  const ip = getIp();
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("http://" + ip + ":5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        dispatch(setUser({ ...data.user, token: data.token }));
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
        return;
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong, please try again later");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#000"}
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        placeholderTextColor={"#000"}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR </Text>
      <View style={styles.horijontalAlign}>
        <Ionicons name="logo-google" size={24} />

        <Text onPress={() => {}}>Google</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text> Don't have an account? </Text>
        <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
          Sign up
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#02aeaeff",
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    color: "black",
    borderColor: "#ccc",
    outlineColor: "#95cccc",
    outlineWidth: 2,
  },
  link: { color: "blue", textAlign: "center" },
  or: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  horijontalAlign: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#7a659dff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
