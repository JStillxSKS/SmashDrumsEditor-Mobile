# Development

Guide for building, running, and contributing to Smash Drums Editor.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 or newer |
| npm | 10 or newer |
| Windows | Required for portable EXE builds (Electron packaging) |

## Setup

```bash
git clone https://github.com/JStillxSKS/SmashDrumsEditor.git
cd SmashDrumsEditor
npm install
```

`postinstall` runs `scripts/ensure-electron.cjs`, which downloads the Electron binary if missing.

If `npm run desktop:dev` fails with *Electron failed to install correctly*:

```bash
npm approve-scripts electron
node scripts/ensure-electron.cjs
```

On Windows, `ensure-electron.cjs` uses PowerShell `Expand-Archive` because the default zip extractor can leave an incomplete `node_modules/electron/dist`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server only (browser at `http://127.0.0.1:5174`) |
| `npm run desktop:dev` | Vite + Electron with hot reload |
| `npm run build` | TypeScript check + production web build → `dist/` |
| `npm run desktop:build` | Web build + portable Windows EXE → `release/` |
| `npm run desktop:clean` | Remove unpacked build artifacts in `release/` |
| `npm run create-icon` | Regenerate `public/app-icon.ico` from the JPG |
| `npm run lint` | Run Oxlint on `src/` |

## Windows launchers

| File | Location | Purpose |
|------|----------|---------|
| `Install Launchers.bat` | Project root | Creates icon shortcuts (`.lnk`) in project root |
| `Dev Smash Drums Editor.bat` | `launchers/` | Runs `npm run desktop:dev` |
| `Build Smash Drums Editor.bat` | `launchers/` | Runs `npm run desktop:build` |
| `Open Smash Drums Editor.bat` | `launchers/` | Launches built portable EXE |

Helper scripts in `scripts/`:

| File | Purpose |
|------|---------|
| `create-app-icon.ps1` | Builds Windows-compatible `public/app-icon.ico` and `launchers/SmashDrumsEditor.ico` |
| `create-app-icon.cjs` | Node wrapper that runs `create-app-icon.ps1` |
| `create-shortcuts.ps1` | Creates Windows shortcuts with the app icon |
| `clean-release.cjs` | Kills locked processes and cleans `release/win-unpacked*` |
| `ensure-electron.cjs` | Ensures Electron binary is installed after `npm install` |

## Building the portable EXE

```bash
npm run desktop:build
```

Output:

```
release/
  Smash-Drums-Editor-0.1.0-portable.exe   # single-file portable app
  win-unpacked/                            # unpacked build (intermediate)
```

Configuration: `electron-builder.config.cjs`

- **App ID:** `com.smashdrums.editor`
- **Target:** Windows x64 portable (no installer)
- **Icon:** `public/app-icon.jpg`

If the build fails with `EPERM`, close any running Smash Drums Editor / Electron instances and retry.

## Project structure

```
SmashDrumsEditor/
├── launchers/                # Windows .bat scripts (shortcuts point here)
├── electron/
│   ├── main.cjs              # Electron main process
│   └── staticServer.cjs      # Serves dist/ in production
├── public/                   # Static assets (favicon, app icon)
├── scripts/                  # Build and launcher helpers
├── src/
│   ├── components/
│   │   ├── ChartEditor.tsx   # Highway canvas, input, rendering
│   │   ├── Toolbar.tsx       # Top bar: playback, import/export
│   │   ├── SidebarLeft.tsx   # Metadata, offset, timing
│   │   ├── SidebarRight.tsx  # View and playback settings
│   │   ├── SongOverview.tsx  # Overview waveform scrubber
│   │   ├── SongPhasesPanel.tsx
│   │   └── TimingAnchorsPanel.tsx
│   ├── store/
│   │   └── useEditorStore.ts # Zustand state (charts, meta, audio)
│   ├── theme/
│   │   └── highway.ts        # Canvas colors and glow
│   ├── types/
│   │   └── meta.ts           # Chart note, meta, lane definitions
│   ├── utils/
│   │   ├── chartIO.ts        # Clone Hero chart parse/export
│   │   ├── indiesIO.ts       # .indies ZIP parse/build
│   │   ├── metaIO.ts         # meta.json helpers
│   │   ├── chartLaneMapping.ts # CH ↔ Smash lane conversion
│   │   ├── timing.ts         # BPM, anchors, beat/time math
│   │   ├── waveform.ts       # Waveform peak generation
│   │   └── ...               # Audio, offset, clipboard, etc.
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── styles-future.css
├── electron-builder.config.cjs
├── vite.config.ts            # Dev server port 5174, base ./
├── tsconfig.json
└── package.json
```

## Architecture notes

### State management

All editor state lives in `useEditorStore` (Zustand): metadata, per-difficulty charts, audio buffers, playback, view settings, and placement modes.

### Chart resolution

480 ticks per beat (`RESOLUTION` in `src/utils/resolution.ts`), matching Clone Hero / Moonscraper.

### Electron vs browser

- **Development:** Electron loads `http://127.0.0.1:5174` via `ELECTRON_START_URL`
- **Production:** Electron serves `dist/` through `staticServer.cjs` (needed for `file://` compatibility with audio and assets)

### Audio pipeline

1. User loads audio → `AudioBuffer` decoded for waveforms and BPM detect
2. HTML `<audio>` element handles playback
3. Chart time = audio time + offset; silent lead-in mutes audio until offset elapses

## Linting

Oxlint is configured in `.oxlintrc.json` with React and TypeScript plugins:

```bash
npm run lint
```

## Git hygiene

`.gitignore` excludes:

- `node_modules/`, `dist/`, `release/`
- `*.lnk` (generated locally by `Install Launchers.bat`)
- Editor and OS files

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/SmashDrumsEditor.git
git branch -M main
git push -u origin main
```

Do not commit `node_modules`, `dist`, or `release`.

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 19, TypeScript |
| State | Zustand |
| Build | Vite 8 |
| Desktop | Electron 35 |
| Packaging | electron-builder |
| ZIP I/O | JSZip |
| Lint | Oxlint |