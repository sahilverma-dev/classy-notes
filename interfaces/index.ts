import { AuthSessionResult } from "expo-auth-session";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import React, { ReactNode } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Timestamp;
  lastEdit?: Timestamp;
  isBookmarked?: boolean;
}

export interface AuthContextReturnType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  googleLogin: () => Promise<AuthSessionResult>;
}

export interface UserType {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface AuthProviderType {
  children: ReactNode;
}
