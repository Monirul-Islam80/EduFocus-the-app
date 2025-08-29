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
import logo from "../../../assets/edufocusicon.png";
import default_avatar from "../../../assets/default-avatar.webp";
import * as ImagePicker from "expo-image-picker";
import { getIp } from "../../utils/ipaddress";
const SignUpScreen = ({ navigation }) => {
  const ip = getIp();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setcPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const { isloading, setIsLoading } = useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  const handleSignUp = async () => {
    console.log("Sign Up button pressed\n");
    if (!email || !password || !name || !cPassword) {
      Alert.alert("Error", "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== cPassword) {
      Alert.alert("Error", "Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      let uploadedAvatarUrl = null;

      if (avatar) {
        uploadedAvatarUrl = await postAvatar();
        if (!uploadedAvatarUrl) {
          Alert.alert("Error", "Failed to upload avatar");
          setIsLoading(false);
          return;
        }
      }
      console.log("Avatar URL:", uploadedAvatarUrl);

      const response = await fetch("http://" + ip + ":5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          avatar: uploadedAvatarUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Verification Required!",
          "Please check your email to verify your account."
        );
        dispatch(setUser(data.user));
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      Alert.alert("Error", "Something went wrong, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const postAvatar = async () => {
    if (
      !avatar.endsWith(".jpg") &&
      !avatar.endsWith(".jpeg") &&
      !avatar.endsWith(".png")
    ) {
      Alert.alert(
        "Error",
        "Invalid image format. Please upload a JPEG or PNG image."
      );
      return null;
    }

    const formData = new FormData();
    const filename = avatar.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("file", { uri: avatar, name: filename, type });
    formData.append("upload_preset", "edufocus_img");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/soumiks/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={{
          width: 80,
          height: 80,
          alignSelf: "center",
          marginBottom: 10,
        }}
      />
      <Text style={styles.title}>Sign Up</Text>
      <Image
        source={avatar ? { uri: avatar } : default_avatar}
        style={styles.avatar}
      />
      <View style={styles.avatarOptions}>
        <TouchableOpacity style={styles.optionBtn} onPress={pickImage}>
          <Text style={styles.optionText}>📂 Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBtn} onPress={takePhoto}>
          <Text style={styles.optionText}>📷 Take Photo</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Name"
        style={styles.input}
        placeholderTextColor="#777"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#777"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#777"
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#777"
        onChangeText={setcPassword}
        value={cPassword}
      />
      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account?
        <Text style={{ fontWeight: "bold" }}>Login</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#02aeaeff",
    textAlign: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#7bbdbdff",
  },

  avatarOptions: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },

  optionBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  optionText: { fontSize: 14, color: "#333" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    color: "black",
    fontSize: 16,
    outlineColor: "#95cccc",
    outlineWidth: 2,
  },

  signupBtn: {
    backgroundColor: "#6c4e92ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  signupText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  link: { color: "#4A90E2", marginTop: 16, textAlign: "center", fontSize: 14 },
});

export default SignUpScreen;
