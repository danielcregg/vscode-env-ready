import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem | undefined;
let splashPanel: vscode.WebviewPanel | undefined;
let watchInterval: NodeJS.Timeout | undefined;
let timeoutHandle: NodeJS.Timeout | undefined;
let hideHandle: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const config = vscode.workspace.getConfiguration("envReady");
  const waitFor: string[] = config.get("waitFor", []);
  const timeoutSeconds: number = config.get("timeoutSeconds", 60);
  const loadingText: string = config.get("loadingText", "Environment loading…");
  const readyText: string = config.get("readyText", "Environment ready");
  const showReadyToast: boolean = config.get("showReadyToast", true);
  const hideAfterSeconds: number = config.get("hideAfterSeconds", 10);
  const showSplash: boolean = config.get("showSplash", true);
  const splashTitle: string = config.get(
    "splashTitle",
    "Setting up your environment",
  );
  const splashMessage: string = config.get(
    "splashMessage",
    "Loading the extensions you need to start coding. This usually takes just a few seconds.",
  );

  if (waitFor.length === 0) {
    return;
  }

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    Number.MAX_SAFE_INTEGER,
  );
  statusBarItem.text = `$(loading~spin) ${loadingText}`;
  statusBarItem.backgroundColor = new vscode.ThemeColor(
    "statusBarItem.warningBackground",
  );
  statusBarItem.tooltip = `Waiting for: ${waitFor.join(", ")}`;
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  const allReady = (): boolean => {
    for (const id of waitFor) {
      const ext = vscode.extensions.getExtension(id);
      if (!ext || !ext.isActive) {
        return false;
      }
    }
    return true;
  };

  const markReady = (timedOut: boolean): void => {
    if (watchInterval) {
      clearInterval(watchInterval);
      watchInterval = undefined;
    }
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = undefined;
    }
    if (splashPanel) {
      splashPanel.dispose();
      splashPanel = undefined;
    }
    if (!statusBarItem) {
      return;
    }

    statusBarItem.text = `$(check) ${readyText}`;
    statusBarItem.backgroundColor = undefined;
    statusBarItem.tooltip = timedOut
      ? `Timed out after ${timeoutSeconds}s — some extensions may not have finished loading.`
      : `All configured extensions are active.`;

    if (showReadyToast) {
      vscode.window.showInformationMessage(
        timedOut
          ? `${readyText} (some extensions may still be loading)`
          : `${readyText} — you can start coding!`,
      );
    }

    if (hideAfterSeconds > 0) {
      hideHandle = setTimeout(() => {
        statusBarItem?.dispose();
        statusBarItem = undefined;
      }, hideAfterSeconds * 1000);
    }
  };

  if (allReady()) {
    markReady(false);
    return;
  }

  if (showSplash) {
    splashPanel = vscode.window.createWebviewPanel(
      "envReadySplash",
      splashTitle,
      vscode.ViewColumn.Active,
      {
        enableScripts: false,
        retainContextWhenHidden: false,
      },
    );
    splashPanel.webview.html = getSplashHtml(splashTitle, splashMessage);

    splashPanel.onDidDispose(
      () => {
        splashPanel = undefined;
      },
      null,
      context.subscriptions,
    );
  }

  watchInterval = setInterval(() => {
    if (allReady()) {
      markReady(false);
    }
  }, 500);

  timeoutHandle = setTimeout(() => {
    markReady(true);
  }, timeoutSeconds * 1000);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSplashHtml(title: string, message: string): string {
  const t = escapeHtml(title);
  const m = escapeHtml(message);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
  <title>${t}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    body {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--vscode-editor-background, #0d1117);
      color: var(--vscode-editor-foreground, #e6edf3);
      font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
      text-align: center;
      user-select: none;
    }
    .logo {
      font-size: 5rem;
      line-height: 1;
      margin-bottom: 1.25rem;
      animation: bounce 2.2s ease-in-out infinite;
      filter: drop-shadow(0 4px 12px rgba(63, 185, 80, 0.25));
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    h1 {
      font-size: 1.75rem;
      margin: 0 0 0.75rem 0;
      color: var(--vscode-textLink-foreground, #58a6ff);
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .subtitle {
      color: var(--vscode-descriptionForeground, #8b949e);
      font-size: 1.05rem;
      margin: 0 auto 2.5rem;
      max-width: 36rem;
      line-height: 1.55;
    }
    .progress-bar {
      width: min(420px, 90vw);
      height: 6px;
      background: var(--vscode-progressBar-background, #21262d);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
      margin-bottom: 1.75rem;
    }
    .progress-fill {
      position: absolute;
      top: 0;
      left: -35%;
      width: 35%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(63, 185, 80, 0) 0%,
        rgba(63, 185, 80, 0.95) 50%,
        rgba(63, 185, 80, 0) 100%
      );
      animation: slide 1.6s ease-in-out infinite;
      border-radius: 999px;
    }
    @keyframes slide {
      0%   { left: -35%; }
      100% { left: 100%; }
    }
    .status {
      color: var(--vscode-descriptionForeground, #8b949e);
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--vscode-progressBar-background, #21262d);
      border-top-color: var(--vscode-textLink-foreground, #58a6ff);
      border-radius: 50%;
      animation: spin 0.85s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .dots::after {
      content: "";
      animation: dots 1.4s steps(4, end) infinite;
    }
    @keyframes dots {
      0%   { content: ""; }
      25%  { content: "."; }
      50%  { content: ".."; }
      75%  { content: "..."; }
      100% { content: ""; }
    }
    .tip {
      margin-top: 4rem;
      color: var(--vscode-disabledForeground, #6e7681);
      font-size: 0.85rem;
      max-width: 32rem;
      opacity: 0.75;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="logo">🐍</div>
  <h1>${t}</h1>
  <div class="subtitle">${m}</div>
  <div class="progress-bar">
    <div class="progress-fill"></div>
  </div>
  <div class="status">
    <span class="spinner" aria-hidden="true"></span>
    <span>Activating extensions<span class="dots"></span></span>
  </div>
  <div class="tip">💡 This page will close automatically when everything is ready.</div>
</body>
</html>`;
}

export function deactivate(): void {
  if (watchInterval) {
    clearInterval(watchInterval);
  }
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }
  if (hideHandle) {
    clearTimeout(hideHandle);
  }
  if (splashPanel) {
    splashPanel.dispose();
  }
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
