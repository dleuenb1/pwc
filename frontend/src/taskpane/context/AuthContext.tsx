import React, {createContext, useContext, useEffect, useState} from "react";
import {API_URL, APP_TEST_MODE, AUTH_CACHE_DURATION_MS, AUTH_CACHE_KEY, LICENSE_KEY_STORAGE_KEY} from "../constants";
import {ValidationResult} from "../types/common.types";

interface AuthContextProps {
    authStatus: ValidationResult<boolean>
    checkAuth: () => Promise<void>;
    setLicenseKey: (key: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const authCheckRequest = async (licenseKey: string) => {
    if (APP_TEST_MODE) {
        return true;
    }
    const response = await fetch(`${API_URL}/auth/check`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({licenseKey}),
    });

    const result = await response.json();
    return result?.authenticated ?? false;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [authStatus, setAuthStatus] = useState<ValidationResult<boolean>>();

    useEffect(() => {
        if (APP_TEST_MODE) {
            Promise.all([OfficeRuntime.storage.removeItem(LICENSE_KEY_STORAGE_KEY),
                OfficeRuntime.storage.removeItem(AUTH_CACHE_KEY)]).finally(() => {
                    setAuthStatus({status: {type: "info", message: "✔️ Test mode - wpisz jakikolwiek klucz"}, result: false});
                });
        } else {
            initAuth();
        }
    }, []);

    const initAuth = async () => {
        const licenseKey = await OfficeRuntime.storage.getItem(LICENSE_KEY_STORAGE_KEY);
        if (licenseKey) {
            const responseOk = await authCheckRequest(licenseKey);
            if (responseOk) {
                setAuthStatus({status: {type: "info", message: "✔️ Klucz poprawny."}, result: true});
            } else {
                setAuthStatus({status: {type: "error", message: "❌ Nieprawidłowy klucz licencyjny."}, result: false});
            }
        }
    };
        

    const checkAuth = async () => {
        const licenseKey = await OfficeRuntime.storage.getItem(LICENSE_KEY_STORAGE_KEY);
        if (!licenseKey) {
            setAuthStatus({status: {type: "error", message: "Brak klucza licencyjnego."}, result: false});
            return;
        }

        const lastCheck = await OfficeRuntime.storage.getItem(AUTH_CACHE_KEY);
        const now = Date.now();
        if (lastCheck && now - parseInt(lastCheck) < AUTH_CACHE_DURATION_MS) {
            setAuthStatus({status: {type: "info", message: "✔️ Autentykacja z pamięci podręcznej."}, result: true});
            return;
        }

        try {
            const responseOk = await authCheckRequest(licenseKey);
            if (responseOk) {
                await OfficeRuntime.storage.setItem(AUTH_CACHE_KEY, now.toString());
                setAuthStatus({status: {type: "info", message: "✔️ Klucz poprawny."}, result: true});
            } else {
                setAuthStatus({status: {type: "error", message: "❌ Nieprawidłowy klucz licencyjny."}, result: false});
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            setAuthStatus({status: {type: "error", message: "❌ Błąd połączenia z serwerem."}, result: false});
        }
    };

    const setLicenseKey = async (key: string): Promise<boolean> => {
        try {
            const responseOk = await authCheckRequest(key);

            if (responseOk) {
                await OfficeRuntime.storage.setItem(LICENSE_KEY_STORAGE_KEY, key);
                await OfficeRuntime.storage.setItem(AUTH_CACHE_KEY, Date.now().toString());
                setAuthStatus({status: {type: "info", message: "✔️ Klucz zapisany i poprawny."}, result: true});
                return true;
            } else {
                setAuthStatus({status: {type: "error", message: "❌ Klucz niepoprawny."}, result: false});
                return false;
            }
        } catch (err) {
            console.error("License key validation failed:", err);
            setAuthStatus({status: {type: "error", message: "❌ Błąd połączenia z serwerem."}, result: false});
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{authStatus, checkAuth, setLicenseKey}}>
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
