import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Checkbox, Button, Chip } from "react-native-paper";
import logo from "../../../assets/edufocusicon.png";
const tasksData = [
  {
    id: "1",
    title: "Compiler Assignment Ch.5",
    priority: "High",
    type: "Assignment",
    due: "Tomorrow, 11:59 PM",
    completed: false,
  },
  {
    id: "2",
    title: "Read Chapter 12 - Artificial Intelligence",
    priority: "Medium",
    type: "Reading",
    due: "Friday, 5:00 PM",
    completed: false,
  },
  {
    id: "3",
    title: "Compiler Tutorial",
    priority: "Low",
    type: "Practice",
    due: "Today",
    completed: true,
  },
];

const TaskScreen = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [filter, setFilter] = useState("All");

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : task.priority === filter || task.type === filter
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>EduFocus</Text>
      </View>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>8</Text>
          <Text>Today</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>15</Text>
          <Text>This Week</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>3</Text>
          <Text>Overdue</Text>
        </View>
      </View>

      <Button mode="contained" style={{ marginVertical: 10 }}>
        + Add New Task
      </Button>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["All", "High", "Assignment", "Reading"].map((f) => (
          <Chip
            key={f}
            style={{ marginRight: 5 }}
            selected={filter === f}
            onPress={() => setFilter(f)}
          >
            {f}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={item.completed ? "checked" : "unchecked"}
                onPress={() => toggleTask(item.id)}
              />
              <View>
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && { textDecorationLine: "line-through" },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.taskDue}>Due: {item.due}</Text>
                <Text style={styles.taskLabels}>
                  {item.priority} | {item.type}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Class Schedule</Text>
      <View style={styles.calendarContainer}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <View key={idx} style={styles.calendarDay}>
            <Text>{day}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's Classes</Text>
      <View style={styles.classItem}>
        <Text>Compiler Design</Text>
        <Text>9:00 AM - 10:30 AM</Text>
        <Button mode="outlined" compact>
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#02aeaeff",
  },
  summaryBox: {
    alignItems: "center",
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderRadius: 8,
  },
  summaryNumber: { fontSize: 18, fontWeight: "bold" },
  taskCard: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
  taskDue: { fontSize: 12, color: "gray" },
  taskLabels: { fontSize: 12, color: "#007AFF" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  calendarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarDay: { alignItems: "center", padding: 5, flex: 1 },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 5,
    borderRadius: 8,
  },
});

export default TaskScreen;
