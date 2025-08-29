import { Provider } from "react-redux";
import { store } from "./src/store";
import AuthNavigator from "./src/navigators/AuthNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <AuthNavigator />
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
}
