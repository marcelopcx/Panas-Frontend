import { API_URL } from "@/constants/api";
import type {
  ChatListItem,
  DescubrirItem,
  LoginResponse,
  Mensaje,
  Notificacion,
  Perfil,
  RegisterResponse,
  SolicitudPendiente,
  Usuario,
} from "@/types/api";

type TokenGetter = () => string | null;

let getToken: TokenGetter = () => null;

export function setApiTokenGetter(getter: TokenGetter) {
  getToken = getter;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
  } catch {
    // ignore
  }
  return `Error ${response.status}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status);
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function imageFormData(uri: string, filename = "photo.jpg") {
  const form = new FormData();
  const ext = uri.split(".").pop()?.toLowerCase();
  const type =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

  form.append("file", {
    uri,
    name: filename,
    type,
  } as unknown as Blob);

  return form;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<string> {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) throw new ApiError("Health check falló", response.status);
  return response.text();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return request<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );
}

export async function register(input: {
  email: string;
  password: string;
  full_name: string;
  url_avatar?: string | null;
}): Promise<RegisterResponse> {
  return request<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    false,
  );
}

export async function forgotPassword(email: string): Promise<void> {
  await request(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
    false,
  );
}

export async function getMe(): Promise<Perfil> {
  return request<Perfil>("/auth/me");
}

export async function updateMe(body: {
  full_name?: string;
  nombre?: string;
  bio?: string;
  privacidad?: string;
  url_avatar?: string;
  password?: string;
}): Promise<Perfil> {
  return request<Perfil>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteMe(): Promise<void> {
  await request<void>("/auth/me", { method: "DELETE" });
}

export async function uploadAvatar(uri: string): Promise<{
  secure_url: string;
  user: Perfil;
}> {
  return request("/auth/me/avatar", {
    method: "POST",
    body: imageFormData(uri, "avatar.jpg"),
  });
}

export async function registerPushToken(token: string): Promise<void> {
  await request("/auth/me/push-token", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function deletePushToken(): Promise<void> {
  await request("/auth/me/push-token", { method: "DELETE" });
}

// ─── Descubrir / Meet ─────────────────────────────────────────────────────────

export async function listDescubrir(limit = 20): Promise<DescubrirItem[]> {
  return request<DescubrirItem[]>(`/descubrir?limit=${limit}`);
}

export async function pasarDescubrir(id_usuario: number): Promise<void> {
  await request("/descubrir/pasar", {
    method: "POST",
    body: JSON.stringify({ id_usuario }),
  });
}

export async function enviarSolicitud(id_usuario: number): Promise<unknown> {
  return request("/amistades", {
    method: "POST",
    body: JSON.stringify({ id_usuario }),
  });
}

// ─── Amistades / Bandeja ──────────────────────────────────────────────────────

export async function listPendientes(): Promise<SolicitudPendiente[]> {
  return request<SolicitudPendiente[]>("/amistades/pendientes");
}

export async function aceptarSolicitud(
  id: number,
): Promise<{ id_chat?: number }> {
  return request(`/amistades/${id}/aceptar`, { method: "POST" });
}

export async function rechazarSolicitud(id: number): Promise<unknown> {
  return request(`/amistades/${id}/rechazar`, { method: "POST" });
}

// ─── Chats ────────────────────────────────────────────────────────────────────

export async function listChats(): Promise<ChatListItem[]> {
  return request<ChatListItem[]>("/chats");
}

export async function listMensajes(
  idChat: number,
  page = 1,
  limit = 50,
): Promise<Mensaje[]> {
  return request<Mensaje[]>(
    `/chats/${idChat}/mensajes?page=${page}&limit=${limit}`,
  );
}

export async function enviarMensaje(
  idChat: number,
  text: string,
): Promise<Mensaje> {
  return request<Mensaje>(`/chats/${idChat}/mensajes`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function enviarImagenChat(
  idChat: number,
  uri: string,
): Promise<{ secure_url: string; mensaje: Mensaje }> {
  return request(`/chats/${idChat}/imagen`, {
    method: "POST",
    body: imageFormData(uri, "chat.jpg"),
  });
}

export async function marcarChatLeido(idChat: number): Promise<void> {
  await request(`/chats/${idChat}/leer`, { method: "POST" });
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

export async function listNotificaciones(
  soloNoLeidas = false,
): Promise<{ items: Notificacion[]; unread: number }> {
  const q = soloNoLeidas ? "?solo_no_leidas=true" : "";
  return request(`/notificaciones${q}`);
}

export async function marcarNotificacionLeida(id: number): Promise<void> {
  await request(`/notificaciones/${id}/leer`, { method: "PATCH" });
}

export async function eliminarNotificacion(id: number): Promise<void> {
  await request(`/notificaciones/${id}`, { method: "DELETE" });
}

export async function marcarTodasNotificacionesLeidas(): Promise<void> {
  await request("/notificaciones/leer-todas", { method: "POST" });
}

export type { Usuario, Perfil };
