import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Menu,
  Provider,
  Divider,
  Modal,
  Portal,
  Button,
} from "react-native-paper";
import { setSelectedChat } from "../../store/slices/chatSlice";
import { getIp } from "../../utils/ipaddress";
const ip = getIp();
const API_URL = "http://" + ip + ":5000";
var socket;
export default function GroupsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [groups, setGroups] = useState([]);
  const [visible, setVisible] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([""]);
  const [searchText, SetsearchText] = useState("");
  const [newMessage, setNewMessage] = useState(null);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/chatList`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("Fetched groups:", response.data);

      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleAddContact = async () => {
    if (!contactEmail.trim()) return;

    console.log("Adding contact:", contactEmail);
    try {
      const newUser = await axios.get(
        `${API_URL}/api/chat?search=${contactEmail}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!newUser || newUser.data.length === 0) {
        Alert.alert("Wrong Email", "No user exist with that email");
        return;
      }
      const response = await axios.post(
        `${API_URL}/api/chat/`,
        { userId: newUser.data[0].id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Contact added:", response.data);
      fetchGroups();
      setContactEmail("");
      setContactModal(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
    setContactEmail("");
    setContactModal(false);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    console.log("Creating group:", groupName, "Members:", groupMembers);

    const validUsersIds = [];
    const envalidEmails = [];
    try {
      for (const email of groupMembers) {
        if (email.trim()) {
          const newUser = await axios.get(
            `${API_URL}/api/chat?search=${email.trim()}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (newUser && newUser.data.length > 0) {
            validUsersIds.push(newUser.data[0].id);
          } else {
            envalidEmails.push(email.trim());
          }
        }
      }

      const response = await axios.post(
        `${API_URL}/api/chat/group`,
        { name: groupName, users: validUsersIds },

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Contact added:", response.data);
      fetchGroups();
      if (response.status === 201) {
        Alert.alert(
          "Group Created",
          envalidEmails.length > 0
            ? `These emails are invalid: ${envalidEmails.join("\n")}`
            : "Group created successfully"
        );
      }
    } catch (error) {
      console.error("Error adding Group:", error);
    }
    setGroupName("");
    setGroupMembers([""]);
    setGroupModal(false);
  };
  useEffect(() => {
    socket = io("http://" + ip + ":5000");
    socket.emit("setup", user);

    socket.on("connected", () => console.log("Socket connected"));

    socket.on("message recieved", (newMessage) => {
      console.log("New message received:", newMessage);
      fetchGroups();
    });

    socket.on("new message notification", (newMessage) => {
      console.log("New message notification:", newMessage);
      fetchGroups();
    });

    return () => {
      socket.off("message recieved");
      socket.off("new message notification");
    };
  }, [user]);

  useEffect(() => {
    socket.on("new message notification", (message) => {
      // setNewMessage(message);
    });

    return () => {
      socket.off("new message notification");
    };
  }, [setSelectedChat]);
  useEffect(() => {
    fetchGroups();
  }, []);
  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        dispatch(setSelectedChat(item));
        navigation.navigate("ChatScreen");
      }}
    >
      {!item.isGroupChat ? (
        <Image
          source={{
            uri: item.users.find((u) => u.id !== user.id).avatar,
          }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.groupAvatar}>
          <Text style={styles.groupInitial}>
            {item.isGroupChat
              ? item.name[0]
              : item.users.map((u) => {
                  if (u.id !== user.id) return u.name[0];
                })}
          </Text>
        </View>
      )}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          {item.isGroupChat ? (
            <Text style={styles.name}>{item.name}</Text>
          ) : (
            <Text style={styles.name}>
              {item?.users?.find((u) => u.id !== user.id).name}
            </Text>
          )}
          <Text style={styles.time}>{item.time || ""}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          <Text style={styles.message} numberOfLines={1}>
            {typeof item.message === "string"
              ? item.message
              : item.message?.content || "No messages yet"}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text>{newMessage} </Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <MaterialIcons
                name="add"
                size={26}
                color="black"
                onPress={openMenu}
                style={{ padding: 5 }}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                setContactModal(true);
              }}
              title="Add Contact"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu();
                setGroupModal(true);
              }}
              title="Create Group"
            />
          </Menu>
        </View>
        <Portal>
          <Modal
            visible={contactModal}
            onDismiss={() => setContactModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Add Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={contactEmail}
              onChangeText={setContactEmail}
              numberOfLines={1}
              autoCorrect={false}
              keyboardType="email-address"
            />
            <Button mode="contained" onPress={handleAddContact}>
              Add
            </Button>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={groupModal}
            onDismiss={() => setGroupModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Create Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group name"
              value={groupName}
              onChangeText={setGroupName}
            />
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Add Members
            </Text>
            {groupMembers.map((email, idx) => (
              <TextInput
                key={idx}
                style={styles.input}
                placeholder="Enter member email"
                value={email}
                onChangeText={(text) => {
                  const updated = [...groupMembers];
                  updated[idx] = text;
                  setGroupMembers(updated);
                }}
              />
            ))}
            <Button onPress={() => setGroupMembers([...groupMembers, ""])}>
              + Add More
            </Button>
            <Button mode="contained" onPress={handleCreateGroup}>
              Create
            </Button>
          </Modal>
        </Portal>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="gray"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search chat..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={SetsearchText}
          />
        </View>
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChatItem}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>ALL CHATS</Text>
          }
        />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: { flex: 1, fontSize: 14 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "gray",
    marginVertical: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  groupAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: "#d9f2e6",
    justifyContent: "center",
    alignItems: "center",
  },
  groupInitial: { fontSize: 18, fontWeight: "bold", color: "#0a8f6d" },
  chatContent: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  name: { fontWeight: "bold", fontSize: 15 },
  time: { fontSize: 12, color: "gray" },
  message: { fontSize: 13, color: "gray" },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
});
