import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { ConversationListHTML } from "@/libs/messages/ConversationListTab/html";
import {
  AI_AGENT_ID,
  SENDBIRD_APP_ID,
  WEBVIEW_LOCAL_HOST,
} from "@/libs/constants";

interface WebViewMessage {
  type:
    | "SDK_LOADED"
    | "SDK_INITIALIZED"
    | "SDK_ERROR"
    | "TOKEN_REFRESH_REQUIRED"
    | "OPEN_CONVERSATION";
  payload?: any;
}

interface WebViewCommand {
  type: "INITIALIZE_SDK";
  payload: {
    appId: string;
    aiAgentId: string;
    language?: string;
    countryCode?: string;
    context?: Record<string, string>;
    userSessionInfo?: {
      userId?: string;
      authToken?: string;
    };
  };
}

interface WebViewRefreshTokenCommand {
  type: "TOKEN_REFRESHED";
  payload: {
    authToken: string;
  };
}

export default function ConversationListTab() {
  const webViewRef = useRef<WebView>(null);

  const sendCommandToWebView = useCallback(
    (command: WebViewCommand | WebViewRefreshTokenCommand) => {
      const commandStr = JSON.stringify(command);
      const script = `window.handleCommand('${commandStr.replace(/'/g, "\\'")}');`;

      webViewRef.current?.injectJavaScript(script);
    },
    [],
  );

  const initializeAIAgent = useCallback(() => {
    const command: WebViewCommand = {
      type: "INITIALIZE_SDK",
      payload: {
        appId: SENDBIRD_APP_ID,
        aiAgentId: AI_AGENT_ID,
        language: "en",
      },
    };

    sendCommandToWebView(command);
  }, [sendCommandToWebView]);

  const requestSendbirdToken = useCallback(async () => {
    const response = await fetch(
      "https://your-api-endpoint.com/get-sendbird-token",
      {
        headers: { Authorization: "Bearer your-auth-token" },
        method: "GET",
      },
    );

    sendCommandToWebView({
      type: "TOKEN_REFRESHED",
      payload: {
        authToken: response.ok ? await response.text() : "",
      },
    });
  }, [sendCommandToWebView]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

        switch (message.type) {
          case "SDK_LOADED":
            initializeAIAgent();
            break;

          case "SDK_INITIALIZED":
            break;

          case "SDK_ERROR":
            break;

          case "TOKEN_REFRESH_REQUIRED":
            requestSendbirdToken();
            break;

          case "OPEN_CONVERSATION":
            if (message.payload.channelUrl) {
              router.push(
                `/ai-agent-messages?channelUrl=${encodeURIComponent(message.payload.channelUrl)}&status=${message.payload.status}`,
              );
            }
            break;

          default:
        }
      } catch (error) {
      }
    },
    [initializeAIAgent, requestSendbirdToken],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: ConversationListHTML, baseUrl: WEBVIEW_LOCAL_HOST }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        onError={(syntheticEvent) => {
        }}
        onHttpError={(syntheticEvent) => {
        }}
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
