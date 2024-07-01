const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: "file", language: "javascript" },
    {
      provideHover(document, position, token) {
        const line = document.lineAt(position.line);
        const hoveredText = line.text.trim();

        // 检查鼠标是否悬浮在 proxy 属性的键上
        const keyMatch = hoveredText.match(/['"]([^'"]+)['"]\s*:/);

        if (keyMatch) {
          const proxyKey = keyMatch[1].trim();

          try {
            const workspaceFolder =
              vscode.workspace.workspaceFolders[0].uri.fsPath;
            const configPath = path.join(workspaceFolder, "vue.config.js");

            if (!fs.existsSync(configPath)) {
              return null;
            }

            // 动态读取 vue.config.js 文件
            delete require.cache[require.resolve(configPath)];
            const config = require(configPath);

            const proxyConfig = config.devServer.proxy[proxyKey];
            const target = proxyConfig.target || "";
            const pathRewrite = proxyConfig.pathRewrite || {};

            let newPath = proxyKey;
            for (const [key, value] of Object.entries(pathRewrite)) {
              newPath = newPath.replace(new RegExp(key), value);
            }

            const fullUrl = `${target}${newPath}`;

            const hoverMessage = new vscode.MarkdownString(
              `**完整请求地址:** ${fullUrl}`
            );
            hoverMessage.isTrusted = true;

            return new vscode.Hover(hoverMessage);
          } catch (error) {
            console.error("Error parsing vue.config.js:", error);
            return null;
          }
        }

        return null;
      },
    }
  );

  context.subscriptions.push(hoverProvider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
