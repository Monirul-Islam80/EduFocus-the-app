import { createStackNavigator } from "@react-navigation/stack";
import AddTaskScreen from "../screens/homeScreens/AddTaskScreen";
import TaskScreen from "../screens/homeScreens/TaskScreen";

const Stack = createStackNavigator();

export default function TaskNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tasks" component={TaskScreen} />
      <Stack.Screen
        screenOptions={{ headerShown: true }}
        name="AddTask"
        component={AddTaskScreen}
        // options={{ title: "Add New Task" }}
      />
      {/* <Stack.Screen
          name="AddClass"
          component={AddClassScree}
          options={{ title: "Add Class Schedule" }}
        /> */}
    </Stack.Navigator>
  );
}
