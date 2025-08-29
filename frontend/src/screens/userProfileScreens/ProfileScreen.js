import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../store/slices/authSlice";
import * as ImagePicker from "expo-image-picker";
import default_avatar from "../../../assets/default-avatar.webp";
const ProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar || null);
      console.log("====================================");
      console.log(user);
      console.log("====================================");
    }
  }, [user]);

  const handleUpdate = () => {
    Alert.alert("Profile Updated", `Name: ${name}\nEmail: ${email}`);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : default_avatar}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarBtn} onPress={pickImage}>
          <Text style={{ color: "white", fontSize: 12 }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fb",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#7bbdbdff",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "#7bbdbdff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#7bbdbdff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  updateBtn: {
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
    marginBottom: 20,
  },
  updateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
