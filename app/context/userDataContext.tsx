"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

type User = {
  name: string;
  email: string;
};

type userDataType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserDataContext = createContext<userDataType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useMyContext must be used within a UserProvider");
  }
  return context;
}
