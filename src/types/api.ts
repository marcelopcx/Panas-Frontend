export type Usuario = {
  id_usuario: number;
  username: string;
  email: string;
  url_avatar?: string | null;
};

export type Perfil = {
  id_usuario: number;
  username: string;
  email: string;
  url_avatar?: string | null;
  name: string;
  fecha_registro: string;
  nombre?: string | null;
  apellido?: string | null;
  bio?: string | null;
  privacidad: string;
};

export type DescubrirItem = {
  id_usuario: number;
  name: string;
  url_avatar?: string | null;
  bio?: string | null;
  username: string;
};

export type SolicitudPendiente = {
  id_solicitud: number;
  id_remitente: number;
  name: string;
  username: string;
  url_avatar?: string | null;
  message: string;
  fecha_creacion: string;
};

export type ChatListItem = {
  id_chat: number;
  name: string;
  url_avatar?: string | null;
  last_message: string;
  updated_at: string;
  unread: number;
  otro_usuario: {
    id_usuario: number;
    username: string;
    name: string;
    url_avatar?: string | null;
  };
  fecha_creacion: string;
};

export type Mensaje = {
  id_mensaje: number;
  id_chat: number;
  id_remitente: number;
  contenido?: string | null;
  url_imagen?: string | null;
  tipo: string;
  fecha_envio: string;
};

export type Notificacion = {
  id_notificacion: number;
  id_usuario: number;
  tipo: string;
  mensaje: string;
  leida: boolean;
  id_referencia?: number | null;
  fecha_creacion: string;
};

export type LoginResponse = {
  token: string;
  user: Usuario;
};

export type RegisterResponse = {
  user: Usuario;
};
