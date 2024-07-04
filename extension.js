const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.languages.registerCompletionItemProvider(
    { scheme: "file", language: "javascript" },
    {
      provideCompletionItems(document, position, token, context) {
        const linePrefix = document
          .lineAt(position)
          .text.substr(0, position.character);
        if (linePrefix.endsWith("clg")) {
          return [
            new vscode.CompletionItem(
              "console.log()",
              vscode.CompletionItemKind.Snippet
            ),
          ];
        } else if (linePrefix.endsWith("clgj")) {
          return [
            new vscode.CompletionItem(
              "console.log(JSON.parse(JSON.stringify()))",
              vscode.CompletionItemKind.Snippet
            ),
          ];
        }
        return [];
      },
    }
  );

  context.subscriptions.push(disposable);

  // 监听用户的输入，按回车时触发补全
  vscode.workspace.onDidChangeTextDocument((event) => {
    const { document, contentChanges } = event;
    const lastChange = contentChanges[contentChanges.length - 1];
    const text = lastChange.text.trim();
    const range = lastChange.range;

    if (text === "clg" || text === "clgj") {
      vscode.commands.executeCommand("editor.action.triggerSuggest");
    }
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
