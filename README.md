# Environment Ready

> A tiny VS Code extension that shows a status-bar banner while waiting for other extensions to finish activating, then flips to "ready" with an optional toast.

Built for **GitHub Codespaces / dev container** scenarios where beginner students see an editor open before tooling like the Python extension (Pylance) has finished loading — and don't realise they need to wait before the ▶ Run button appears.

---

## What it looks like

While waiting:

```
⟳ Environment loading…
```

(left-aligned status-bar item with a yellow/warning background and a spinner)

When all configured extensions are active:

```
✓ Environment ready
```

(plus an optional one-time toast: *"Environment ready — you can start coding!"*)

After a configurable delay (default 10 seconds), the status-bar item disappears so it stops taking up space.

---

## Configuration

Add a `.vscode/settings.json` or workspace-level settings (in a `devcontainer.json`) like this:

```json
{
  "envReady.waitFor": [
    "ms-python.python",
    "ms-python.vscode-pylance"
  ]
}
```

If `envReady.waitFor` is empty (the default), the extension does nothing. So it's safe to install in any project — it only activates when you opt in.

### All settings

| Setting | Default | Description |
|---|---|---|
| `envReady.waitFor` | `[]` | Array of extension IDs (e.g. `"ms-python.python"`) to wait for. The extension watches each one and only marks itself "ready" when **all** of them are active. |
| `envReady.timeoutSeconds` | `60` | Fallback timeout. If extensions still haven't activated after this many seconds, mark "ready" anyway so the banner doesn't get stuck. |
| `envReady.loadingText` | `"Environment loading…"` | Text shown in the status bar while waiting. |
| `envReady.readyText` | `"Environment ready"` | Text shown once everything is active. |
| `envReady.showReadyToast` | `true` | Whether to pop a toast notification when becoming ready. |
| `envReady.hideAfterSeconds` | `10` | After becoming ready, hide the status-bar item after this many seconds. Set to `0` to keep it visible forever. |

---

## Installing in your project (local `.vsix`)

For now this extension is distributed as a `.vsix` file (no marketplace yet). To use it in another repo (e.g. a teaching Codespace):

1. Build the `.vsix` (see *Development* below) or download a pre-built one from this repo's Releases.
2. Commit the `.vsix` to your teaching repo at `.devcontainer/vscode-env-ready-0.1.0.vsix`.
3. Install it from `postCreate.sh`:

```bash
code --install-extension .devcontainer/vscode-env-ready-0.1.0.vsix
```

4. Add the workspace settings to `devcontainer.json`:

```json
"settings": {
  "envReady.waitFor": ["ms-python.python", "ms-python.vscode-pylance"]
}
```

---

## Development

Requires Node.js (18+) and npm.

```bash
# Install dependencies
npm install

# Compile once
npm run compile

# Or watch (rebuild on change)
npm run watch

# Build a .vsix you can install / share
npm run package
```

### Debugging locally

1. Open this folder in VS Code.
2. Press `F5` — this launches a second VS Code window with the extension loaded ("Extension Development Host").
3. In that second window, open any folder, set `envReady.waitFor` in your user settings to e.g. `["ms-python.python"]`, then reload — you should see the status-bar banner.

---

## Publishing to the VS Code Marketplace (optional, later)

If you want to install this as `extensions: ["danielcregg.vscode-env-ready"]` in any devcontainer without committing a `.vsix`:

1. Create a publisher at <https://marketplace.visualstudio.com/manage> (matches the `publisher` field in `package.json` — currently `danielcregg`).
2. Get a Personal Access Token from <https://dev.azure.com/> (Marketplace > Manage scope).
3. Run `npm run publish` and paste the PAT when prompted.

---

## License

MIT — see [LICENSE](LICENSE).
