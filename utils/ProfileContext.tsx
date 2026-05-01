import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "parakeet-user-name";

interface ProfileContextType {
  userName: string;
  setUserName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  userName: "",
  setUserName: () => {},
});

function getInitialUserName() {
  if (typeof window === "undefined") {
    return "Zak";
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? stored : "Zak";
  } catch {
    return "Zak";
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>(getInitialUserName);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, userName);
    } catch {
      // Ignore storage errors on unsupported environments.
    }
  }, [userName]);

  return (
    <ProfileContext.Provider value={{ userName, setUserName }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
