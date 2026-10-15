import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { Platform } from "react-native";

onlineManager.setEventListener((setOnline) => {
  if (Platform.OS === "web" && typeof window === "undefined") return () => {};

  const subscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });

  Network.getNetworkStateAsync().then((state) => {
    setOnline(!!state.isConnected);
  }).catch(() => { /* Keep the current status if the network lookup fails. */ });

  return () => subscription.remove();
});