const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: "file", language: "javascript" },
    {
      provideHover(document, position, token) {
        const line = document.lineAt(position.line);
        const regex = /\/api/;
        console.log("dadafa-----");
        const match = line.text.match(regex);

        if (match) {
          const workspaceFolder =
            vscode.workspace.workspaceFolders[0].uri.fsPath;
          const configPath = path.join(workspaceFolder, "vue.config.js");

          if (!fs.existsSync(configPath)) {
            return null;
          }

          const config = require(configPath);
          const proxyConfig = config.devServer.proxy["/api"];
          const target = proxyConfig.target || "";
          const pathRewrite = proxyConfig.pathRewrite || {};
          let newPath = line.text;

          for (const [key, value] of Object.entries(pathRewrite)) {
            newPath = newPath.replace(new RegExp(key), value);
          }

          const fullUrl = `${target}${newPath}`;

          const hoverMessage = new vscode.MarkdownString(
            `**完整请求地址:** ${fullUrl}`
          );
          hoverMessage.isTrusted = true;

          return new vscode.Hover(hoverMessage);
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
