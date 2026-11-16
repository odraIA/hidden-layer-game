# Hidden Layer · Especificación del juego

> *a VRAIN game*. Juego de oficina para ~15–20 personas: un objeto secreto va escondiéndose de mesa en mesa. Nadie sabe qué objeto es ni cuándo le han escondido algo. Cuanto más tiempo pase sin ser descubierto, más puntos.

Documento de referencia para implementar la app. Si algo no está aquí, preguntar antes de inventar.

---

## 1. Glosario

| Término | Significado |
|---|---|
| **Temporada** | Conjunto de rondas con una clasificación acumulada. |
| **Ronda (epoch)** | Una vuelta completa del objeto por todos los participantes de esa ronda. |
| **Layer 0** | Jugador que abre la ronda: consigue el objeto físico y hace el primer escondite. Rota cada ronda. |
| **Curador** | Autor de la sugerencia de objeto elegida en el sorteo. Anónimo. |
| **Portador (holder)** | Quien tiene el objeto en este momento y debe esconderlo. |
| **Objetivo (target)** | Persona en cuya mesa se esconde el objeto. **No recibe ningún aviso.** |
| **Escondite (hide)** | Un eslabón de la cadena: portador → objetivo, con foto, tiempos y puntos. |
| **Admin** | Rol con acceso al modo admin. Puede ser también jugador. |

---

## 2. Principios de diseño (no negociables)

1. **Secreto total durante la ronda.** Nadie, salvo quien ya lo ha tenido en esa ronda, sabe qué objeto es. El objetivo nunca recibe aviso de que le han escondido algo. La app no puede filtrar esta información por ningún sitio (ni notificaciones, ni clasificaciones, ni feed).
2. **El servidor manda.** Todos los tiempos, asignaciones y puntos se calculan en el servidor (Supabase). La app solo muestra.
3. **Solo tiempo laborable.** El tiempo solo cuenta en horario laboral configurable, sin festivos ni ausencias del objetivo.
4. **Constantes configurables.** Todos los números de puntuación y plazos viven en una tabla `config` editable desde el modo admin.
5. **Funciona aunque las push no lleguen.** Toda notificación se guarda también en un buzón dentro de la app (la IPA puede instalarse sin push).

---

## 3. Ciclo de vida de una ronda

```
draft → opt_in → layer0_draw → object_selection → setup → active → closing → closed
```

### 3.1 `draft`
El admin crea la ronda (fecha de inicio, nº de cadenas = 1 por defecto).

### 3.2 `opt_in`: ¿Juegas esta ronda?
- El admin pulsa **"Iniciar ronda"**. Todos los jugadores activos reciben: *"Nueva ronda de Hidden Layer. ¿Juegas esta vez?"* con botones **Juego / Esta paso**.
- Plazo: `opt_in_hours` (por defecto 24 h laborables). **Si no responde, no juega.**
- Mínimo de participantes: `min_players` (por defecto 5). Si no se alcanza, el admin puede ampliar el plazo o cancelar.

### 3.3 `layer0_draw`: Sorteo de Layer 0
- Se elige entre los que juegan, **priorizando a quien menos veces ha sido Layer 0** (desempate aleatorio).
- Layer 0 recibe: *"Eres la Layer 0 de esta ronda"*. Puede **aceptar** o **rechazar** (si rechaza, se sortea otro; queda registrado y no cuenta como turno).

### 3.4 `object_selection`: Sorteo del objeto
- Se saca una sugerencia aleatoria del **bote de sugerencias** (ver 3.8).
- Layer 0 ve **solo el texto** de la sugerencia (nunca el autor) y decide:
  - **Viable** → indica tamaño (`S`, `M`, `L`) que fija el multiplicador del objeto y pasa a `setup`.
  - **No viable** → la sugerencia se descarta definitivamente y se saca otra aleatoria.
- Si el bote se vacía, Layer 0 elige el objeto libremente (y pasa a ser también curador).

### 3.5 `setup`
- Layer 0 consigue el objeto físico. La app le muestra el **QR de la ronda** para imprimirlo/descargarlo y pegarlo discretamente en el objeto.
- Plazo para hacer el primer escondite: `layer0_setup_days` (por defecto 3 días laborables). Recordatorios automáticos.
- Al hacer el primer escondite, la ronda pasa a `active`.

