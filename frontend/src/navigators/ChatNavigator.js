import { createStackNavigator } from "@react-navigation/stack";
import GroupsScreen from "../screens/ChatScreens/GroupsScreen";
import ChatScreen from "../screens/ChatScreens/ChatScreen";
import GroupInfoScreen from "../screens/ChatScreens/GroupInfoScreen";

const Stack = createStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
    </Stack.Navigator>
  );
}
