# CLAUDE.md · Hidden Layer

App móvil (Expo) + backend Supabase para un juego de oficina de esconder un objeto secreto. **La especificación completa está en `SPEC.md`: léela antes de cada tarea.** Si algo no está en el SPEC, pregunta antes de inventar.

## Stack
- Expo (React Native) + TypeScript estricto + `expo-router`
- Supabase: Auth (OTP email), Postgres + RLS, Storage, Edge Functions (Deno), `pg_cron`
- `expo-camera`, `expo-notifications`
- Builds open source: `expo prebuild` + Gradle (APK) y Xcode en GitHub Actions (IPA sin firmar)

## Estructura
```
app/                     # pantallas (expo-router)
  (player)/              # flujo de jugador
  (admin)/               # modo admin, solo role = admin
components/
lib/                     # cliente Supabase, hooks, utilidades de UI
theme/                   # tokens (colores, tipografía, espaciado, sombras) y fuentes
i18n/                    # TODOS los textos de la UI: es.json, ca-valencia.json, en.json
supabase/
  migrations/            # SQL, una migración por cambio
  functions/
    _shared/             # lógica pura: working_minutes, scoring, asignación
    <function>/index.ts
  seed.sql               # 18 usuarios falsos
```

## Reglas
1. **El secreto es lo más importante.** Ninguna consulta, notificación ni pantalla puede revelar a un jugador: qué objeto es (si no lo ha tenido), que le han escondido algo, quién es el portador, ni puntos de la ronda en curso. Cualquier cambio que toque `hides`, `rounds`, `score_events` o notificaciones debe revisarse contra la sección 6 del SPEC.
2. **El servidor manda.** Tiempos (`now()` del servidor), asignaciones y puntos se calculan solo en Edge Functions / SQL. El cliente nunca escribe directamente en `hides`, `rounds` ni `score_events`.
3. **Sin números mágicos.** Constantes de juego siempre desde la tabla `config`.
4. **Lógica pura y testeada.** `working_minutes`, fórmulas de puntuación y asignación de objetivos viven en `supabase/functions/_shared/` y tienen tests (`deno test`). No tocar sin actualizar tests.
5. **Textos** nunca en el código: siempre `t('clave')`. Toda clave nueva se añade **a la vez** en `es`, `ca-valencia` y `en` (valenciano según normativa AVL). Las notificaciones del servidor usan las plantillas de `supabase/functions/_shared/i18n/` en el idioma del destinatario (`profiles.locale`). Ver SPEC §13.
6. **RLS siempre activo** en todas las tablas. Cada migración nueva incluye sus políticas.
7. Zona horaria del juego: `Europe/Madrid`.
8. Notificaciones: toda push se guarda también en `notifications` (buzón).
9. Cambios pequeños y enfocados al hito en curso. No refactorizar fuera del hito.
10. **Diseño con antislop.** Antes de crear o cambiar cualquier pantalla, componente o texto visible, carga las skills `antislop`, `antislop-ui`, `antislop-copywriting`, `antislop-human` y `antislop-layoutmobile`, y síguelas. Estilo: dibujo animado de los 80 sobre fondo beige (SPEC §14). Colores, fuentes y sombras solo desde `theme/`, nunca valores sueltos en los componentes.

## Comandos
```
npx expo start                 # app en desarrollo
npx supabase start             # backend local
npx supabase db reset          # aplica migraciones + seed
deno test supabase/functions   # tests de lógica
npx tsc --noEmit && npx eslint .
npx expo prebuild --clean                # genera android/ e ios/
cd android && ./gradlew assembleRelease  # APK (o workflow build.yml en GitHub Actions)
# IPA sin firmar: job macos-latest del workflow build.yml (xcodebuild archive + exportar)
```

## Definición de terminado (cada hito)
- Typecheck, lint y tests en verde.
- Criterio de aceptación del hito en `SPEC.md` §11 cumplido.
- Nada de lo nuevo rompe las reglas de secreto.
- Resumen breve de lo hecho y de lo pendiente al final de la sesión.
