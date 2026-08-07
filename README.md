# Panas (Frontend)

¡Bienvenido a **Panas**! Aplicación móvil de descubrimiento de amistades y chat en tiempo real. El desarrollo forma parte de una asignación práctica para el curso de **Desarrollo de Aplicaciones Móviles** en la **Universidad Rafael Urdaneta (URU)**.

Arquitectura desacoplada:

* Cliente en **React Native** con **Expo** (Expo Router, **SDK 54** — compatible con Expo Go de Play Store / App Store).
* API en **Rust** (Actix + PostgreSQL): **[Panas — Backend](https://github.com/marcelopcx/Panas-Backend)**.

Funcionalidades principales: registro/login, Meet (swipe), bandeja de solicitudes, chats con texto e imagen, notificaciones push (Expo Push) y perfil con privacidad.

---

## Guía de inicialización del proyecto

### Prerrequisitos

1. **Node.js** (LTS) y `npm`.
2. App **Expo Go** en el dispositivo (Android / iOS), o emulador configurado.
3. Backend corriendo (local o en la nube). Ver el [README del backend](https://github.com/marcelopcx/Panas-Backend).

### Pasos

1. **Navegá al directorio del frontend:**

   ```bash
   cd frontend
   ```

   *(Si clonaste solo este repo: `cd Panas-Frontend`.)*

2. **Instalá las dependencias:**

   ```bash
   npm install
   ```

3. **Configurá las variables de entorno:**

   ```bash
   cp .env.example .env
   ```

   **Desarrollo local** (misma Wi‑Fi que el backend):

   ```env
   EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:8080
   ```

   *Usá tu IP local (`ipconfig getifaddr en0` en Mac), **no** `localhost`, para que el teléfono alcance la API.*

   **Producción** (API en Render):

   ```env
   EXPO_PUBLIC_API_URL=https://panas-api.onrender.com
   ```

4. **Iniciá Expo** (limpiando caché):

   ```bash
   npx expo start -c
   ```

5. **Ejecutá en el dispositivo:**
   * Escaneá el QR con **Expo Go**.
   * O pulsá `a` / `i` para emulador Android / simulador iOS.

### APK de demostración

Hay un build preview generado con EAS (perfil `preview`) apuntando a la API de producción. Podés generar uno nuevo con:

```bash
npx eas-cli build --platform android --profile preview
```

---

## Arquitectura de carpetas

El frontend usa `src/` como raíz de la app (Expo Router):

* `src/app/` — Rutas (**Expo Router**): auth (`login`, `register`, `forgot-password`), tabs (`meet`, `inbox`, `chats`, `perfil`) y `messageScreen`.
* `src/components/` — Componentes visuales reutilizables (cards, chat, inputs, notificaciones, headers).
* `src/constants/` — Colores, URL de API (`EXPO_PUBLIC_API_URL`).
* `src/hooks/` — Custom hooks.
* `src/providers/` — Contextos (`AuthProvider`, tema, push notifications).
* `src/services/` — Cliente HTTP (`api.ts`) y registro de push (`push.ts`).
* `src/types/` — Tipados TypeScript alineados al backend.
* `src/utils/` — Formato de fechas, avatares, privacidad.
* `assets/` — Imágenes, fuentes e iconos.
* `eas.json` — Perfiles de build (preview APK / production).

---

## Pantallas y flujo

| Pantalla | Descripción |
|----------|-------------|
| Login / Registro | Auth por email; avatar opcional al registrarse |
| Meet | Deck de perfiles públicos; swipe izq = pasar, der = solicitar amistad |
| Bandeja | Solicitudes pendientes; aceptar / rechazar |
| Chats | Lista de conversaciones con no leídos |
| Mensajes | Texto e imagen; deep link desde notificaciones |
| Perfil | Nombre, foto, privacidad, tema, cerrar sesión / eliminar cuenta |

---

## Conexión con el backend

Repositorio de la API: **[Panas-Backend](https://github.com/marcelopcx/Panas-Backend)**

1. Levantá el backend (`make dev-up` + `cargo run`, o usá la URL de Render).
2. Poné la misma base en `EXPO_PUBLIC_API_URL`.
3. Tras login, la app registra el token de Expo Push en `POST /auth/me/push-token`.

Documentación de endpoints: ver `API.md` en el backend.
