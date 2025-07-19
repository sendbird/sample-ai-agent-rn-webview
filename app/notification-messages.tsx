import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from "@sendbird/uikit-react-native";
import { useGroupChannel } from "@sendbird/uikit-chat-hooks";
import { GroupChannelContexts } from "@sendbird/uikit-react-native/src/domain/groupChannel/module/moduleContext";
import {
  Box,
  Header,
  Icon,
  useHeaderStyle,
} from "@sendbird/uikit-react-native-foundation";
import ChannelCover from "@sendbird/uikit-react-native/src/components/ChannelCover";

const GroupChannelFragment = createGroupChannelFragment({
  Header: ({ onPressHeaderLeft, onPressHeaderRight, shouldHideRight }) => {
    const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment);
    const { HeaderComponent } = useHeaderStyle();

    const isHidden = shouldHideRight();

    return (
      <HeaderComponent
        clearTitleMargin
        clearStatusBarTopInset
        title={
          <Box style={styles.titleContainer}>
            <ChannelCover
              channel={channel}
              size={34}
              containerStyle={styles.avatarGroup}
            />
            <Box flexShrink={1} alignItems={"flex-start"}>
              <Header.Title h2>{headerTitle}</Header.Title>
            </Box>
          </Box>
        }
        left={<Icon icon={"arrow-left"} />}
        onPressLeft={onPressHeaderLeft}
        right={isHidden ? null : <Icon icon={"info"} />}
        onPressRight={isHidden ? undefined : onPressHeaderRight}
      />
    );
  },
});

export default function NotificationMessagesScreen() {
  const { channelUrl } = useLocalSearchParams<{ channelUrl: string }>();
  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, channelUrl);

  if (!channel) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <GroupChannelFragment
        channel={channel}
        onPressHeaderRight={() => {}}
        onPressHeaderLeft={() => {
          router.back();
        }}
        onChannelDeleted={() => {
          router.back();
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
  loading: {
    flex: 1,
    backgroundColor: "white",
  },
  titleContainer: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  avatarGroup: {
    marginEnd: 8,
  },
});
