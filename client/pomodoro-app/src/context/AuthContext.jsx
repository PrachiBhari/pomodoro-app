import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../lib/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthed = !!localStorage.getItem("token");

  const login = (userObj) => setUser(userObj);
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  // keep `user` in localStorage if changed (optional)
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
