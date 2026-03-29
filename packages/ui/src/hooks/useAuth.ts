import { useState, useCallback } from "react";

const STORAGE_KEY = "showroom-admin-token";

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(
    () => sessionStorage.getItem(STORAGE_KEY)
  );
  const [error, setError] = useState("");

  const login = useCallback(async (inputToken: string) => {
    setError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${inputToken}` },
    });
    if (res.ok) {
      sessionStorage.setItem(STORAGE_KEY, inputToken);
      setTokenState(inputToken);
      return true;
    }
    setError("Invalid token");
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setTokenState(null);
  }, []);

  return { token, isAuthenticated: !!token, login, logout, error };
}

export function getAuthHeaders(): HeadersInit {
  const token = sessionStorage.getItem(STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
