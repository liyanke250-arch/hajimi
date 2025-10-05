# 📋 任务 0.2: 本地项目初始化 - 单颗粒 SOP

## 🎯 总目标

使用官方脚手架 `create-next-app` 创建一个全新的、配置统一的 Next.js 项目，并完成 Git 仓库的初始化，为后续开发建立一个干净的起点。

---

## 🚀 第一步：创建 Next.js 项目 (Project Scaffolding)

### 📍 目标

在本地 hajimi 目录中，生成符合技术栈要求的 Next.js 项目文件结构。

### 🔧 操作步骤

#### 1. 定位目录

打开您的终端（例如 PowerShell, Terminal, or VS Code's integrated terminal），并确保您位于 hajimi 项目的根目录中。

```shell
# 示例路径
cd D:\360MoveData\Users\Administrator\Desktop\hajimi
```

#### 2. 执行脚手架命令

运行以下命令来创建项目。注意末尾的 `.` 表示在当前目录下创建，而不是新建一个子目录。

```shell
npx create-next-app@latest .
```

#### 3. 配置选项

命令运行后，会出现一系列交互式提问。请严格按照以下选项进行选择，以确保项目统一性：

- `Would you like to use TypeScript?` › **Yes**
- `Would you like to use ESLint?` › **Yes**
- `Would you like to use Tailwind CSS?` › **Yes**
- `Would you like to use 'src/' directory?` › **Yes**
- `Would you like to use App Router? (recommended)` › **Yes**
- `Would you like to customize the default import alias (@/*)?` › **No**

> 脚手架会自动创建所有必要的文件并安装依赖包。

### 验证 (Verification)

#### 检查核心文件是否存在

运行以下命令，检查项目结构是否正确生成。

```shell
# 对于 PowerShell
ls

# 对于 macOS/Linux
ls -a
```

**预期输出应包含以下关键文件和目录：**

- `src/`
- `app/`
- `node_modules/`
- `package.json`
- `tailwind.config.ts`
- `next.config.mjs`

#### 检查 package.json 中的脚本

查看 `package.json` 文件，确认启动脚本已就绪。

```shell
cat package.json | findstr "\"dev\""
# 或 grep "\"dev\"" package.json 在 macOS/Linux
```

**预期输出应包含：** `"dev": "next dev"`

---

## 第二步：初始化 Git 仓库 (Git Initialization)

### 目标

将项目文件夹初始化为 Git 仓库，并建立第一个 commit，为版本控制打下基础。

### 检查 Git 状态

`create-next-app` 最新版通常会自动为您初始化 Git 仓库并创建初次提交。首先运行 `git status` 来确认这一点。

```shell
git status
```

- 如果输出是 `"On branch main nothing to commit, working tree clean"`，说明已自动完成，您可以直接跳到本步骤的验证环节。
- 如果输出是 `"fatal: not a git repository..."`，请按下面的手动操作步骤。

### 手动初始化 (如果需要)

#### a. 初始化仓库

```shell
git init
```

#### b. 设置默认分支为 main

```shell
git branch -M main
```

#### c. 添加所有文件并进行初次提交

```shell
git add .
git commit -m "feat: initial commit from create-next-app"
```

### 验证 (Verification)

#### 确认 Git 仓库已存在

检查隐藏的 `.git` 目录是否存在。

```shell
# 对于 PowerShell
ls -Force | findstr "\.git"

# 对于 macOS/Linux
ls -a | grep "\.git"
```

**预期输出：** `.git`

#### 检查当前分支

确认您在 `main` 分支上。

```shell
git branch
```

**预期输出：** `* main`

#### 检查提交历史

确认初次提交已成功创建。

```shell
git log -1
```

**预期输出：** 应显示一个 commit 记录，其消息类似于 `"initial commit from create-next-app"`

---

## 第三步：启动开发服务器 (Run Development Server)

### 目标

运行项目，验证 Next.js 应用能够成功在本地启动，满足验收标准。

### 执行启动命令

在终端中运行开发脚本。

```shell
npm run dev
```

### 验证 (Verification)

#### 检查终端输出

观察终端的输出信息。

**预期输出应包含以下关键信息：**

```
 Ready in X.XXs
- Local:        http://localhost:3000
```

#### 命令行服务检查 (可选)

在新的终端窗口中运行 `curl` 命令，检查服务是否在端口 3000 上正常响应。

```shell
curl -I http://localhost:3000
```

**预期输出：** 第一行应为 `HTTP/1.1 200 OK`，这证明服务器已成功启动并正在监听请求。

#### 浏览器检查 (最终验收)

1. 打开您的网页浏览器
2. 访问 URL: `http://localhost:3000`
3. 您应该能清楚地看到 Next.js 的默认欢迎页面

---

## 任务完成

### 操作

在您的项目管理工具中，将任务 0.2 标记为 **"完成"**。

---

## 📊 任务状态

| 任务编号 |      任务名称      |     状态      |
| :------: | :----------------: | :-----------: |
|   0.1    |  云服务初始化 SOP  | ✅ **已完成** |
|   0.2    | 本地项目初始化 SOP | ✅ **已完成** |
