# Env Ready

> A VS Code extension that shows a fullscreen splash page and a status-bar indicator while waiting for other extensions to finish activating. Hard to miss, auto-closes the moment everything is ready.

Built for **GitHub Codespaces / dev containers** where the editor window opens before tooling like the Python extension (Pylance) has finished loading — and beginner students don't realise they need to wait before the ▶ Run button appears.

---

## What it looks like

When configured extensions are still activating, the **editor area is taken over by a splash page**:

```
🐍

Setting up your environment

Loading the extensions you need to start coding.
This usually takes just a few seconds.

▰▰▰▱▱▱▱▱▱▱▱▱  ← animated indeterminate progress bar

⟳ Activating extensions…

💡 This page will close automatically when everything is ready.
```

A subtle status-bar item also shows `⟳ Environment loading…` in the bottom-left.

When all configured extensions are active:
- The splash page closes automatically.
- Status bar flips to `✓ Environment ready` for a few seconds.
- A toast notification confirms: *"Environment ready — you can start coding!"*

---

## Configuration

Add to your workspace `.vscode/settings.json` or to the `settings` block in `devcontainer.json`:

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
| `envReady.timeoutSeconds` | `60` | Fallback timeout. If extensions still haven't activated after this many seconds, mark "ready" anyway so the indicator doesn't get stuck. |
| `envReady.loadingText` | `"Environment loading…"` | Text shown in the status bar while waiting. |
| `envReady.readyText` | `"Environment ready"` | Text shown once everything is active. |
| `envReady.showReadyToast` | `true` | Whether to pop a toast notification when becoming ready. |
| `envReady.hideAfterSeconds` | `10` | After becoming ready, hide the status-bar item after this many seconds. Set to `0` to keep it visible forever. |
| `envReady.showSplash` | `true` | Whether to show the fullscreen splash page. Set to `false` for the status-bar-only experience. |
| `envReady.splashTitle` | `"Setting up your environment"` | Title shown on the splash page. |
| `envReady.splashMessage` | `"Loading the extensions you need to start coding. This usually takes just a few seconds."` | Description text shown on the splash page. |

---

## Compatibility

Works on **VS Code Desktop**, **VS Code in the browser** (Codespaces), and **vscode.dev**. The webview API is identical across all of them.

On Desktop, where extensions are typically pre-loaded, the early-return check usually fires and the splash doesn't even appear. On Codespaces / fresh containers, the splash takes over the editor while extensions stream in.

The splash webview has scripts disabled. All animation is pure CSS — no JavaScript, no remote content, nothing to audit. Safe to install anywhere.

---

## Installing

### From the VS Code Marketplace

```
code --install-extension danielcreggatu.env-ready
```

Or via the Extensions sidebar in VS Code, or by adding it to a `devcontainer.json`:

```json
"customizations": {
  "vscode": {
    "extensions": ["danielcreggatu.env-ready"]
  }
}
```

---

## Issues and feedback

Bug reports and feature requests are welcome at [github.com/danielcregg/vscode-env-ready/issues](https://github.com/danielcregg/vscode-env-ready/issues).

---

## License

[MIT](LICENSE)
