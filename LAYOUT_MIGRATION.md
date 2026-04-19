# Layout Migration Notes

Date: 2026-04-14
Scope: Melody FE layout cleanup without changing active routing behavior.

## Removed

- src/layouts/DefaultLayout/index.tsx
  - Reason: No active route references this layout.
  - Impact: None on runtime routes.

## Deprecated (Kept For Reference)

- src/layouts/header/Header.tsx
  - Status: Deprecated via source comment.
  - Reason: Legacy light-theme header from pre-FloatingLayout architecture.

- src/layouts/footer/Footer.tsx
  - Status: Deprecated via source comment.
  - Reason: Legacy light-theme footer from pre-FloatingLayout architecture.

## Active Replacements

- Main user surfaces: src/layouts/FloatingLayout.tsx
- Top interaction shell: src/components/layout/DynamicIsland.tsx
- Player surfaces:
  - src/components/player/MiniPlayer.tsx
  - src/components/player/CircularPlayer.tsx
- Admin surfaces: src/layouts/AdminLayout/index.tsx

## Route Audit

Verified file: src/routes/AppRoutes.tsx

Current route -> layout mapping:

- / -> FloatingLayout
- /song/:id -> FloatingLayout
- /login -> null
- /register -> null
- /shadcn-demo -> null
- /admin, /admin/songs, /admin/upload, /admin/users -> AdminLayout

Result: No route points to DefaultLayout.

## Safety Notes

- No active route behavior changed.
- Cleanup removed unused layout file and clarified legacy components for future migration.
- Removed stale commented private-route sample in src/App.tsx that referenced DefaultLayout.
