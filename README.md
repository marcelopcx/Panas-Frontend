# Panas (Frontend)

¡Bienvenido a **Panas**! Aplicación móvil desarrollada para el curso de **Desarrollo de Aplicaciones Móviles** en la **Universidad Rafael Urdaneta (URU)**.

Arquitectura desacoplada:

* **React Native** con **Expo** (Expo Router, SDK 54 — compatible con Expo Go de Play Store / App Store)
* Backend en Rust (Actix + PostgreSQL): **[Panas — Backend](https://github.com/marcelopcx/Panas-Backend)**

---

## Guía de inicialización

### Prerrequisitos

1. **Node.js** (LTS) y `npm`
2. App **Expo Go** en el dispositivo (Android / iOS)

### Pasos

1. **Navegá al frontend:**
   ```bash
   cd frontend
   ```

2. **Instalá dependencias:**
   ```bash
   npm install
   ```

3. **Configurá `.env`:**
   ```bash
   cp .env.example .env
   ```
   ```env
   EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:8080
   ```
   *Usá tu IP local (no `localhost`) para que el dispositivo alcance el backend.*

4. **Iniciá Expo:**
   ```bash
   npx expo start -c
   ```

5. Escaneá el QR con **Expo Go**, o pulsá `a` / `i` para emulador.

---

## Arquitectura de carpetas

* `src/app/` — Rutas con **Expo Router**
* `src/components/` — Componentes visuales reutilizables
* `src/constants/` — Configuración global (URL de API, etc.)
* `src/hooks/` — Custom hooks
* `src/providers/` — Context providers
* `src/services/` — Comunicación con el backend
* `src/types/` — Tipados TypeScript
* `src/utils/` — Utilidades
