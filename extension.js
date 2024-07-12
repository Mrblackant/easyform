const vscode = require("vscode");

/**
 * 激活扩展程序时执行的函数。
 *
 * @param {vscode.ExtensionContext} context 扩展程序的上下文对象
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "easyform",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);

        // 使用正则表达式解析表单代码并生成初始值
        const formRegex = /<el-form[^>]*:(model|v-model)="(\w+)"/g;
        const vModelRegex = /<(el-\w+)[^>]*(?:v-model|:model)="(\w+)\.(\w+)"/g;

        let formMatch;
        const forms = [];

        // 匹配所有的表单
        while ((formMatch = formRegex.exec(selectedText)) !== null) {
          const formTagStartIndex = formMatch.index;
          const formTagEndIndex =
            selectedText.indexOf("</el-form>", formTagStartIndex) + 10;
          const formContent = selectedText.slice(
            formTagStartIndex,
            formTagEndIndex
          );

          const formName = formMatch[2];
          let match;
          const formFields = [];

          // 匹配表单中的所有字段
          while ((match = vModelRegex.exec(formContent)) !== null) {
            const componentType = match[1];
            const fieldName = match[3];
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
            forms.push({ formName, formFields });
          }
        }

        if (forms.length > 0) {
          const formInitialValues = forms
            .map((form) => {
              const fields = form.formFields
                .map((field) => `  ${field.fieldName}: ${field.initialValue}`)
                .join(",\n");
              return `${form.formName}: {\n${fields}\n}`;
            })
            .join(",\n\n");

          await vscode.env.clipboard.writeText(formInitialValues);
          vscode.window.showInformationMessage("表单初始值已复制到剪贴板");
        } else {
          vscode.window.showErrorMessage(
            "未找到任何表单或表单项的:model或v-model绑定属性"
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * 当扩展程序停用时执行的函数。
 */
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
