import { createContext } from "react";

interface AuthContextMap {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextMap);
