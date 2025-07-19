import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import {
  createGroupChannelListFragment,
  GroupChannelListContexts,
  useSendbirdChat,
} from "@sendbird/uikit-react-native";
import { Icon, useHeaderStyle } from "@sendbird/uikit-react-native-foundation";

const GroupChannelListFragment = createGroupChannelListFragment({
  Header: () => {
    const fragment = useContext(GroupChannelListContexts.Fragment);
    const typeSelector = useContext(GroupChannelListContexts.TypeSelector);
    const { HeaderComponent } = useHeaderStyle();

    return (
      <HeaderComponent
        title={fragment.headerTitle}
        clearStatusBarTopInset
        right={<Icon icon={"create"} />}
        onPressRight={typeSelector.show}
      />
    );
  },
});

export default function NotificationsTab() {
  const { sdk } = useSendbirdChat();
  const handleChannelPress = (channel: any) => {
    router.push(`/notification-messages?channelUrl=${channel.url}`);
  };

  return (
    <View style={styles.container}>
      <GroupChannelListFragment
        onPressChannel={handleChannelPress}
        skipTypeSelection
        onPressCreateChannel={() => {
          sdk.groupChannel
            .createChannel({ isDistinct: true, name: "New Channel" })
            .then((channel) => {
              handleChannelPress(channel);
            })
            .catch((error) => {
            });
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
});
