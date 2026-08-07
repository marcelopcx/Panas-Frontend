export function formatMessageTime(iso: string): string {
  try {
    return new Date(iso)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .toLowerCase();
  } catch {
    return "";
  }
}

export function formatChatTime(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const sameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    if (sameDay) {
      return date
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .toLowerCase();
    }
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/mpc-uru/image/upload/panas/avatars/default.jpg";

export function avatarSource(url?: string | null) {
  if (url) return { uri: url };
  return { uri: DEFAULT_AVATAR_URL };
}

export const PRIVACY_UI_TO_API: Record<string, string> = {
  Público: "publico",
  Privado: "privado",
  "Solo amigos": "solo_amigos",
};

export const PRIVACY_API_TO_UI: Record<string, "Público" | "Privado" | "Solo amigos"> = {
  publico: "Público",
  privado: "Privado",
  solo_amigos: "Solo amigos",
};