### 3.6 `active`: La cadena
Ver sección 4.

### 3.7 `closing`: Revelación, votación y sugerencias
Se activa cuando el último objetivo encuentra el objeto. Este jugador recibe: *"¡Eres la última capa! Devuelve el objeto a Layer 0."* (sin puntos de escondite; se compensa, ver 5.4).

Durante `closing_hours` (por defecto 48 h laborables):
- **Galería de revelación**: todas las fotos de los escondites en orden, con quién escondió a quién y cuánto aguantó.
- **Votación de originalidad**: cada participante puntúa cada escondite con un **slider de 1 a 10**. No puede votar los suyos.
- **Sugerencia de próximo objeto**: cada participante puede enviar **una** sugerencia (texto libre, máx. 80 caracteres). Va al bote.
- Al terminar el plazo, se calculan bonus finales y la ronda pasa a `closed`.

### 3.8 Bote de sugerencias
- Las sugerencias no elegidas ni descartadas **se quedan en el bote** para rondas futuras.
- Para la primera ronda, el admin abre una fase de sugerencias manual antes de iniciar.
- Las sugerencias son anónimas para todos menos para el admin (y oculto tras spoiler).

### 3.9 `closed`
Se publican la clasificación de la ronda y la actualización de la temporada.

---

## 4. La cadena (estado `active`)

### 4.1 Participantes de la cadena
- Todos los que juegan la ronda **excepto Layer 0** (conoce el objeto).
- **Excepto el curador** si `exclude_curator = true` (por defecto `true`), porque conoce el objeto. Se le excluye en silencio; nadie más sabe por qué.

### 4.2 Asignación de objetivo
Cuando alguien pasa a ser portador, el servidor le asigna un objetivo al azar entre los participantes de la cadena que:
- aún no han sido objetivo en esta ronda,
- no son él mismo,
- no tienen ausencia marcada hoy.

Si todos los pendientes están ausentes, el portador ve *"Tu próximo objetivo no está hoy. Te avisaremos."* y se reintenta cada mañana.

El portador ve: nombre, avatar, **ubicación de la mesa** (texto + foto opcional del puesto).

### 4.3 Esconder
1. El portador esconde el objeto en la mesa del objetivo.
2. Hace la **foto del escondite desde la cámara de la app** (no se permite galería).
3. Al subirse la foto, el servidor fija `hidden_at = now()` y **empieza a correr el tiempo**.
4. Reglas mostradas antes de la foto (checklist que hay que aceptar la primera vez):
   - Dentro del puesto de trabajo del objetivo.
   - Sin abrir nada con llave; nada en bolsos, abrigos ni pertenencias personales.
   - Que no pueda romper nada ni molestar para trabajar.

### 4.4 Encontrar
- Cuando alguien ve algo raro, lo gira, encuentra el QR y lo escanea desde la app.
- El servidor valida el token de la ronda:
  - **Si quien escanea es el objetivo del escondite activo** → `found_at = now()`, se calculan puntos (provisionales, ocultos), y **pasa a ser el portador** con nuevo objetivo (4.2). Pantalla: *"¡Lo encontraste! Ahora te toca esconderlo."* + foto del objeto.
  - **Si es otra persona** → *"Este escondite no es para ti. Déjalo donde está 🤫"*. Se registra el escaneo (sin puntos ni penalización).
  - **Si es el propio portador o un token antiguo** → error genérico.

### 4.5 Plazos y atascos
| Situación | Regla | Config |
|---|---|---|
| Portador no esconde | Recordatorios a las 4 h y 7 h laborables. | `hold_reminder_hours` |
| Portador supera el plazo | Sus puntos de ese escondite ×0,5. El admin puede saltarle. | `hold_deadline_hours = 8`, `late_hide_multiplier = 0.5` |
| Escondite sin descubrir | Al llegar al máximo, el escondite se cierra como **Indetectable** y la app avisa al objetivo: *"Llevas 3 días con algo escondido en tu mesa. Búscalo."* La cadena sigue cuando lo escanee. | `max_hidden_hours = 24` (3 días de juego, ver 4.6) |

