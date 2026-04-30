"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const POLL_MS = 30_000;

interface NotificationsState {
  unreadCount: number;
  refresh: () => Promise<void>;
  markOne: (id: number) => Promise<void>;
  markAll: () => Promise<void>;
}

const Ctx = createContext<NotificationsState | null>(null);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const r = await api.notificationsUnreadCount();
      setUnreadCount(r.unread_count);
    } catch {
      // ignore — will retry on next poll
    }
  }, [user]);

  const markOne = useCallback(async (id: number) => {
    await api.markNotificationRead(id);
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAll = useCallback(async () => {
    await api.markAllNotificationsRead();
    setUnreadCount(0);
  }, []);

  // Initial fetch + when user changes (login/logout)
  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Poll while logged in
  useEffect(() => {
    if (!user) return;
    const t = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(t);
  }, [user, refresh]);

  return (
    <Ctx.Provider value={{ unreadCount, refresh, markOne, markAll }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications(): NotificationsState {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
