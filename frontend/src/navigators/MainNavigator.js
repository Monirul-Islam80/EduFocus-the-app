import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";
import CoursesScreen from "../screens/courseScreens/CoursesScreen";
import ProfileScreen from "../screens/userProfileScreens/ProfileScreen";
import ChatNavigator from "./ChatNavigator";
import TaskNavigator from "./TaskNavigator";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Todos") iconName = "checkmark-circle-outline";
          else if (route.name === "Courses") iconName = "book-outline";
          else if (route.name === "Chat") iconName = "chatbubble-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Todos" component={TaskNavigator} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Chat" component={ChatNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
