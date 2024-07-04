const vscode = require("vscode");

function activate(context) {
  console.log(
    'Congratulations, your extension "console-log-snippet" is now active!'
  );

  // 注册代码片段提供程序
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider("*", {
      provideCompletionItems(document, position, token, context) {
        // 获取当前行的文本
        const linePrefix = document
          .lineAt(position)
          .text.substr(0, position.character);
        // 检查当前行的文本，包括在当前位置之前的字符
        if (linePrefix.includes("clg")) {
          // 创建完成项目
          const completionItem = new vscode.CompletionItem(
            "console.log()",
            vscode.CompletionItemKind.Method
          );
          completionItem.insertText = new vscode.SnippetString(
            "console.log($1);$0"
          );
          completionItem.documentation = new vscode.MarkdownString(
            "Inserts console.log() statement with cursor inside parentheses"
          );
          completionItem.range = new vscode.Range(
            position.translate(0, -3),
            position
          ); // 设置光标位置
          return [completionItem];
        } else if (linePrefix.includes("clgj")) {
          return [
            new vscode.CompletionItem(
              "console.log(JSON.parse(JSON.stringify()))",
              vscode.CompletionItemKind.Snippet
            ),
          ];
          // // 创建完成项目
          // const completionItem = new vscode.CompletionItem(
          //   "console.log()",
          //   vscode.CompletionItemKind.Method
          // );
          // completionItem.insertText = new vscode.SnippetString(
          //   "console.log($1);$0"
          // );
          // completionItem.documentation = new vscode.MarkdownString(
          //   "Inserts console.log() statement with cursor inside parentheses"
          // );
          // completionItem.range = new vscode.Range(
          //   position.translate(0, -3),
          //   position
          // ); // 设置光标位置
          // return [completionItem];
        }
        return [];
      },
    })
  );
}

module.exports = {
  activate,
};