### 4.6 Tiempo laborable
`working_minutes(start, end, target)` cuenta solo minutos que cumplen todo:
- Lunes a viernes, entre `workday_start` y `workday_end` (por defecto 08:00–17:00, `Europe/Madrid`).
- No es festivo (tabla `holidays`, editable).
- El objetivo no tiene ausencia ese día.

Implementar como función pura con tests exhaustivos (cambio de hora, festivos, fines de semana, ausencias parciales por días).

**Día de juego.** Cada `working_hours_per_day` (por defecto 8) horas laborables cuentan como un día. No es un día de calendario. Se usa en dos sitios:
- **Máximo escondido:** `max_hidden_hours = 24` son 3 días de juego, contados desde `hidden_at` y solo con las horas en que el objetivo está trabajando.
- **Duraciones que ve el jugador:** 11 h laborables se muestran como *"1 día y 3 h"*.

---

## 5. Puntuación

Notación: `t` = minutos laborables con el objeto escondido. `M` = multiplicador del objeto (`S = 1.0`, `M = 1.2`, `L = 1.5`). `τ = tau_minutes = 240`.

### 5.1 Escondite (para quien esconde)
```
P_hide = M · 300 · (1 − e^(−t/τ))         con t ≤ max_hidden (1440 min)
```
Referencia (M = 1; 1 día = 8 h laborables): 1 h → 66 · 4 h → 190 · 1 día → 259 · 2 días → 295.
- **Indetectable** (llega al máximo): +50.
- **Escondite rápido** (escondido en < 2 h laborables desde que lo recibió): +20.
- **Escondite tardío** (supera `hold_deadline_hours`): `P_hide × 0.5`.

### 5.2 Hallazgo (para quien encuentra)
```
P_find = M · 100 · e^(−t/τ)
```
Si se encuentra después de Indetectable: 0.

### 5.3 Originalidad (al cerrar la ronda)
- `P_orig = media_votos × 10` (máx. 100). Requiere ≥ `min_votes = 3` votos.
- **Escondite de la ronda**: +100 al de media más alta (empates: todos).

### 5.4 Compensaciones (calculadas al cerrar)
Para que nadie salga perjudicado por su papel:
| Papel | Pierde | Compensación |
|---|---|---|
| **Layer 0** | Un hallazgo | Media de `P_find` de la ronda |
| **Última capa** | Un escondite | Media de `P_hide` de la ronda |
| **Curador excluido** | Un escondite y un hallazgo | Media de `P_hide` + media de `P_find` |

Si Layer 0 y curador son la misma persona, solo recibe la compensación de Layer 0.

### 5.5 Visibilidad de los puntos
- Todos los puntos se guardan como `score_events` con `visible_after_round_close = true`.
- **Nada de puntos ni clasificación de la ronda en curso es visible** hasta `closed`.
- La clasificación de temporada se actualiza solo al cerrar cada ronda.

---

## 6. Qué se ve durante la ronda (y qué no)

**Visible para todos:**
- Estado: *"Ronda 4 · 7/16 escondites completados"*.
- Feed anónimo: *"Alguien ha encontrado algo tras 1 día y 3 h"*, *"Un escondite ha sido declarado Indetectable"*.

**Visible solo para el portador:** su objetivo y la ubicación de su mesa.

**Visible para quien ya tuvo el objeto en esta ronda:** foto/nombre del objeto.

**Nunca visible para jugadores durante la ronda:** quién tiene el objeto, quién ha sido objetivo, fotos de escondites, puntos.

**Admin:** ve todo, pero **oculto tras un velo de spoiler** (difuminado + botón "Mostrar spoilers") para que pueda jugar sin destriparse.

---

## 7. Pantallas

### Jugador
1. **Login**: email + código OTP. Solo emails en la lista blanca.
2. **Onboarding**: nombre, avatar, ubicación de la mesa (texto: despacho/puesto + foto opcional), aceptar reglas.
3. **Inicio**: tarjeta de estado de la ronda + **tarea actual** según rol:
   - "¿Juegas esta ronda?" (opt-in)
   - "Eres Layer 0" → aceptar/rechazar, decidir viabilidad del objeto, ver QR, primer escondite.
   - "Tienes el objeto → escóndelo en la mesa de X" (con cuenta atrás del plazo).
   - "Ronda en revelación → vota y sugiere".
   - Nada pendiente → "Vigila tu mesa 👀".
