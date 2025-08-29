import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const actions = [
  { id: "1", name: "Scan", icon: "scan-outline" },
  { id: "2", name: "Upload", icon: "cloud-upload-outline" },
  { id: "3", name: "Convert", icon: "repeat-outline" },
  { id: "4", name: "AI Help", icon: "sparkles-outline" },
];

const filters = ["All", "PDFs", "Videos", "Notes", "Images"];

const recentFiles = [
  {
    id: "1",
    title: "Linear Algebra Chapter 3",
    type: "PDF",
    size: "2.3 MB",
    date: "Jan 15, 2025",
    icon: "document-text-outline",
  },
  {
    id: "2",
    title: "Calculus Lecture 12",
    type: "Video",
    size: "45 min",
    date: "Jan 14, 2025",
    icon: "play-circle-outline",
  },
  {
    id: "3",
    title: "Artificial Intelligence Notes",
    type: "Note",
    size: "",
    date: "Jan 13, 2025",
    icon: "document-outline",
  },
];

const folders = [
  { id: "1", name: "Compiler", files: 12 },
  { id: "2", name: "Artificial Intelligence", files: 8 },
  { id: "3", name: "Mathematics", files: 15 },
  { id: "4", name: "Web technology", files: 6 },
];

const allFiles = [
  {
    id: "1",
    title: "Diagram Scan 001",
    type: "Image",
    size: "1.2 MB",
    date: "Jan 12, 2025",
    icon: "image-outline",
  },
  {
    id: "2",
    title: "Assignment Guidelines",
    type: "DOC",
    size: "0.8 MB",
    date: "Jan 11, 2025",
    icon: "document-text-outline",
  },
];

export default function CourseMaterials() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Course Materials</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={22} style={styles.icon} />
          <Ionicons name="ellipsis-vertical" size={22} />
        </View>
      </View>

      <View style={styles.actionRow}>
        {actions.map((a) => (
          <TouchableOpacity key={a.id} style={styles.actionBtn}>
            <Ionicons name={a.icon} size={22} color="#007bff" />
            <Text style={styles.actionText}>{a.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {filters.map((f, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.filterBtn, idx === 0 && styles.filterBtnActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  idx === 0 && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent</Text>
      {recentFiles.map((f) => (
        <View key={f.id} style={styles.fileCard}>
          <Ionicons name={f.icon} size={24} color="#007bff" />
          <View style={styles.fileContent}>
            <Text style={styles.fileTitle}>{f.title}</Text>
            <Text style={styles.fileMeta}>
              {f.type} • {f.size} {f.size && "•"} {f.date}
            </Text>
          </View>
          <Ionicons name="ellipsis-vertical" size={18} color="gray" />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Folders</Text>
      <View style={styles.folderGrid}>
        {folders.map((f) => (
          <TouchableOpacity key={f.id} style={styles.folderCard}>
            <Ionicons name="folder-outline" size={26} color="#f4a300" />
            <Text style={styles.folderName}>{f.name}</Text>
            <Text style={styles.folderMeta}>{f.files} files</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>All Materials</Text>
      {allFiles.map((f) => (
        <View key={f.id} style={styles.fileCard}>
          <Ionicons name={f.icon} size={24} color="#007bff" />
          <View style={styles.fileContent}>
            <Text style={styles.fileTitle}>{f.title}</Text>
            <Text style={styles.fileMeta}>
              {f.type} • {f.size} {f.size && "•"} {f.date}
            </Text>
          </View>
          <Ionicons name="ellipsis-vertical" size={18} color="gray" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionBtn: {
    alignItems: "center",
    width: 70,
  },
  actionText: {
    marginTop: 6,
    fontSize: 12,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  filterBtn: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  filterBtnActive: {
    backgroundColor: "#007bff",
  },
  filterText: {
    fontSize: 13,
    color: "gray",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  fileContent: {
    flex: 1,
    marginLeft: 12,
  },
  fileTitle: {
    fontWeight: "600",
  },
  fileMeta: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
  },
  folderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  folderCard: {
    width: "48%",
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  folderName: {
    marginTop: 6,
    fontWeight: "600",
  },
  folderMeta: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
  },
});
