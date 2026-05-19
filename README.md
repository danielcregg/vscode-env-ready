# Env Ready

A status-bar indicator that shows when configured VS Code extensions have finished activating.

Designed for GitHub Codespaces, dev containers, and other remote development environments where the editor window opens before language servers and tooling (Pylance, Java extensions, Jupyter, etc.) have finished loading. The indicator gives users a clear signal that the environment is fully ready before they start running or debugging code.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=danielcreggatu.env-ready), the **Extensions** sidebar in VS Code, or from the command line:

```
code --install-extension danielcreggatu.env-ready
```

To include it automatically in a dev container or Codespace, add it to `devcontainer.json`:

```json
{
  "customizations": {
    "vscode": {
      "extensions": ["danielcreggatu.env-ready"]
    }
  }
}
```

## Usage

The extension is inert until you list which extensions it should wait for. Add an `envReady.waitFor` entry to your workspace `.vscode/settings.json` or to the `settings` block in `devcontainer.json`:

```json
{
  "envReady.waitFor": [
    "ms-python.python",
    "ms-python.vscode-pylance"
  ]
}
```

While any listed extension is still activating, a warning-coloured item is shown in the status bar with the configured loading text. Once all listed extensions are active — or the timeout elapses — the item switches to the ready state and, by default, disappears after a short delay.

If `envReady.waitFor` is empty (the default), the extension does nothing. It is safe to install in any project.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `envReady.waitFor` | `[]` | Extension IDs to wait for. The status flips to ready only when **all** listed extensions are active. |
| `envReady.timeoutSeconds` | `60` | Fallback timeout. The indicator marks itself ready after this many seconds even if some extensions have not activated, so it never gets stuck. |
| `envReady.loadingText` | `"Environment loading…"` | Text shown in the status bar while waiting. |
| `envReady.readyText` | `"Environment ready"` | Text shown once all listed extensions are active. |
| `envReady.showReadyToast` | `true` | Show a one-time notification when the environment becomes ready. |
| `envReady.hideAfterSeconds` | `10` | Hide the status-bar item this many seconds after becoming ready. Set to `0` to keep it visible. |

## Issues and feedback

Bug reports and feature requests are welcome at [github.com/danielcregg/vscode-env-ready/issues](https://github.com/danielcregg/vscode-env-ready/issues).

## License

[MIT](LICENSE)