4. **Escanear**: botón grande siempre accesible para leer el QR.
5. **Esconder**: checklist de reglas + cámara.
6. **Revelación**: galería de escondites + sliders de votación 1–10.
7. **Sugerir objeto**: campo de texto.
8. **Clasificaciones**: temporada, rondas anteriores, Hall of Fame (escondite más largo, mejor valorado, buscador más rápido, más veces Indetectable).
9. **Perfil**: editar datos, **calendario de ausencias**, estadísticas personales.
   - **Ajustes**: selector de idioma (Castellano / Valencià / English), con cambio inmediato sin reiniciar la app.
10. **Buzón**: historial de notificaciones.

### Modo admin (solo `role = admin`, entrada desde Perfil)
1. **Jugadores**: lista blanca de emails, activar/desactivar, dar rol admin.
2. **Temporadas y rondas**: crear, iniciar, ampliar plazos, pausar, cancelar, cerrar.
3. **Cadena en directo** (tras spoiler): portador actual, objetivo, foto, tiempo transcurrido, historial.
4. **Correcciones**: reasignar objetivo, saltar portador, marcar como encontrado, ajustar `hidden_at`/`found_at`, anular o añadir puntos (con motivo, queda en log).
5. **Bote de sugerencias**: ver (tras spoiler), borrar.
6. **QR**: regenerar el QR de la ronda (invalida el anterior).
7. **Configuración**: horario, festivos, todas las constantes de la tabla `config`.
8. **Notificación de prueba** y **exportar CSV** (escondites, puntos, votos).
9. **Log de auditoría**: escaneos ajenos, correcciones, rechazos de Layer 0.

---

## 8. Notificaciones

| Evento | Destinatario |
|---|---|
| Nueva ronda, ¿juegas? | Todos los activos |
| Eres Layer 0 | Layer 0 |
| Nuevo objeto a valorar | Layer 0 |
| Te toca esconder / recordatorios / plazo superado | Portador |
| Tu escondite ha sido encontrado (sin decir por quién ni cuánto) | Quien escondió |
| Llevas 3 días con algo en tu mesa | Objetivo (solo en Indetectable) |
| Eres la última capa | Último en encontrar |
| Ronda en revelación: vota y sugiere | Participantes |
| Ronda cerrada: mira la clasificación | Todos |

**Prohibido:** cualquier notificación que revele a un objetivo que tiene algo escondido (salvo Indetectable) o que delate quién es el portador.

---

## 9. Modelo de datos (Supabase / Postgres)

```
profiles(id → auth.users, display_name, avatar_url, desk_location, desk_photo_url,
         role: 'player'|'admin', active, rules_accepted_at, layer0_count,
         locale: 'es'|'ca-valencia'|'en')
allowed_emails(email PK, added_by, added_at)
absences(id, user_id, date)                               -- un registro por día
holidays(date PK, name)
config(key PK, value jsonb)

seasons(id, name, starts_at, ends_at, status)
rounds(id, season_id, number, status, chains_count, layer0_id, curator_id,
       object_name, object_photo_url, object_size, multiplier,
       qr_token_hash, opt_in_deadline, setup_deadline, closing_deadline,
       started_at, closed_at)
round_participants(round_id, user_id, opted_in, opted_in_at, excluded_reason)
layer0_draws(id, round_id, user_id, accepted, decided_at)

suggestions(id, author_id, text, status: 'pool'|'rejected'|'chosen',
            created_in_round_id, used_in_round_id)
object_draws(id, round_id, suggestion_id, viable, size, decided_at)

hides(id, round_id, chain_index, seq, hider_id, target_id,
      assigned_at, hidden_at, found_at, photo_url,
      status: 'assigned'|'hidden'|'found'|'undetectable'|'skipped',
      late, working_minutes)
scans(id, round_id, user_id, scanned_at, result)          -- auditoría
votes(hide_id, voter_id, score 1..10, PK(hide_id, voter_id))
score_events(id, round_id, user_id, hide_id, type, points, reason, created_at)
notifications(id, user_id, type, title, body, payload jsonb, read_at, created_at)
push_tokens(user_id, token, platform)
audit_log(id, actor_id, action, payload jsonb, created_at)
```

