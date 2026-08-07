import { API_URL } from "@/constants/api";

/** Convierte http(s)://… en ws(s)://… */
export function wsBaseUrl(): string {
  return API_URL.replace(/^http/i, "ws");
}

export function chatWsUrl(chatId: number, token: string): string {
  return `${wsBaseUrl()}/ws/chats/${chatId}?token=${encodeURIComponent(token)}`;
}

export function userWsUrl(token: string): string {
  return `${wsBaseUrl()}/ws/usuario?token=${encodeURIComponent(token)}`;
}

export type WsMensajePayload = {
  type: "mensaje";
  mensaje: {
    id_mensaje: number;
    id_chat: number;
    id_remitente: number;
    contenido?: string | null;
    url_imagen?: string | null;
    tipo: string;
    fecha_envio: string;
  };
};

export type WsChatUpdatePayload = {
  type: "chat_update";
  id_chat: number;
  last_message: string;
  updated_at: string;
  id_remitente: number;
};

export type WsServerEvent =
  | WsMensajePayload
  | WsChatUpdatePayload
  | { type: "pong" }
  | { type: "error"; error: string }
  | { type: string };

export function parseWsEvent(raw: string): WsServerEvent | null {
  try {
    return JSON.parse(raw) as WsServerEvent;
  } catch {
    return null;
  }
}

/** Abre un WebSocket con reconexión simple. */
export function connectWs(
  url: string,
  handlers: {
    onMessage: (data: WsServerEvent) => void;
    onOpen?: () => void;
    onClose?: () => void;
  },
): { close: () => void } {
  let closed = false;
  let socket: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let attempt = 0;

  const clearRetry = () => {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  const connect = () => {
    if (closed) return;
    socket = new WebSocket(url);

    socket.onopen = () => {
      attempt = 0;
      handlers.onOpen?.();
      try {
        socket?.send(JSON.stringify({ type: "ping" }));
      } catch {
        // ignore
      }
    };

    socket.onmessage = (event) => {
      const data = parseWsEvent(String(event.data));
      if (data) handlers.onMessage(data);
    };

    socket.onerror = () => {
      // onclose will handle retry
    };

    socket.onclose = () => {
      handlers.onClose?.();
      if (closed) return;
      const delay = Math.min(1000 * 2 ** attempt, 15000);
      attempt += 1;
      clearRetry();
      retryTimer = setTimeout(connect, delay);
    };
  };

  connect();

  return {
    close: () => {
      closed = true;
      clearRetry();
      try {
        socket?.close();
      } catch {
        // ignore
      }
      socket = null;
    },
  };
}
