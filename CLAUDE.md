@AGENTS.md

# Lunchy — lineamientos del proyecto

App móvil (iOS, Android y web) de **Brams Tech** para planificar alimentación y entrenamiento: recetas con cálculo nutricional, menú semanal con avance diario, rutinas, comunidad (compartir con conexiones) y propuestas al catálogo. Expo SDK 58 + Expo Router (typed routes), React 19, TypeScript estricto, TanStack Query y zod. Interfaz y comentarios en **español**.

**Fase actual: front con repositorios simulados.** La API REST llegará después y debe poder conectarse sin tocar pantallas: sólo se reemplaza `createMockRepositories()` por `createHttpRepositories()` en [src/app/_layout.tsx](src/app/_layout.tsx).

Prioridades en cada cambio, en este orden: **seguridad → corrección → accesibilidad/diseño → simplicidad**.

## Arquitectura

```
src/
  app/        Rutas (Expo Router). Pantallas delgadas: componen features, sin lógica de negocio.
  core/       Dominio y datos. No importa de features/ ni de shared/ui.
    domain/       Tipos, errores (AppError) y reglas puras (nutrición, límites).
    repositories/ contracts.ts (interfaces) + mock/ (implementación simulada).
    storage/      Persistencia local (tokens, preferencias).
    queryKeys.ts  Claves de caché centralizadas.
  features/   Un módulo por funcionalidad: components/, hooks.ts, schemas.ts, tipos propios.
  shared/     Reutilizable y sin dominio: ui/ (design system), theme/, hooks/, lib/.
```

Dependencias permitidas: `app → features → core/shared`. Una feature no importa componentes internos de otra salvo hooks/contexts públicos (p. ej. `features/auth/AuthContext`).

### Principios SOLID aplicados (mantenerlos)

- **S — Responsabilidad única:** pantallas componen; hooks (`features/*/hooks.ts`) orquestan React Query; repositorios acceden a datos; `domain/` calcula. Estado y acciones de auth van en contextos separados.
- **O — Abierto/cerrado:** extender con datos, no con `if`s. Ejemplos: registro de íconos en `shared/ui/Icon.tsx`, secciones del menú lateral en `features/menu/sections.ts`, páginas informativas en `features/info/content.ts` con un renderizador por tipo.
- **L — Sustitución:** toda implementación de un contrato (mock, HTTP, test) se comporta igual: mismos tipos y siempre lanza `AppError` con el `code` correcto.
- **I — Segregación de interfaces:** contratos pequeños por dominio (`Readable`, `Writable`, `AuthRepository`, `ProfileRepository`…). Los contextos exponen sólo lo que el consumidor necesita (`useTheme` vs `useThemePreference`, `useAuthState` vs `useAuthActions`).
- **D — Inversión de dependencias:** las pantallas dependen de `contracts.ts` vía `useRepositories()`, nunca de `mock/`. Las dependencias concretas (repositorios, `tokenStore`, `themePreferenceStore`) se inyectan sólo en el layout raíz.

## Seguridad (obligatorio)

- **La autorización real está en la API.** `Stack.Protected` por rol es sólo experiencia de usuario. Los repositorios mock replican el middleware con `guard.requireClient()/requireAdmin()`; todo método nuevo debe llamar al guard.
- **El dueño sale del token, nunca de un parámetro.** Los contratos de "mis datos" no reciben `userId` (ver `ProfileRepository`). Evita IDOR.
- **Tokens:** sólo en `expo-secure-store` con `WHEN_UNLOCKED_THIS_DEVICE_ONLY`. En web, sólo en memoria. **Nunca** tokens ni datos personales en `localStorage`/AsyncStorage/logs. `localStorage` sólo para preferencias de interfaz no sensibles (tema).
- **Cerrar sesión** revoca en servidor (best-effort), borra tokens y ejecuta `queryClient.clear()` para no dejar datos en caché. Cualquier respuesta `unauthorized` termina la sesión automáticamente.
- **No revelar información:** mismo error para correo inexistente o contraseña incorrecta; `requestPasswordReset` siempre resuelve. `errorMessage()` nunca muestra detalles técnicos.
- **Validar dos veces:** esquemas zod en el formulario y validación de nuevo en el repositorio/API (p. ej. `BODY_LIMITS`). El cliente nunca es la única barrera.
- **Entradas no confiables:** parámetros de ruta/deep links se validan contra listas permitidas (ver `getInfoPage`). Valores leídos de almacenamiento se validan antes de usarse.
- **Datos sensibles (salud: peso, estatura, edad):** opcionales, minimizados (edad en vez de fecha de nacimiento), visibles sólo para su dueño, con opción de borrarlos, nunca compartidos con conexiones.
- **Límites de abuso:** reglas como `MAX_PENDING_PER_USER` en propuestas responden `rate_limited`.
- **Contraseñas:** mínimo 8 caracteres con letras y números; la API guardará hashes argon2. Las credenciales demo sólo se muestran bajo `__DEV__`.
- Errores de permisos (`unauthorized`, `forbidden`, `not_found`) no se reintentan en React Query.
- No agregar dependencias sin revisar que sean mantenidas y compatibles con el SDK (`npx expo install`).

