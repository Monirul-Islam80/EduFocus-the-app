import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { io } from "socket.io-client";
import { getIp } from "../../utils/ipaddress";
import { useFocusEffect } from "@react-navigation/native";

const quickActions = [
  { id: "1", label: "Announce", icon: "megaphone-outline" },
  { id: "2", label: "Assignment", icon: "document-text-outline" },
  { id: "3", label: "Upload", icon: "cloud-upload-outline" },
  { id: "4", label: "Poll", icon: "bar-chart-outline" },
];
var socket, selectedChatCompare;
export default function ChatScreen({ navigation }) {
  const ip = getIp();
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userCount, setuserCount] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const scrollViewRef = useRef();
  let typingTimeout;

  const handleInput = (value) => {
    setUserInput(value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat.id);
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    // debounce---now that's some cool stuff 😎
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat.id);
      setTyping(false);
    }, 3000);
  };

  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat.id);
    if (!userInput) return;
    try {
      const response = await axios.post(
        `http://${ip}:5000/api/message/`,
        {
          content: userInput,
          chatId: selectedChat.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      setMessages([...messages, response.data]);
      socket.emit("new message", response.data);
      setUserInput("");
    } catch (error) {
      console.error("Error sending message to db:", error);
    }
  };
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://${ip}:5000/api/message/${selectedChat.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages(response.data);
      socket.emit("join chat", selectedChat.id);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };
  useEffect(() => {
    socket = io("http://" + ip + ":5000");
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    console.log(user);
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    const messageHandler = (newMessageRecived) => {
      setMessages((prev) => [...prev, newMessageRecived]);
    };

    socket.on("message recieved", messageHandler);

    return () => {
      socket.off("message recieved", messageHandler);
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log(selectedChat);
      socket.on("user joined", ({ userCount }) => {
        console.log(`Total users: ${userCount}`);
        setuserCount(userCount);
      });
      socket.on("joined confirmation", ({ userCount }) => {
        console.log(`You joined. Total users: ${userCount}`);
        setuserCount(userCount);
      });
      return () => {
        socket.emit("leave room", selectedChat.id);
        console.log("leaving chat room", selectedChat.name);
      };
    }, [selectedChat])
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("GroupInfo")}>
          <Text style={styles.headerTitle}>
            {selectedChat.isGroupChat
              ? selectedChat.name
              : selectedChat.users.map((u) => {
                  if (u.id !== user.id) return u.name;
                })}
          </Text>
          <Text style={styles.headerSub}>
            {selectedChat.isGroupChat
              ? isTyping
                ? "typing..."
                : ` ${userCount} online `
              : isTyping
              ? "typing..."
              : userCount > 1
              ? "online"
              : "offline"}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={22} style={styles.icon} />
          <Ionicons name="ellipsis-vertical" size={22} />
        </View>
      </View>

      <View style={styles.actionsRow}>
        {quickActions?.map((a) => (
          <TouchableOpacity key={a.id} style={styles.actionBtn}>
            <Ionicons name={a.icon} size={22} color="#007bff" />
            <Text style={styles.actionText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 40}
      >
        {/* <ScrollView
          style={styles.messages}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          ref={scrollViewRef}
        >
          {messages?.reverse().map((msg) => {
            const isCurrentUser = msg.sender.id === user.id;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageCard,
                  isCurrentUser ? styles.myMessage : styles.otherMessage,
                ]}
              >
                {!isCurrentUser && (
                  <Text style={styles.messageSender}>{msg.sender.name}</Text>
                )}
                <Text style={styles.messageText}>{msg.content}</Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour12: false,
                  })}
                </Text>
              </View>
            );
          })}
        </ScrollView> */}
        {messages && (
          <FlatList
            data={messages.slice().reverse()}
            renderItem={({ item }) => {
              const isCurrentUser = item.sender.id === user.id;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.messageCard,
                    isCurrentUser ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  {!isCurrentUser && (
                    <Text style={styles.messageSender}>{item.sender.name}</Text>
                  )}
                  <Text style={styles.messageText}>{item.content}</Text>
                  <Text style={styles.messageTime}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour12: false,
                    })}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
            inverted={true}
          />
        )}

        <View style={styles.inputBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.commandRow}>
              <TouchableOpacity
                style={styles.commandBtn}
                onPress={() => setUserInput("/todo")}
              >
                <Text style={styles.commandText}>/todo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commandBtn}
                onPress={() => setUserInput("/resource")}
              >
                <Text style={styles.commandText}>/resource</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commandBtn}
                onPress={() => setUserInput("/schedule")}
              >
                <Text style={styles.commandText}>/schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commandBtn}
                onPressIn={() => setUserInput("/poll")}
              >
                <Text style={styles.commandText}>/poll</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Type a message or use /commands..."
              style={styles.input}
              value={userInput}
              onChangeText={handleInput}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={22} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSub: { fontSize: 12, color: "gray" },
  headerIcons: { flexDirection: "row" },
  icon: { marginRight: 12 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  actionBtn: { alignItems: "center" },
  actionText: { marginTop: 5, fontSize: 12 },

  messages: { flex: 1, padding: 15 },
  messageCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    paddingBottom: 2,
    borderRadius: 10,
    marginBottom: 12,
  },
  announcementCard: { backgroundColor: "#eaf3ff" },
  messageSender: { fontWeight: "bold", marginBottom: 4 },
  senderRole: { fontSize: 12, color: "gray" },
  messageText: { fontSize: 14, marginBottom: 6 },
  messageTime: { fontSize: 11, color: "gray", marginTop: 3 },

  assignmentBox: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 6,
  },
  assignmentText: { fontSize: 12 },
  assignmentLink: { color: "#007bff", fontSize: 12, marginTop: 4 },

  inputBar: {
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 8,
    marginTop: 5,
  },
  commandRow: { flexDirection: "row", marginBottom: 8 },
  commandBtn: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
  },
  commandText: { fontSize: 12, color: "gray" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1fcd3",
    borderTopRightRadius: 0,
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  input: { flex: 1, paddingVertical: 6, fontSize: 14 },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  navBtn: { alignItems: "center" },
  navText: { fontSize: 12, marginTop: 4 },
});
