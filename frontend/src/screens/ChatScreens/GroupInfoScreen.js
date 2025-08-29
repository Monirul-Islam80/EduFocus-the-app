import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function GroupInfoScreen({ navigation }) {
  const { selectedChat } = useSelector((state) => state.chat);

  const renderItem = ({ item }) => (
    <View style={styles.memberRow}>
      <Ionicons name="person-circle-outline" size={42} color="#007bff" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      {item.role === "Admin" && <Text style={styles.adminBadge}>Admin</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#a600ffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Info</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.groupInfo}>
        <Ionicons name="people-circle-outline" size={70} color="#007bff" />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.groupName}>{selectedChat.name}</Text>
          <Text style={styles.groupDesc}>
            {selectedChat.users.length} online
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Members ({selectedChat.users.length})
        </Text>
      </View>
      <FlatList
        data={selectedChat.users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
  },

  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  groupName: { fontSize: 20, fontWeight: "bold" },
  groupDesc: { fontSize: 13, color: "gray", marginTop: 3 },

  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "gray" },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },
  memberName: { fontSize: 16, fontWeight: "500" },
  memberRole: { fontSize: 12, color: "gray", marginTop: 2 },
  adminBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007bff",
    backgroundColor: "#eaf3ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
