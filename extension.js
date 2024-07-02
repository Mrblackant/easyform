const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  let proxyConfig = {};

  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: "10px",
      color: "#848484",
      fontStyle: "italic",
    },
  });

  function readProxyConfig() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      const workspacePath = workspaceFolders[0].uri.fsPath;
      const configPath = path.join(workspacePath, "vue.config.js");
      if (fs.existsSync(configPath)) {
        try {
          delete require.cache[require.resolve(configPath)];
          const config = require(configPath);
          proxyConfig = config.devServer.proxy || {};
          updateProxyDecorations();
        } catch (error) {
          console.error("Error reading vue.config.js:", error);
        }
      }
    }
  }

  function getCompleteUrl(contextPath, proxyOptions) {
    let completeUrl = proxyOptions.target || "";
    if (proxyOptions.pathRewrite) {
      for (let [key, value] of Object.entries(proxyOptions.pathRewrite)) {
        if (contextPath.match(key)) {
          contextPath = contextPath.replace(new RegExp(key), value);
        }
      }
    }
    return completeUrl + contextPath;
  }

  function updateProxyDecorations() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    const document = activeEditor.document;
    const decorations = [];
    // console.log("proxyConfig", proxyConfig);
    for (const contextPath in proxyConfig) {
      const proxyOptions = proxyConfig[contextPath];
      const completeUrl = getCompleteUrl(contextPath, proxyOptions);
      // console.log("proxyOptions", proxyOptions);
      console.log("completeUrl", contextPath);

      if (completeUrl) {
        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          // console.log("line", line.text);
          let ttt = line.text;
          if (line.text.includes("target") && line.text.includes(contextPath)) {
            const targetIndex = line.text.indexOf("target");
            const targetPosition = new vscode.Position(i, targetIndex);

            const completeUrlText = `实际请求地址: ${completeUrl}`;
            const decoration = {
              range: new vscode.Range(targetPosition, targetPosition),
              renderOptions: { after: { contentText: completeUrlText } },
            };
            decorations.push(decoration);
            break;
          }
        }
      }
    }

    activeEditor.setDecorations(decorationType, decorations);
  }

  const watcher = vscode.workspace.createFileSystemWatcher("**/vue.config.js");
  watcher.onDidChange(readProxyConfig);
  watcher.onDidCreate(readProxyConfig);
  watcher.onDidDelete(() => {
    proxyConfig = {};
    updateProxyDecorations();
  });

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (
      document.languageId === "javascript" ||
      document.languageId === "typescript"
    ) {
      const content = document.getText();
      if (content.includes("proxy")) {
        readProxyConfig();
      }
    }
  });

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (
      document.languageId === "javascript" ||
      document.languageId === "typescript"
    ) {
      const content = document.getText();
      if (content.includes("proxy")) {
        readProxyConfig();
      }
    }
  });

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      updateProxyDecorations();
    }
  });

  context.subscriptions.push(watcher);
  context.subscriptions.push(decorationType);

  readProxyConfig();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
