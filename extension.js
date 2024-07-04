const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
console.log("111111111");
function activate(context) {
  console.log("111111111");
  let disposable = vscode.commands.registerCommand(
    "mockform.generateFormInitialValues",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);

        // 使用正则表达式解析表单代码并生成初始值
        const formRegex = /:model="(\w+)"/;
        const vModelRegex = /v-model="\w+\.(\w+)"/g;

        const formMatch = formRegex.exec(selectedText);
        if (!formMatch) {
          vscode.window.showErrorMessage("未找到表单的:model属性");
          return;
        }

        const formName = formMatch[1];
        let match;
        const formFields = [];
        while ((match = vModelRegex.exec(selectedText)) !== null) {
          formFields.push(match[1]);
        }

        if (formFields.length > 0) {
          const formInitialValues = `${formName}: {\n${formFields
            .map((field) => `  ${field}: ''`)
            .join(",\n")}\n}`;
          editor.edit((editBuilder) => {
            editBuilder.insert(
              new vscode.Position(editor.selection.start.line, 0),
              formInitialValues + "\n"
            );
          });
        } else {
          vscode.window.showErrorMessage("未找到表单项的v-model绑定属性");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
