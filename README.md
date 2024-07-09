# easyform VSCode 插件

快速生成 elementui 表单配置项插件

## 如何安装

- vscode 拓展市场搜索`easyform`,安装

## 如何使用

- 选中 el-form 区域,ctrl+shfit+p,输入 easyform,回车后结果会复制到剪贴板

![alt desc1](https://i0.hdslb.com/bfs/article/7bac2155fd4055b06ac100229eb3867f424199394.gif)

##

---

The following is the extensions project complete project, for developers to refer to [Github Code](https://github.com/Mrblackant/easyform)

##

---

## 以下是插件工程完整项目,供发者参考，[项目代码戳这里 Github](https://github.com/Mrblackant/easyform)

---

### 1.创建项目

1. 安装 Yeoman 工具集
   `npm install -g yo`
   ```
   Yeoman 是通用型项目脚手架工具，可以根据一套模板，生成一个对应的项目结构
   ```
2. 安装 `generator-code` 模块
   `npm install -g generator-code`

   ```
   generator-code 模块是 VS Code 扩展生成器，与 yo 配合能构建 VsCode 插件项目
   ```

3. 运行`yo code`创建项目
   - 选择 New Extension(JavaScript)
   - 输入项目名称 `easyform`
   - 输入项目 ID `easyform`
   - 输入项目描述 `根据elementUi表单，动态生成form初始化配置`

```
? What type of extension do you want to create? New Extension (JavaScript)
? What's the name of your extension? easyform
? What's the identifier of your extension? easyform
? What's the description of your extension? 根据elementUi表单，动态生成form初始化配置
? Enable JavaScript type checking in 'jsconfig.json'? Yes
? Initialize a git repository? Yes
? Which package manager to use? npm
```

### 2.代码

1. 码代码

- extension.js 代码入口,激活插件
- example.js 注册 `example` 命令，打开文件 example.md 文件

2. 配置 `package.json`

- main 字段修改入口
  ```
  "main": "./extension.js",
  ```
- `contributes` 字段设置命令 `easyform`

  ```
  "commands": [
      {
        "command": "easyform",
        "title": "生成form表单初始配置"
      }
    ]
  ```

- vscode 输入命令后启动

```
   "activationEvents": [
    "onCommand:easyform"
  ],
```

### 3. 测试项目

1. 安装全部依赖
   npm install

2. vscode 界面按 fn+f5，会弹出的 vscode 窗口，在新窗口中测试。

- 打开.vue 文件，选中`<el-form>...</el-form>`区域
- ctrl+shift+p: 命令行输入 `easyform`
- ctrl+v 粘贴到 data(){}内

### 4. 打包

[vscode 打包官网 API](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

[logo 生成(自行百度即可)](https://www.shejilogo.com/)

1.  准备工作

- `package.json`，设置项目发行者和图标

  ```
  "publisher": "mrant",
  "icon": "easyform.png"
  ```

- 安装 vsce
  `npm install -g vsce`
  ```
  vsce 是 "Visual Studio Code Extensions "的缩写，是用于打包、发布和管理 VS Code 插件的命令行工具。
  ```

2. 打包
   - 执行命令 `vsce package`
   - 项目根目录出现插件安装文件 `easyform-0.0.1.vsix`

```
  注：
    1. 必需修改 README.md 文件后才允许打包
    2. xxx.vsix文件直接拖到extensions tab下可以完成本地安装
```

### 5. 发布

1.  创建 publisher

- 登录 [Extensions for Visual Studio](https://marketplace.visualstudio.com/) -> Publish extensions -> Create publiser

- 输入 Name 和 ID，Logo, 点击 Create 按钮
  ```
    Name：mrant
    ID：mrant
  ```

2. 手动发布方式：管理平台手动发布

- [Extensions for Visual Studio](https://marketplace.visualstudio.com/) -> Publish extensions -> +New ezxtension -> Visual Studio Code -> 上传 `easyform-0.0.1.vsix` 文件

3. 自动发布方式：vsce 命令直接发布

- 创建 Token
  [azure DevOps](https://dev.azure.com/) -> User settings -> Personal Access Tokens

  ```
  Name: easyform
  Organization: mrant
  Expiration: 30 days
  Scopes: Full access
  ```

- 终端 vsce 登录验证

  ```
  vsce login mrant
  输入前面创建的 Personal Access Tokens
  ```

- 执行发布
  `vsce publish`

## Reference

- [vscode 插件开发，官方 API](https://code.visualstudio.com/api/get-started/your-first-extension)
- [vscode 插件开发，中文 API](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/get-started/your-first-extension)
- [github 参考:markdownexample](https://github.com/crazy-luke/markdownexample)