### RLS (crítico para el secreto)
- `hides`: un jugador solo lee sus filas como `hider_id`, y **nunca** lee filas donde es `target_id` mientras la ronda no esté en `closing`/`closed`.
- `rounds.object_*`: solo legible por Layer 0, curador, quienes ya han sido objetivo en la ronda y admin.
- `score_events`: solo legibles cuando la ronda está `closed`.
- `suggestions.author_id`: nunca expuesto a jugadores.
- `qr_token` en claro nunca se guarda: solo hash.
- Toda escritura de juego pasa por Edge Functions (service role); los clientes no escriben directamente en `hides`, `rounds`, `score_events`.

### Edge Functions
- `start_round`, `respond_opt_in`, `draw_layer0`, `respond_layer0`, `draw_object`, `respond_object`
- `get_round_qr` (Layer 0 y admin)
- `submit_hide` (sube foto, fija `hidden_at`)
- `scan_object` (valida token, gestiona 4.4)
- `submit_vote`, `submit_suggestion`
- `admin_*` (correcciones, config, export)
- **Cron cada 15 min** (`pg_cron`): recordatorios, plazos, Indetectable, cambio de fases por plazo, reintento de objetivos ausentes, cierre de rondas.

### QR
- Contenido: `hiddenlayer://found?r=<round_id>&t=<token>` (token aleatorio de 128 bits).
- El escáner de la app también acepta el QR leído con la cámara del sistema (deep link).

---

## 10. Stack

- **App:** Expo (React Native) + TypeScript + `expo-router`.
- **Cámara y QR:** `expo-camera` (foto + lectura de códigos).
- **Notificaciones:** `expo-notifications` + Expo Push. Fallback: buzón en la app.
- **Backend:** Supabase (Auth OTP por email, Postgres + RLS, Storage para fotos, Edge Functions en Deno, `pg_cron`).
- **Builds (sin nube de Expo):** `npx expo prebuild` genera los proyectos nativos y se compilan con sus herramientas.
  - **Android:** Gradle (`cd android && ./gradlew assembleRelease`) en local (Linux vale) o en GitHub Actions (`ubuntu-latest`). Keystore propio fuera del repo (secreto de GitHub).
  - **iOS:** `xcodebuild` en un runner `macos-latest` de GitHub Actions (no hace falta tener Mac). Se genera un `.ipa` sin firmar como artefacto y el organizador lo firma e instala por su cuenta (Sideloadly/AltStore).
  - Alternativa: `eas build --local` (EAS CLI es open source, pero pide cuenta de Expo gratuita).
- **Idiomas:** castellano (`es`), valenciano (`ca-valencia`) e inglés (`en`), con `i18next` + `react-i18next` y `expo-localization`. Ver sección 13.
- **Branding:** nombre *Hidden Layer*, subtítulo *a VRAIN game*. Dibujo animado de los 80, desenfadado, sobre fondo beige. Ver sección 14.

---

## 11. Hitos de implementación

Cada hito = una sesión de trabajo. No empezar uno sin cerrar el anterior.

| # | Hito | Criterio de aceptación |
|---|---|---|
| M0 | Scaffold y sistema visual | Expo + TS + expo-router arrancan; Supabase local con CLI; lint + typecheck en CI. `theme/` con los tokens de la sección 14, fuentes cargadas y componentes base (Button, Card, Badge, Screen) en una pantalla de muestra. |
| M1 | Esquema y lógica pura | Migraciones con todas las tablas y RLS; `working_minutes` y fórmulas de puntuación en `supabase/functions/_shared/` con tests (Deno) que cubren los ejemplos de la sección 5 y los casos de 4.6. Seed con 18 usuarios falsos. |
| M2 | Auth, perfil e idiomas | Login OTP con lista blanca, onboarding, ubicación de mesa, calendario de ausencias. Infraestructura i18n con los 3 idiomas y selector en Ajustes funcionando. |
| M3 | Ciclo de ronda | Opt-in, sorteo de Layer 0, bote de sugerencias, sorteo y viabilidad del objeto, QR. |
| M4 | Cadena | Asignar objetivo, foto de escondite, escaneo, paso de portador, escaneos ajenos. |
| M5 | Tiempo y avisos | Cron, plazos, recordatorios, Indetectable, notificaciones push + buzón. |
| M6 | Cierre | Galería, votación 1–10, sugerencias, compensaciones, clasificaciones, Hall of Fame. |
| M7 | Modo admin | Todo lo de la sección 7 (admin), con velo de spoiler. |
| M8 | Builds y pulido | APK e IPA generadas, icono, splash, textos revisados en los 3 idiomas (sin claves sin traducir). |

