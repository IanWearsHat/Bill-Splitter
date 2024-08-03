import { createContext } from "react";

interface AuthContextMap {
  user: string;
  setLoginUser: (value: string) => void;
}

export const AuthContext = createContext({} as AuthContextMap);
