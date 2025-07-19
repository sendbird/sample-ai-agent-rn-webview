import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';

const AI_MESSAGES_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Messages</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        .title {
            color: #742DDD;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .message-item {
            padding: 16px;
            margin: 12px 0;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #742DDD;
        }
        .message-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .message-content {
            color: #666;
            line-height: 1.5;
        }
        .cta-button {
            display: block;
            width: 100%;
            padding: 16px;
            background: #742DDD;
            color: white;
            text-decoration: none;
            text-align: center;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 24px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">AI Agent Messages</div>
            <div class="subtitle">Smart conversations with AI assistance</div>
        </div>
        
        <div class="message-item">
            <div class="message-title">Welcome to AI Chat</div>
            <div class="message-content">
                Experience intelligent conversations with our AI agent. Get instant responses, smart suggestions, and personalized assistance.
            </div>
        </div>
        
        <div class="message-item">
            <div class="message-title">Smart Features</div>
            <div class="message-content">
                • Natural language understanding<br>
                • Context-aware responses<br>
                • Multi-language support<br>
                • Real-time assistance
            </div>
        </div>
        
        <div class="message-item">
            <div class="message-title">Getting Started</div>
            <div class="message-content">
                Tap the button below to start your conversation with the AI agent. Ask questions, request help, or just have a friendly chat!
            </div>
        </div>
        
        <a href="#" class="cta-button" onclick="window.ReactNativeWebView.postMessage('startChat')">
            Start AI Conversation
        </a>
    </div>
</body>
</html>
`;

export default function MessagesTab() {
  const handleMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (message === 'startChat') {
      router.push('/ai-agent-messages');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: AI_MESSAGES_HTML }}
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
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
});