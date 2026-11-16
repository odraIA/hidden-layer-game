# Hidden Layer

*a VRAIN game.* An office game where a secret object travels from desk to desk.

- `SPEC.md`: the full game spec. Source of truth.
- `CLAUDE.md`: project rules and folder structure.

## Requirements

- Node 22
- Docker (only for the local Supabase backend)
- Expo Go on a phone, or an Android/iOS simulator

## Run it

```bash
npm install
npx expo start          # scan the QR with Expo Go
npx supabase start      # local backend (needs Docker running)
```

The app opens on a sample home screen with made-up data. It does not talk to
Supabase yet.

## Checks

```bash
npx tsc --noEmit        # typecheck
npx eslint .            # lint
npm test                # tests, including the i18n key check
```

CI runs the three of them on every pull request (`.github/workflows/ci.yml`).

## Where things are

| Folder | What |
|---|---|
| `app/` | Screens (expo-router) |
| `components/` | UI components. `Button`, `Card`, `Badge` and `Screen` are the base set |
| `theme/` | Design tokens: colors, fonts, spacing, radii, hard shadows |
| `assets/images/` | App icon and splash art, with their SVG sources |
| `i18n/` | All UI text: `es.json` (source), `ca-valencia.json`, `en.json` |
| `lib/` | App code that is not UI. `lib/sample/` holds the made-up data |
| `supabase/` | Local Supabase project: config, migrations, Edge Functions |

Two lint rules back the project rules: UI text must go through `t('key')`, and
hex colors are only allowed inside `theme/`.
