import React, { createContext, ReactNode, useContext, useState } from "react";
import { useConnection } from "@sendbird/uikit-react-native";

interface User {
  userId: string;
  nickname: string;
  profileUrl?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userId: string, nickname: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { connect, disconnect } = useConnection();

  const login = async (userId: string, nickname: string) => {
    setIsLoading(true);
    try {
      const sendbirdUser = await connect(userId, { nickname });
      setUser({
        userId: sendbirdUser.userId,
        nickname: nickname || sendbirdUser.nickname,
        profileUrl: sendbirdUser.profileUrl,
      });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    disconnect();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
