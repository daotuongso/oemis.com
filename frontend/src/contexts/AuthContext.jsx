import { createContext, useContext, useState } from "react";
import { api } from "../api/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function extractRoles(token) {
  if (!token) return [];
  try {
    const d = jwtDecode(token);
    /* Role claim có thể là chuỗi hoặc mảng */
    const raw =
      d["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      d.role ||
      [];
    return Array.isArray(raw) ? raw : [raw];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [roles, setRoles] = useState(extractRoles(token));

  async function login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    const tok = res.data.token;
    if (!tok) throw new Error("Không nhận được token");

    localStorage.setItem("token", tok);
    setToken(tok);
    setRoles(extractRoles(tok));
  }

  function logout() {
    setToken(null);
    setRoles([]);
    localStorage.clear();
  }

  return (
    <AuthContext.Provider value={{ token, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