**Prueba final de M4–M6:** simular una ronda completa con 6 usuarios del seed (scripts que llamen a las Edge Functions con un reloj simulado) y comprobar que los puntos coinciden con las fórmulas.

---

## 12. Fuera de alcance (v2)

Rondas especiales (solo en altura, doble o nada), logros e insignias, equipos por grupo, varias cadenas por ronda en la UI de jugador.

---

## 13. Idiomas

- **Idiomas soportados:** castellano (`es`), valenciano (`ca-valencia`) e inglés (`en`).
- **Idioma inicial:** el del sistema si es uno de los tres (`ca` → `ca-valencia`); si no, castellano.
- **Cambio de idioma:** en Ajustes, inmediato. Se guarda en local y en `profiles.locale` para que el servidor lo conozca.
- **Textos de la app:** `i18n/es.json`, `i18n/ca-valencia.json`, `i18n/en.json`, con las mismas claves. `es` es la fuente de verdad; un test falla si a otro idioma le falta alguna clave.
- **Notificaciones push y buzón:** se generan en el servidor **en el idioma de cada destinatario** (`profiles.locale`). Las plantillas viven en `supabase/functions/_shared/i18n/` con las mismas claves en los 3 idiomas. En la tabla `notifications` se guardan `type` + `payload`, y la app renderiza el buzón en el idioma actual (así, si cambias de idioma, el historial también cambia).
- **Contenido de jugadores** (sugerencias de objeto, ubicación de la mesa) no se traduce.
- **Fechas y números** formateados con el locale activo (`Intl`).
- **Valenciano:** usar la normativa valenciana (AVL): "eixir", "este", "vosté"… y no formas del catalán central.

---

## 14. Dirección visual

**Concepto:** dibujo animado de los 80, desenfadado y con complicidad, como una caricatura de sábado por la mañana. El motivo de "capas" y "nodos" de IA aparece dibujado a mano, nunca como red neuronal técnica ni futurista.

**Obligatorio:** todo trabajo visual y de textos se hace siguiendo las skills **antislop** (`antislop`, `antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`). Cargarlas antes de diseñar o tocar cualquier pantalla.

### Rasgos del estilo
- **Fondo beige papel** en toda la app, con una textura sutil de grano o trama de puntos (halftone) muy suave.
- **Contornos negros gruesos** (3–4 px) en tarjetas, botones, avatares e ilustraciones.
- **Colores planos y saturados**, sin degradados.
- **Sombras duras desplazadas** (offset 4–6 px, sin desenfoque, color tinta) **solo en dos sitios**: la tarjeta protagonista de cada pantalla y los elementos que se pueden pulsar. El resto (listas, tarjetas de información) va plano, solo con contorno. Al pulsar, la sombra desaparece y el botón "baja".
- **Una tarjeta protagonista por pantalla**, ligeramente girada (±1°) como una pegatina: es el foco y lo único que "salta".
- **Formas redondeadas y algo gordas**, con ligera irregularidad dibujada a mano en ilustraciones (no en los componentes de UI).
- **Animación de dibujo animado:** squash & stretch, rebotes cortos, "¡pop!" al encontrar el objeto. Duraciones cortas (150–300 ms). Respetar *reducir movimiento* del sistema.
- **Iconos** dibujados con el mismo trazo grueso. Los emojis no sustituyen a los iconos.

### Tokens de partida (ajustables, validar contraste)
| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F3E7CF` | Fondo |
| `paper-2` | `#E9D9B8` | Tarjetas secundarias, separadores |
| `ink` | `#1E1A16` | Texto, contornos, sombras |
| `tomato` | `#E4572E` | Acción principal, "¡encontrado!" |
| `mustard` | `#F2B33D` | Destacados, puntos |
| `teal` | `#17695D` | Estado OK, Layer 0 (oscurecido para que el texto `paper` encima pase AA) |
| `bubblegum` | `#F28FAD` | Votación, originalidad |

