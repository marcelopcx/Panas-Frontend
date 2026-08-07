import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { registerPushToken } from "@/services/api";
import { registerForPushNotificationsAsync } from "@/services/push";

type PushData = {
  tipo?: string;
  id_referencia?: number | null;
};

function navigateFromPush(
  router: ReturnType<typeof useRouter>,
  data: PushData,
) {
  const tipo = data.tipo;
  const ref = data.id_referencia;

  if (tipo === "mensaje" && typeof ref === "number") {
    router.push({
      pathname: "/messageScreen",
      params: { id: String(ref) },
    });
    return;
  }

  if (tipo === "solicitud_amistad") {
    router.push("/(tabs)/inbox");
    return;
  }

  if (tipo === "solicitud_aceptada") {
    if (typeof ref === "number") {
      router.push({
        pathname: "/messageScreen",
        params: { id: String(ref) },
      });
    } else {
      router.push("/(tabs)/chats");
    }
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription | null>(
    null,
  );

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    let cancelled = false;

    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (cancelled || !token) return;

      try {
        await registerPushToken(token);
      } catch (error) {
        console.warn("No se pudo registrar push token", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loading]);

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = (response.notification.request.content.data ??
          {}) as PushData;
        navigateFromPush(router, data);
      });

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = (response.notification.request.content.data ??
        {}) as PushData;
      navigateFromPush(router, data);
    });

    return () => {
      responseListener.current?.remove();
    };
  }, [router]);

  return <>{children}</>;
}
