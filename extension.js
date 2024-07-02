const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  let proxyConfig = {};

  // 定义装饰器类型
  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: "10px",
      color: "#848484",
      fontStyle: "italic",
    },
  });

  // 读取和解析 vue.config.js 中的 proxy 配置
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

  // 更新每项 proxy 配置的描述显示实际的请求地址
  function updateProxyDecorations() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    const document = activeEditor.document;
    const decorations = [];

    // 遍历每项 proxy 配置
    for (const contextPath in proxyConfig) {
      const proxyOptions = proxyConfig[contextPath];
      let completeUrl = "";

      if (typeof proxyOptions === "string") {
        completeUrl = proxyOptions;
      } else if (typeof proxyOptions === "object" && proxyOptions.target) {
        completeUrl = proxyOptions.target;
      }

      if (completeUrl) {
        // 查找每项配置的 target 属性的位置
        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          if (line.text.includes(`target`)) {
            const targetPosition = line.range.end;
            const completeUrlText = ` Complete URL: ${completeUrl}${contextPath}`;
            const decoration = {
              range: new vscode.Range(targetPosition, targetPosition),
              renderOptions: { after: { contentText: completeUrlText } },
            };
            decorations.push(decoration);
          }
        }
      }
    }

    activeEditor.setDecorations(decorationType, decorations);
  }

  // 监听 vue.config.js 文件的变化
  const watcher = vscode.workspace.createFileSystemWatcher("**/vue.config.js");
  watcher.onDidChange(readProxyConfig);
  watcher.onDidCreate(readProxyConfig);
  watcher.onDidDelete(() => {
    proxyConfig = {};
    updateProxyDecorations();
  });

  // 注册文档打开事件监听
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

  // 注册文本编辑器的保存事件监听
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

  // 注册文本编辑器的激活事件监听
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      updateProxyDecorations();
    }
  });

  context.subscriptions.push(watcher);
  context.subscriptions.push(decorationType);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