Todo texto sobre color debe cumplir WCAG AA (comprobar con el contraste de `antislop-human`). Sobre `tomato` y `teal`, texto `paper` o `ink` según lo que pase.

### Tipografía
- **Títulos:** display redonda y gruesa con aire ochentero (candidatas: *Titan One*, *Bowlby One*, *Luckiest Guy*).
- **Texto:** sans redondeada y muy legible (candidatas: *Nunito*, *Rubik*).
- Requisito: **cobertura completa de caracteres del valenciano** (à, è, é, í, ò, ó, ú, ï, ü, ç, l·l). Descartar fuentes que no los tengan.
- Licencias libres (Google Fonts / OFL), cargadas con `expo-font`.

### Mascota (opcional, original)
Un pequeño **nodo** redondo con patas y ojos grandes, que se esconde detrás de las cosas. Aparece en estados vacíos, onboarding y celebraciones. Diseño propio; no inspirarse en personajes existentes.

### Tono de los textos
Cercano, con guiños de IA y de oficina ("Vigila tu mesa", "Eres la última capa", "Indetectable"). Frases cortas. Nada de textos genéricos de app ("¡Bienvenido a la mejor experiencia!").

### Decisiones antislop (con su motivo)
- **Paleta:** 3 colores base (`tomato` acción, `mustard` destacado, `teal` estados OK) + 1 acento (`bubblegum`, reservado al momento de votar). Sin más colores.
- **Trama de puntos del fondo:** imita la impresión de cómic ochentera; es el motivo de identidad, no decoración genérica.
- **Titan One + Nunito:** títulos redondos y gruesos de cartel de dibujos animados; texto redondeado a juego y muy legible.
- **Iconos propios** con el mismo trazo grueso que los contornos (no una librería de trazo fino).
- **Sin etiquetas en mayúsculas con espaciado ancho** y **sin "pastillas" encima del título** que repitan lo que dice el título.
- **Foco de teclado visible** (contorno tinta de 3 px) en todo lo pulsable.
- **Estados obligatorios** en toda lista o dato: con datos, vacío (con qué hacer), cargando y error (con Reintentar).
- **Movimiento** (nivel 2): rebote de "¡pop!" al encontrar el objeto, asomo de la mascota una sola vez, pulsación de botones. Nada en bucle salvo el indicador de carga.
- **Contraste comprobado:** tinta sobre `tomato` 4,7:1; tinta sobre `mustard` 9,3:1; `paper` sobre `teal` 5,3:1; tinta sobre `bubblegum` 7,7:1. Nunca `paper` sobre `tomato` (3,0:1).

### Evitar
Degradados morados, *glassmorphism*, estética "dashboard SaaS", sombras difusas, modo oscuro por defecto, tarjetas genéricas sin contorno, ilustraciones de stock.

---

## 15. Coste cero

Todo debe funcionar con planes gratuitos, sin tarjeta.

| Pieza | Servicio gratuito | Límite relevante |
|---|---|---|
| Backend (BD, auth, fotos, funciones, cron) | Supabase Free | 500 MB BD, 1 GB ficheros, 500k invocaciones de funciones/mes, 2 proyectos. **Se pausa tras 7 días sin actividad.** |
| Builds APK/IPA | Gradle / Xcode en GitHub Actions (`.github/workflows/build.yml`, lanzado a mano o al crear un tag) | Minutos de Actions: gratis en repo público; en privado, cuidado con macOS, que gasta más |
| Notificaciones | Expo Push | Gratis |
| Repo y keep-alive | GitHub (+ GitHub Actions) |: |

Reglas que se derivan:
- **Keep-alive:** un workflow de GitHub Actions (`.github/workflows/keepalive.yml`) hace una consulta ligera a la BD una vez al día, para que el proyecto no se pause entre rondas o en vacaciones.
- **Fotos comprimidas** en el móvil antes de subir (lado largo 1280 px, JPEG ~75 %, objetivo < 300 KB).
- **Copia de seguridad:** el plan gratuito no tiene backups; el admin puede exportar todo a CSV y conviene un `pg_dump` mensual (otro workflow).
- **Builds con cabeza:** desarrollar con Expo Go / dev build y solo generar APK/IPA al cerrar hitos.
- **Un solo proyecto Supabase** (producción) + Supabase local con la CLI para desarrollo.
