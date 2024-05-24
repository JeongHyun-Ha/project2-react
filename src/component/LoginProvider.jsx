import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [nickName, setNickName] = useState("");
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    login(token);
  }, []);

  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  function hasAccess(param) {
    return id == param;
  }

  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setNickName(payload.nickName);
  }

  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setId("");
    setNickName("");
  }

  return (
    <LoginContext.Provider
      value={{
        id,
        nickName,
        login,
        logout,
        isLoggedIn,
        hasAccess,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
