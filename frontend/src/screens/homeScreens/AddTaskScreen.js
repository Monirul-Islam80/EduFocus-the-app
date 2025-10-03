import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import ModernDateTimePicker from "../../components/ModernDateTimePicker";
import { useSelector } from "react-redux";
import { getIp } from "../../utils/ipaddress";
import axios from "axios";

const AddTaskScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [dueDate, setDueDate] = useState("");
  const { user } = useSelector((state) => state.auth);
  const ip = getIp();
  const handleAdd = async () => {
    try {
      const todoData = {
        title,
        type,
        priority,
        selectedDate,
        selectedTime,
        createdById: user.id,
      };

      const response = await axios.post(
        "http://" + ip + ":5000/api/user/todos",
        todoData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.status);

      if (response.status !== 201) {
        throw new Error("Failed to add todo");
      }

      console.log("Todo added:", response);

      navigation.navigate("Tasks", { refresh: true });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <ScrollView style={{ padding: 15 }}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Type"
        value={type}
        onChangeText={setType}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Priority"
        value={priority}
        onChangeText={setPriority}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      <ModernDateTimePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      <Button mode="contained" onPress={handleAdd} style={{ marginTop: 20 }}>
        Add Task
      </Button>
    </ScrollView>
  );
};

export default AddTaskScreen;
