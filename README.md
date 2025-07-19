# RN Messenger WebView

A React Native Expo demo application that integrates Sendbird UIKit with WebView to showcase AI Agent capabilities.

## 📱 Features

- **Sendbird UIKit Integration**: Native chat functionality using Sendbird UIKit React Native
- **AI Agent WebView Integration**: Seamless integration of Sendbird AI Agent Web SDK
- **Dual Tab Interface**: Notifications (native) and AI Messages (WebView)
- **Real-time Communication**: Bidirectional communication between React Native and WebView

## 🛠 Installation

```bash
# Install dependencies
npm install
```

## 🚀 How to Run

```bash
# Start the Expo development server
npx expo start

# Run on iOS
# Press 'i' in the terminal or scan QR code with Expo Go app

# Run on Android  
# Press 'a' in the terminal or scan QR code with Expo Go app

# Run on web
# Press 'w' in the terminal
```

## 📁 Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation
├── login.tsx           # Login screen
├── lobby.tsx           # Main tab navigation
├── notification-messages.tsx  # Native chat messages
└── ai-agent-messages.tsx     # AI Agent conversation

libs/
├── messages/
│   ├── ConversationListTab/  # AI Agent conversation list
│   │   ├── index.tsx        # React Native component
│   │   └── html.tsx         # WebView HTML template
│   └── ConversationPage/     # AI Agent conversation view
│       ├── index.tsx        # React Native component
│       └── html.tsx         # WebView HTML template
├── notifications/      # Native notifications
├── user/              # User context management
└── constants.ts       # App configuration
```

## 🔧 Messages Directory Integration

The `libs/messages` directory contains the WebView integration for Sendbird AI Agent Web SDK:

### WebView Components

1. **ConversationListTab**: Displays the list of AI Agent conversations
   - Loads AI Agent Web SDK via CDN
   - Implements custom React components using `customMainComponent`
   - Handles conversation selection and navigation

2. **ConversationPage**: Shows individual AI Agent conversation
   - Receives conversation parameters from React Native
   - Manages conversation state and messages
   - Handles back navigation to list view

### Communication Protocol

The integration uses a bidirectional message passing system:

**WebView → React Native**:
- `SDK_LOADED`: SDK successfully loaded
- `SDK_INITIALIZED`: SDK initialization complete
- `SDK_ERROR`: Error occurred
- `OPEN_CONVERSATION`: User selected a conversation
- `CLOSE_CONVERSATION`: User wants to go back
- `TOKEN_REFRESH_REQUIRED`: Auth token needs refresh

**React Native → WebView**:
- `INITIALIZE_SDK`: Initialize with app credentials
- `START_CONVERSATION`: Open specific conversation
- `TOKEN_REFRESHED`: Provide new auth token

### Implementation Example

```typescript
// React Native side
const handleMessage = (event) => {
  const message = JSON.parse(event.nativeEvent.data);
  switch (message.type) {
    case 'SDK_LOADED':
      initializeAIAgent();
      break;
    // ... handle other messages
  }
};

// WebView side
function sendMessageToRN(type, payload = {}) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type,
    payload
  }));
}
```

## 🔑 Configuration

Update the following constants in `libs/constants.ts`:

```typescript
export const SENDBIRD_APP_ID = "your-app-id";
export const AI_AGENT_ID = "your-agent-id";
```

## 📦 Dependencies

- React Native & Expo
- @sendbird/chat & @sendbird/uikit-react-native
- react-native-webview
- @react-navigation/material-top-tabs
- expo-router
