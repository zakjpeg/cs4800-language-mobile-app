import React, { createContext, useContext, useState } from "react";

interface ProfileContextType {
  userName: string;
  setUserName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  userName: "",
  setUserName: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("Zak");
  return (
    <ProfileContext.Provider value={{ userName, setUserName }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
