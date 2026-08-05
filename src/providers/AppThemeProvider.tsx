import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Appearance } from "react-native";

export type AppColorScheme = "light" | "dark";

type AppThemeContextValue = {
  colorScheme: AppColorScheme;
  setColorScheme: (scheme: AppColorScheme) => void;
  toggleColorScheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = "app-theme-color-scheme";

const getInitialColorScheme = async (): Promise<AppColorScheme> => {
  try {
    const stored = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // fallback to system preference
  }
  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
};

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<AppColorScheme>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    getInitialColorScheme().then((scheme) => {
      if (mounted) {
        setColorSchemeState(scheme);
        setIsReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setColorScheme = async (scheme: AppColorScheme) => {
    setColorSchemeState(scheme);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, scheme);
    } catch {
      // ignore storage errors
    }
  };

  const value = useMemo<AppThemeContextValue>(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme: () =>
        setColorSchemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [colorScheme],
  );

  if (!isReady) {
    return null;
  }

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    return {
      colorScheme: "light" as AppColorScheme,
      setColorScheme: () => undefined,
      toggleColorScheme: () => undefined,
    };
  }

  return context;
}
