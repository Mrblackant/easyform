const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "mockform.generateFormInitialValues",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);

        // 使用正则表达式解析表单代码并生成初始值
        const formRegex = /:model="(\w+)"/;
        const vModelRegex = /<(el-\w+)[^>]*v-model="\w+\.(\w+)"/g;

        const formMatch = formRegex.exec(selectedText);
        if (!formMatch) {
          vscode.window.showErrorMessage("未找到表单的:model属性");
          return;
        }

        const formName = formMatch[1];
        let match;
        const formFields = [];
        while ((match = vModelRegex.exec(selectedText)) !== null) {
          const componentType = match[1];
          const fieldName = match[2];
          let initialValue;

          switch (componentType) {
            case "el-radio":
            case "el-radio-group":
              initialValue = "''";
              break;
            case "el-checkbox":
            case "el-checkbox-group":
              initialValue = "[]";
              break;
            case "el-input":
              initialValue = "''";
              break;
            case "el-input-number":
              initialValue = "0";
              break;
            case "el-select":
              initialValue = "''";
              break;
            case "el-cascader":
              initialValue = "[]";
              break;
            case "el-switch":
              initialValue = "false";
              break;
            case "el-slider":
              initialValue = "0";
              break;
            case "el-time-picker":
              initialValue = "''";
              break;
            case "el-date-picker":
            case "el-date-time-picker":
              initialValue = "''";
              break;
            case "el-upload":
              initialValue = "[]";
              break;
            case "el-rate":
              initialValue = "0";
              break;
            case "el-color-picker":
              initialValue = "''";
              break;
            case "el-transfer":
              initialValue = "[]";
              break;
            default:
              initialValue = "''";
          }

          formFields.push({ fieldName, initialValue });
        }

        if (formFields.length > 0) {
          const formInitialValues = `${formName}: {\n${formFields
            .map((field) => `  ${field.fieldName}: ${field.initialValue}`)
            .join(",\n")}\n}`;
          await vscode.env.clipboard.writeText(formInitialValues);
          vscode.window.showInformationMessage("表单初始值已复制到剪贴板");
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
