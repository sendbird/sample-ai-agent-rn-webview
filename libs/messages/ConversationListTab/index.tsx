import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { ConversationListHTML } from "@/libs/messages/ConversationListTab/html";

export default function ConversationListTab() {
  const handleMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (message === "startChat") {
      router.push("/ai-agent-messages");
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: ConversationListHTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  webview: {
    flex: 1,
  },
});
