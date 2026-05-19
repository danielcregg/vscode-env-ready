# Changelog

All notable changes to the **Env Ready** extension will be documented in this file.

## [0.2.1] - 2026-05-19

### Changed
- Activation event is now `"*"` (was `"onStartupFinished"`). The previous event fired *after* the startup phase completed, so the extension only activated once most other extensions were already loaded — leaving only a few seconds for the splash to be visible. With `"*"`, the splash appears at the start of the loading window. The first 4 lines of `activate()` short-circuit when `envReady.waitFor` is empty, so the cost for unconfigured installs is negligible.

## [0.2.0] - 2026-05-19

### Added
- **Splash page**: a fullscreen webview that takes over the editor area while extensions are activating. Shows an animated logo, an indeterminate progress bar, a spinner, and a "this will close automatically" tip. Auto-closes when all configured extensions are ready, or when the timeout elapses.
- `envReady.showSplash` setting (default `true`) — disable to use only the status-bar indicator.
- `envReady.splashTitle` setting — customize the splash title (default: *"Setting up your environment"*).
- `envReady.splashMessage` setting — customize the splash description text.

### Changed
- The splash and the status-bar item now run side by side during loading. After the splash closes, the status bar persists as the ready indicator (and auto-hides after `hideAfterSeconds`).
- Short-circuits before opening the splash if all configured extensions are already active — so on VS Code Desktop, where extensions are usually pre-loaded, the splash typically won't appear at all.

### Notes
- Splash text uses VS Code theme variables, so it adapts to whatever colour theme the user is on.
- The splash webview has scripts disabled (`enableScripts: false`) — all animation is pure CSS, no JS, no remote content. Safe by construction.

## [0.1.4] - 2026-05-19

### Added
- Initial release.
- Status-bar item that shows a spinner with configurable text while waiting for a list of extensions to activate.
- Flips to a "ready" state (and optional toast notification) once all configured extensions are active.
- Configurable timeout fallback so the banner never gets stuck.
- Configurable auto-hide after becoming ready.
