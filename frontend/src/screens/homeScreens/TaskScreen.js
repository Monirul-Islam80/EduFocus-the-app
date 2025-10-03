import React, { use, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Checkbox, Button, FAB } from "react-native-paper";
import logo from "../../../assets/edufocusicon.png";
import TaskFilter from "../../components/TaskFilter";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
} from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import { getIp } from "../../utils/ipaddress";

// const tasksData = [
//   {
//     id: "1",
//     title: "Compiler Assignment Ch.5",
//     priority: "High",
//     type: "Assignment",
//     due: "Tomorrow, 11:59 PM",
//     selectedDate: "2025-09-04",

//     completed: false,
//   },
//   {
//     id: "2",
//     title: "Read Chapter 12 - Artificial Intelligence",
//     priority: "Medium",
//     type: "Reading",
//     due: "Friday, 5:00 PM",
//     selectedDate: "2025-09-05",

//     completed: false,
//   },
//   {
//     id: "3",
//     title: "Compiler Tutorial",
//     priority: "Low",
//     type: "Practice",
//     due: "Today",
//     selectedDate: "2025-09-03",
//     completed: true,
//   },
//   {
//     id: "4",
//     title: "Compiler Tutorial2",
//     priority: "Low",
//     type: "Practice",
//     due: "Today",
//     selectedDate: "2025-09-03",
//     completed: false,
//   },
//   {
//     id: "5",
//     title: "Compiler Tutorial3",
//     priority: "Low",
//     type: "Practice",
//     due: "Today",
//     selectedDate: "2025-09-04",
//     completed: false,
//   },
// ];

// const transformData = tasksData.reduce((acc, task) => {
//   let section = acc.find((s) => s.title === task.selectedDate);
//   if (!section) {
//     section = { title: task.selectedDate, data: [] };
//     acc.push(section);
//   }
//   section.data.push(task);
//   return acc;
// }, []);

const TaskScreen = () => {
  const ip = getIp();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const tasksData = async () => {
    try {
      const response = await axios.get(
        `http://${ip}:5000/api/user/todos/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setagendaSections(
        response.data.reduce((acc, task) => {
          let section = acc.find((s) => s.title === task.selectedDate);
          if (!section) {
            section = { title: task.selectedDate, data: [] };
            acc.push(section);
          }
          section.data.push(task);
          return acc;
        }, [])
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [calFilter, setcalFilter] = useState("Day");
  const [calIcon, setcalIcon] = useState("calendar-today");
  const [agendaSections, setagendaSections] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [fabOpen, setFabOpen] = useState(false);
  const markedDates = tasks?.reduce((acc, task) => {
    console.log(tasks);

    const dateKey = task.selectedDate.split("T")[0];

    acc[dateKey] = {
      marked: true,
      dotColor: task?.completed ? "blue" : "red",
    };

    return acc;
  }, {});

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All"
      ? true
      : task.priority.trim() === filter || task.type.trim() === filter
  );
  const renderAgendaItem = ({ item }) => {
    console.log("rendering", item);
    return (
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
            <Text style={styles.taskDue}>
              Due: {item.selectedDate.split("T")[0]}
            </Text>
            <Text style={styles.taskLabels}>
              {item.priority} | {item.type}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
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

      <TaskFilter
        calIcon={calIcon}
        setcalIcon={setcalIcon}
        calFilter={calFilter}
        setcalFilter={setcalFilter}
        filter={filter}
        setFilter={setFilter}
      />
    </View>
  );

  const renderFooter = () => (
    <View>
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
    </View>
  );
  useEffect(() => {
    tasksData();
  }, []);

  useEffect(() => {
    setagendaSections(
      tasks.reduce((acc, task) => {
        let section = acc.find((s) => s.title === task.selectedDate);
        if (!section) {
          section = { title: task.selectedDate, data: [] };
          acc.push(section);
        }
        section.data.push(task);
        return acc;
      }, [])
    );
  }, [tasks]);

  return (
    <View style={{ flex: 1 }}>
      {calFilter === "Day" ? (
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
                  <Text style={styles.taskDue}>
                    Due: {item.selectedDate.split("T")[0]}
                  </Text>
                  <Text style={styles.taskLabels}>
                    {item.priority} | {item.type}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ padding: 15 }}
        />
      ) : calFilter === "Week" ? (
        <FlatList
          data={["dk"]}
          keyExtractor={(item) => item}
          renderItem={() => (
            <CalendarProvider
              date={selectedDate.split("T")[0]}
              onDateChanged={(date) => setSelectedDate(date)}
            >
              <ExpandableCalendar
                disablePan={true}
                hideKnob={true}
                initialPosition={ExpandableCalendar.positions.CLOSED}
                firstDay={0}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: "#02aeae",
                  todayTextColor: "#02aeae",
                  arrowColor: "#02aeae",
                }}
              />
              <AgendaList
                sections={agendaSections}
                renderItem={renderAgendaItem}
                sectionStyle={{
                  backgroundColor: "#f9f9f9",
                  fontWeight: "bold",
                  padding: 6,
                }}
              />
            </CalendarProvider>
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ padding: 15 }}
        />
      ) : (
        <FlatList
          data={["dk"]}
          keyExtractor={(item) => item}
          renderItem={() => (
            <CalendarProvider
              date={selectedDate.split("T")[0]}
              onDateChanged={(date) => setSelectedDate(date)}
            >
              <ExpandableCalendar
                initialPosition={ExpandableCalendar.positions.OPEN}
                firstDay={0}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: "#02aeae",
                  todayTextColor: "#02aeae",
                  arrowColor: "#02aeae",
                }}
              />
              <AgendaList
                sections={agendaSections}
                renderItem={renderAgendaItem}
                sectionStyle={{
                  backgroundColor: "#f9f9f9",
                  fontWeight: "bold",
                  padding: 6,
                }}
              />
            </CalendarProvider>
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
      <FAB.Group
        open={fabOpen}
        icon={fabOpen ? "close" : "plus"}
        actions={[
          {
            icon: "playlist-plus",
            label: "Add Task",
            onPress: () => navigation.navigate("AddTask"), // Navigate to AddTaskScreen
          },
          {
            icon: "calendar-plus",
            label: "Add Class Schedule",
            onPress: () => navigation.navigate("AddClass"), // Navigate to AddClassScreen
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        style={{ position: "absolute", right: 20, bottom: 20 }}
      />
    </View>
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#02aeaeff",
  },
  calendarMode: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  calendarDayBox: {
    width: "30%", // roughly 3 columns
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    elevation: 1,
  },
});

export default TaskScreen;
