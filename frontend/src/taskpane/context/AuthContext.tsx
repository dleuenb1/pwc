import React, { createContext, useContext, useState } from "react";
import { AUTH_CACHE_DURATION_MS, AUTH_CACHE_KEY, LICENSE_KEY_STORAGE_KEY } from "../constants";
import { ValidationResult } from "../types/common.types";

interface AuthContextProps {
  authStatus: ValidationResult<boolean>
  checkAuth: () => Promise<void>;
  setLicenseKey: (key: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<ValidationResult<boolean>>(null);

  const checkAuth = async () => {
    const licenseKey = localStorage.getItem(LICENSE_KEY_STORAGE_KEY);
    if (!licenseKey) {
      setAuthStatus({status: { type: "error", message: "Brak klucza licencyjnego." }, result: false});
      return;
    }

    const lastCheck = localStorage.getItem(AUTH_CACHE_KEY);
    const now = Date.now();
    if (lastCheck && now - parseInt(lastCheck) < AUTH_CACHE_DURATION_MS) {
      setAuthStatus({status: { type: "info", message: "✔️ Autentykacja z pamięci podręcznej." }, result: true });
      return;
    }

    try {
      const response = await fetch("https://your-api.com/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });

      const result = await response.json();
      const ok = result?.authenticated ?? false;

      if (ok) {
        localStorage.setItem(AUTH_CACHE_KEY, now.toString());
        setAuthStatus({status: { type: "info", message: "✔️ Klucz poprawny." }, result: true });
      } else {
        setAuthStatus({status: { type: "error", message: "❌ Nieprawidłowy klucz licencyjny." }, result: false});
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setAuthStatus({status: { type: "error", message: "❌ Błąd połączenia z serwerem." }, result: false});
    }
  };

  const setLicenseKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch("https://your-api.com/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key }),
      });

      const result = await response.json();
      const ok = result?.authenticated ?? false;

      if (ok) {
        localStorage.setItem(LICENSE_KEY_STORAGE_KEY, key);
        localStorage.setItem(AUTH_CACHE_KEY, Date.now().toString());
        setAuthStatus({status: { type: "info", message: "✔️ Klucz zapisany i poprawny." }, result: false});
        return true;
      } else {
        setAuthStatus({status: { type: "error", message: "❌ Klucz niepoprawny." }, result: false});
        return false;
      }
    } catch (err) {
      console.error("License key validation failed:", err);
      setAuthStatus({status: { type: "error", message: "❌ Błąd połączenia z serwerem." }, result: false});
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authStatus, checkAuth, setLicenseKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
