import React from "react";
import { ConversationPage } from "@/libs/messages/ConversationPage";
import { useLocalSearchParams } from "expo-router";

export default function AIAgentMessagesScreen() {
  const { channelUrl, status } = useLocalSearchParams<{
    channelUrl: string;
    status: "open" | "closed";
  }>();

  return <ConversationPage channelUrl={channelUrl} status={status} />;
}
