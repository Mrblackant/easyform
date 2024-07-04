const vscode = require("vscode");

/**
 * 激活扩展程序时执行的函数。
 *
 * @param {vscode.ExtensionContext} context 扩展程序的上下文对象
 */
function activate(context) {
  // 注册一个命令，当命令被执行时触发
  let disposable = vscode.commands.registerCommand(
    "mockform.generateFormInitialValues",
    async function () {
      // 获取当前活动的编辑器
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // 获取当前文档
        const document = editor.document;
        // 获取当前选中文本的位置
        const selection = editor.selection;
        // 获取选中文本的内容
        const selectedText = document.getText(selection);

        // 使用正则表达式解析表单代码并生成初始值
        const formRegex = /(?::model|v-model)="(\w+)"/;
        const vModelRegex = /<(el-\w+)[^>]*(?:v-model|:model)="(\w+)\.(\w+)"/g;

        const formMatch = formRegex.exec(selectedText);
        if (!formMatch) {
          vscode.window.showErrorMessage("未找到表单的:model或v-model属性");
          return;
        }

        // 提取表单的名称（即:model属性的值）
        const formName = formMatch[1];
        let match;
        const formFields = [];
        // 遍历匹配到的所有v-model或:model属性
        while ((match = vModelRegex.exec(selectedText)) !== null) {
          // 匹配到的组件类型（如el-input, el-select等）
          const componentType = match[1];
          // 绑定的表单项字段名
          const fieldName = match[3];
          let initialValue;

          // 根据组件类型确定初始值
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
              initialValue = "null";
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

          // 将字段名及其初始值添加到表单字段数组中
          formFields.push({ fieldName, initialValue });
        }

        if (formFields.length > 0) {
          // 生成最终的表单初始值字符串
          const formInitialValues = `${formName}: {\n${formFields
            .map((field) => `  ${field.fieldName}: ${field.initialValue}`)
            .join(",\n")}\n}`;
          // 将生成的初始值字符串复制到剪贴板
          await vscode.env.clipboard.writeText(formInitialValues);
          // 显示信息提示，表单初始值已复制到剪贴板
          vscode.window.showInformationMessage("表单初始值已复制到剪贴板");
        } else {
          // 如果没有找到表单项的v-model或:model绑定属性，则显示错误消息
          vscode.window.showErrorMessage(
            "未找到表单项的:model或v-model绑定属性"
          );
        }
      }
    }
  );

  // 将命令注册到扩展程序的订阅中
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
