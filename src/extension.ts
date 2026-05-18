import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem | undefined;
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

  // Nothing to wait for => do nothing.
  if (waitFor.length === 0) {
    return;
  }

  // Status-bar item, far left, high priority so it sits before branch/etc.
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

  // Already ready? Short-circuit.
  if (allReady()) {
    markReady(false);
    return;
  }

  // Poll every 500ms.
  watchInterval = setInterval(() => {
    if (allReady()) {
      markReady(false);
    }
  }, 500);

  // Fallback timeout.
  timeoutHandle = setTimeout(() => {
    markReady(true);
  }, timeoutSeconds * 1000);
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
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
