import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import React, { useCallback, useRef } from "react";
import {
  AI_AGENT_ID,
  SENDBIRD_APP_ID,
  WEBVIEW_LOCAL_HOST,
} from "@/libs/constants";
import { ConversationHTML } from "@/libs/messages/ConversationPage/html";
import { router } from "expo-router";

interface WebViewMessage {
  type: "WEBVIEW_LOADED" | "TOKEN_REFRESH_REQUIRED" | "CLOSE_CONVERSATION";
  payload?: any;
}

interface WebViewCommand {
  type: "START_CONVERSATION";
  payload: {
    loadParams: {
      channelUrl: string;
      status: "open" | "closed";
    };
    initParams: {
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
  };
}

interface WebViewRefreshTokenCommand {
  type: "TOKEN_REFRESHED";
  payload: {
    authToken: string;
  };
}

interface Props {
  channelUrl: string;
  status: "open" | "closed";
}
export function ConversationPage({ channelUrl, status }: Props) {
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
      type: "START_CONVERSATION",
      payload: {
        loadParams: {
          channelUrl,
          status,
        },
        initParams: {
          appId: SENDBIRD_APP_ID,
          aiAgentId: AI_AGENT_ID,
          language: "en",
        },
      },
    };

    sendCommandToWebView(command);
  }, [channelUrl, sendCommandToWebView, status]);

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
          case "WEBVIEW_LOADED":
            initializeAIAgent();
            break;

          case "CLOSE_CONVERSATION":
            router.back();
            break;

          case "TOKEN_REFRESH_REQUIRED":
            requestSendbirdToken();
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
        source={{ html: ConversationHTML, baseUrl: WEBVIEW_LOCAL_HOST }}
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
