import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import React from "react";
import { ConversationHTML } from "@/libs/messages/ConversationPage/html";

export const ConversationPage = () => {
  const handleMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (message === "goBack") {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: ConversationHTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  webview: {
    flex: 1,
  },
});
