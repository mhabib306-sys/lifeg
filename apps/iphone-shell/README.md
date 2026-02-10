# iPhone Shell (Isolated)

This folder contains an isolated Capacitor-based iPhone app shell for Homebase.

Purpose:
- Let iOS app work proceed in parallel without touching shared web app files.
- Avoid conflicts with ongoing macOS app work.

Current status:
- Capacitor project scaffold is prepared in this folder only.
- No shared root files (`package.json`, `vite.config.js`, `src/*`) are modified.

## Layout

- `package.json` - local dependencies/scripts for iOS shell only
- `capacitor.config.ts` - Capacitor config for bundle id + app name
- `www/` - local web assets target for Capacitor runtime
- `scripts/sync-web-assets.sh` - copies root `dist/` web build into `www/`

## Next safe steps (no shared-file edits)

1. From this folder, install local deps:
   - `npm install`
2. Generate iOS native project:
   - `npm run cap:add:ios`
3. Sync root web build into `www/`:
   - `npm run sync:web`
4. Sync Capacitor:
   - `npm run cap:sync`
5. Open in Xcode:
   - `npm run cap:open:ios`

## Shared-file conflict points (deferred)

Do not do these until explicit green flag:
- Adding Capacitor deps/scripts to root `package.json`
- Changing root build pipeline
- Updating shared auth/sync runtime in `src/*` for native plugins
