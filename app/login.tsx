import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useUser } from "@/libs/user";

export default function LoginScreen() {
  const [userId, setUserId] = useState("test");
  const [nickname, setNickname] = useState("tester");
  const { login, isLoading } = useUser();

  const handleLogin = async () => {
    if (!userId.trim()) {
      Alert.alert("Error", "Please enter a User ID");
      return;
    }

    try {
      await login(userId.trim(), nickname.trim() || userId.trim());
      router.replace("/lobby");
    } catch (error) {
      Alert.alert("Login Failed", "Please try again");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sendbird Messenger</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>User ID *</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Enter your user ID"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Enter your nickname (optional)"
          autoCapitalize="words"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Connect</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 48,
    color: "#742DDD",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#742DDD",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