## Diseño y UX

- **Única fuente visual:** `shared/theme/tokens.ts` (colores claro/oscuro, `spacing`, `radius`, `typography`). Prohibido hardcodear colores, tamaños o espaciados; usar `useTheme()`.
- El color comunica significado: `accent` = acción/cumplido, `danger` = destructivo; `protein`/`carbs`/`fat` reservados para macros.
- **Tema:** preferencia `system | light | dark` en `ThemeProvider`, persistida en el dispositivo y aplicada también a controles nativos (`Appearance.setColorScheme`). Todo componente debe verse bien en ambos modos.
- **Componentes base** en `shared/ui` (`Screen`, `Card`, `Button`, `TextField`, `ListItem`, `ChipGroup`, `QueryState`, `EmptyState`, `ConfirmAction`…). Reutilizar antes de crear; si se crea uno nuevo, exportarlo en `shared/ui/index.ts`.
- **Accesibilidad:** objetivos táctiles ≥ `minTouchSize` (44); `accessibilityRole`/`accessibilityLabel` en todo elemento interactivo (`IconButton` lo exige); `accessibilityRole="header"` en títulos de sección; errores con `accessibilityLiveRegion`.
- **Estados de datos** con `QueryState` (carga, error con reintento, vacío con acción). Ninguna pantalla queda en blanco.
- **Acciones destructivas** con `ConfirmAction` (funciona igual en iOS, Android y web; no usar `Alert`).
- Íconos sólo desde el registro de `Icon.tsx` (SF Symbols en iOS, Material Symbols en Android/web).
- Textos breves, en español neutro, explicando qué pasó y cómo resolverlo.

## Navegación

- Raíz: `Stack` con guardas por rol → `(auth)`, `(client)`, `admin`, y `info/[page]` público (políticas, quiénes somos, FAQ; accesible con o sin sesión).
- Cada rol: `Stack` → `(drawer)` (menú lateral `AppDrawer`) → `(tabs)`. Las pantallas de detalle, perfil, datos personales y modales se apilan sobre el drawer.
- Menú lateral (`features/menu`): datos del usuario, secciones del rol, Información (FAQ, Quiénes somos — Brams Tech, Privacidad, Términos), selector de tema y cerrar sesión con confirmación. Para agregar una opción, editar `sections.ts`.
- Rutas tipadas: para rutas dinámicas usar la forma objeto o helpers tipados (`infoHref('faq')`).

## Convenciones de datos

- Contratos en `core/repositories/contracts.ts`; tipos en `core/domain/types.ts`. Cambiar un contrato implica actualizar mock y, después, HTTP.
- Claves de caché sólo desde `queryKeys`; invalidar por prefijo (`queryKeys.x.all`). Tras una mutación usar la respuesta del servidor (`setQueryData`) o invalidar.
- Formularios con `useForm(schema, valores)`: valores como texto, el esquema zod los convierte y valida. Mensajes de error en español y accionables.
- Reglas de negocio vigentes: receta con `ownerId: null` = catálogo oficial (admin); al eliminar una conexión se retira lo compartido pero se conservan las copias guardadas; aprobar una propuesta crea el registro en el catálogo con los datos editados por el admin.

## Antes de dar una tarea por terminada

1. `npx tsc --noEmit` y `npx expo lint` sin errores.
2. Revisar modo claro y oscuro, y que funcione en web además de móvil.
3. Todo dato nuevo del usuario: ¿está protegido por el guard?, ¿se valida en ambos lados?, ¿se limpia al cerrar sesión?
4. Sin código muerto, sin colores/espaciados hardcodeados, sin `console.log` con datos de usuario.

## Pendientes conocidos

- Implementar `createHttpRepositories()` (HTTPS, refresh de token, mapeo de errores HTTP → `AppError`).
- Textos legales (`features/info/content.ts`) son borrador: requieren revisión legal (Ley 19.628 / 21.719) y un canal de contacto oficial antes de publicar.
- Eliminación de cuenta y exportación de datos desde la app (derechos del titular).
- Usar los datos corporales para sugerir objetivos (p. ej. kcal diarias), siempre como referencia y no como indicación médica.
- El directorio raíz `app/` (sólo `index.tsx` de plantilla) no se usa: `src/app` tiene prioridad. Eliminarlo para evitar confusión.
