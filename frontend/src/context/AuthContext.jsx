import { createContext } from "react";

export const authDataContext = createContext();
const value = {
  serverUrl:
    import.meta.env.VITE_SERVER_URL !== undefined
      ? import.meta.env.VITE_SERVER_URL
      : import.meta.env.DEV
      ? "http://localhost:8000"
      : "",
};

export default function AuthContext({ children }) {
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
}
