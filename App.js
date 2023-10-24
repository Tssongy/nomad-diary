import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./navigator";
import Realm from "realm";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { DBContext } from "./context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [realm, setRealm] = useState(null);
  const startLoading = async () => {
    const connection = await Realm.open({
      path: "nomadDiaryDB",
      schema: [FeelingSchema],
    });
    setRealm(connection);
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Ionicons.font);
        await startLoading();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer onReady={onLayoutRootView}>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
