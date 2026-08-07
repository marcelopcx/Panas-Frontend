import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteMe,
  deletePushToken,
  getMe,
  login as apiLogin,
  register as apiRegister,
  setApiTokenGetter,
  updateMe,
  uploadAvatar,
} from "@/services/api";
import type { Perfil, Usuario } from "@/types/api";

const TOKEN_KEY = "panas-auth-token";

type AuthContextValue = {
  token: string | null;
  user: Usuario | null;
  profile: Perfil | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    full_name: string;
    avatarUri?: string | null;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<Perfil | null>;
  updateProfile: (body: {
    full_name?: string;
    privacidad?: string;
    bio?: string;
  }) => Promise<Perfil>;
  uploadProfileAvatar: (uri: string) => Promise<Perfil>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApiTokenGetter(() => token);
  }, [token]);

  const refreshProfile = useCallback(async () => {
    try {
      const me = await getMe();
      setProfile(me);
      setUser({
        id_usuario: me.id_usuario,
        username: me.username,
        email: me.email,
        url_avatar: me.url_avatar,
      });
      return me;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!stored) return;
        if (!mounted) return;
        setToken(stored);
        setApiTokenGetter(() => stored);
        const me = await getMe();
        if (!mounted) return;
        setProfile(me);
        setUser({
          id_usuario: me.id_usuario,
          username: me.username,
          email: me.email,
          url_avatar: me.url_avatar,
        });
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        if (mounted) {
          setToken(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email.trim(), password);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setToken(data.token);
    setApiTokenGetter(() => data.token);
    setUser(data.user);
    const me = await getMe();
    setProfile(me);
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      full_name: string;
      avatarUri?: string | null;
    }) => {
      await apiRegister({
        email: input.email.trim(),
        password: input.password,
        full_name: input.full_name.trim(),
      });

      const data = await apiLogin(input.email.trim(), input.password);
      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      setToken(data.token);
      setApiTokenGetter(() => data.token);
      setUser(data.user);

      if (input.avatarUri) {
        const uploaded = await uploadAvatar(input.avatarUri);
        setProfile(uploaded.user);
        setUser({
          id_usuario: uploaded.user.id_usuario,
          username: uploaded.user.username,
          email: uploaded.user.email,
          url_avatar: uploaded.user.url_avatar,
        });
      } else {
        const me = await getMe();
        setProfile(me);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await deletePushToken();
    } catch {
      // ignore
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
    setApiTokenGetter(() => null);
  }, []);

  const updateProfile = useCallback(
    async (body: { full_name?: string; privacidad?: string; bio?: string }) => {
      const me = await updateMe(body);
      setProfile(me);
      setUser({
        id_usuario: me.id_usuario,
        username: me.username,
        email: me.email,
        url_avatar: me.url_avatar,
      });
      return me;
    },
    [],
  );

  const uploadProfileAvatar = useCallback(async (uri: string) => {
    const uploaded = await uploadAvatar(uri);
    setProfile(uploaded.user);
    setUser({
      id_usuario: uploaded.user.id_usuario,
      username: uploaded.user.username,
      email: uploaded.user.email,
      url_avatar: uploaded.user.url_avatar,
    });
    return uploaded.user;
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await deletePushToken();
    } catch {
      // ignore
    }
    await deleteMe();
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
    setApiTokenGetter(() => null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      profile,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      uploadProfileAvatar,
      deleteAccount,
    }),
    [
      token,
      user,
      profile,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      uploadProfileAvatar,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
