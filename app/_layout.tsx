import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/libs/useColorScheme";
import { UserProvider } from "@/libs/user";
import {
  createExpoClipboardService,
  createExpoFileService,
  createExpoMediaService,
  createExpoNotificationService,
  createExpoPlayerService,
  createExpoRecorderService,
  SendbirdUIKitContainer,
} from "@sendbird/uikit-react-native";

import * as ExpoClipboard from "expo-clipboard";
import * as ExpoDocumentPicker from "expo-document-picker";
import * as ExpoFS from "expo-file-system";
import * as ExpoImagePicker from "expo-image-picker";
import * as ExpoMediaLibrary from "expo-media-library";
import * as ExpoNotifications from "expo-notifications";
import * as ExpoAV from "expo-av";
import * as ExpoVideoThumbnail from "expo-video-thumbnails";
import * as ExpoImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SENDBIRD_APP_ID } from "@/libs/constants";

const expoPlatformServices = {
  clipboard: createExpoClipboardService(ExpoClipboard),
  notification: createExpoNotificationService(ExpoNotifications),
  file: createExpoFileService({
    fsModule: ExpoFS,
    imagePickerModule: ExpoImagePicker,
    mediaLibraryModule: ExpoMediaLibrary,
    documentPickerModule: ExpoDocumentPicker,
  }),
  media: createExpoMediaService({
    avModule: ExpoAV,
    thumbnailModule: ExpoVideoThumbnail,
    imageManipulator: ExpoImageManipulator,
    fsModule: ExpoFS,
  }),
  player: createExpoPlayerService({
    avModule: ExpoAV,
  }),
  recorder: createExpoRecorderService({
    avModule: ExpoAV,
  }),
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SendbirdUIKitContainer
      appId={SENDBIRD_APP_ID}
      platformServices={expoPlatformServices}
      chatOptions={{
        localCacheStorage: AsyncStorage,
      }}
    >
      <UserProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="lobby" />
            <Stack.Screen
              name="notification-messages"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="ai-agent-messages"
              options={{ presentation: "modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </UserProvider>
    </SendbirdUIKitContainer>
  );
}
