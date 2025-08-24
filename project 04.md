# 🚀 任务 0.4: 自动化部署 (CI/CD) - 单颗粒 SOP

## 🎯 总目标
将本地的 Git 仓库与 GitHub 和 Vercel 平台连接，配置好生产环境变量，并建立一个完整的自动化部署流水线（CI/CD）。最终实现的效果是：每当您推送代码到 GitHub 的 main 分支，Vercel 都会自动拉取最新代码、构建并部署您的项目。

## ⚠️ 前置条件
- 您已拥有一个 GitHub 账户
- 您的本地项目已经是一个功能完备的 Git 仓库（任务 0.2 已完成）
- 您已在 Vercel 上创建了一个项目占位符（任务 0.1 已完成）

---
## 📦 第一步：创建 GitHub 仓库并推送本地代码 (Code Hosting)

### 📍 目标
将您本地的代码库推送到一个远程的、私有的 GitHub 仓库中，使其成为代码的"唯一真实来源"(Single Source of Truth)。

### 🔧 在 GitHub 上创建仓库

1. 打开浏览器，登录 [github.com](https://github.com)
2. 点击右上角的 **+** 号，选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `hajimi`
   - **Description** (可选): `My first project with Next.js, Supabase, and Prisma.`
   - **选择 Private**: ⚠️ 这一点至关重要，因为您的代码未来可能会包含敏感的业务逻辑，不应公开
   - **不要勾选** 初始化任何文件（如 README, .gitignore），因为您的本地项目已经有了这些
4. 点击 **"Create repository"**

### 🔗 关联远程仓库并推送代码

GitHub 会展示一个页面，上面有 **"…or push an existing repository from the command line"** 的指引。请复制这些命令并在您本地项目的终端中执行：

```shell
# 1. 将您本地的Git仓库与刚刚创建的GitHub远程仓库进行关联
# 'origin' 是远程仓库的默认别名
git remote add origin https://github.com/[你的GitHub用户名]/hajimi.git

# 2. (可选，最佳实践) 确保您的主分支名为 'main'
git branch -M main

# 3. 将本地的 'main' 分支推送到远程的 'origin' 仓库
# '-u' 参数会建立本地分支与远程分支的追踪关系，方便未来直接使用 'git push'
git push -u origin main
```
### ✅ 验证 (Verification)

#### 检查远程关联是否成功
在终端运行以下命令：

```shell
git remote -v
```

**预期输出应显示两行**（fetch和push），都指向您刚刚创建的GitHub仓库地址：

```
origin  https://github.com/[你的GitHub用户名]/hajimi.git (fetch)
origin  https://github.com/[你的GitHub用户名]/hajimi.git (push)
```
#### 检查代码是否推送成功
刷新您在浏览器中打开的 GitHub 仓库页面。您应该能看到您本地项目的所有文件（如 `package.json`, `src/`, `prisma/` 等）都已显示在页面上。

---

## 🔗 第二步：将 Vercel 项目连接到 GitHub 仓库 (Platform Integration)

### 📍 目标
授权 Vercel 访问您的 GitHub 仓库，这样 Vercel 才能在您推送代码时收到通知并自动拉取。

### 🔧 登录 Vercel 并进入项目设置

1. 打开 [vercel.com](https://vercel.com) 并登录
2. 在您的 Dashboard 中，找到之前创建的 `hajimi` 项目并点击进入
3. 导航到 **"Settings"** → **"Git"**

### 🔗 连接 Git 仓库

1. 您会看到一个 **"Connect a Git Repository"** 的区域，点击 **"Connect"**
2. Vercel 会要求您授权访问 GitHub。按照弹出的窗口指引，授权 Vercel 访问您所有的仓库或仅访问 `hajimi` 仓库
3. 授权后，在列表中找到 `hajimi` 仓库并点击 **"Import"**
4. Vercel 会自动识别出这是一个 Next.js 项目，并显示构建设置。保持所有默认设置不变，直接点击 **"Deploy"**

> ⚠️ **注意**: 第一次连接时，Vercel 会立即触发一次部署。这次部署很可能会因为缺少环境变量而失败或运行异常，这是完全正常的。我们的下一步就是修复它。

### ✅ 验证 (Verification)

**检查 Vercel Git 设置**: 在 Vercel 项目的 **"Settings"** → **"Git"** 页面，您应该能看到 **"Connected Git Repository"** 部分现在显示的是您 GitHub 仓库的名称 `[你的GitHub用户名]/hajimi`，并且生产分支已设置为 `main`。

---
## ⚙️ 第三步：在 Vercel 中配置生产环境变量 (Configuration)

### 📍 目标
将所有连接 Supabase 所需的密钥和 URL 安全地配置到 Vercel 的环境变量中。这将允许您部署在 Vercel 上的应用能够成功连接到您的云端 Supabase 数据库。

### 🔧 进入 Vercel 环境变量设置

在您的 Vercel `hajimi` 项目页面，导航到 **"Settings"** → **"Environment Variables"**。

### 📝 添加环境变量

从您本地的 `.env` 文件中，逐一复制以下变量的**键 (Key) 和值 (Value)**并添加到 Vercel 中。请务必仔细核对，确保使用了正确的值！

| 键 (Key) | 值 (Value) - 从您的 .env 文件复制 | 注释 (Comment) |
|:---|:---|:---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@[host]:6543/postgres?pgbouncer=true` | ⚠️ **至关重要**: Vercel在IPv4网络运行，必须使用端口为6543的连接池URL！ |
| `DIRECT_URL` | `postgresql://postgres:[pass]@[host]:5432/postgres` | 虽然应用运行时不用，但为未来在Vercel构建步骤中运行迁移做准备，必须使用端口为5432的直连URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[ref].supabase.co` | 您的Supabase项目公开URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `ey...` | 您的Supabase项目公开anon密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | `ey...` | ⚠️ **机密**: 您的Supabase service_role 密钥，绝不能暴露 |
| `NEXTAUTH_URL` | `https://[您的Vercel项目域名]` | **注意**: 这里不再是localhost，而是Vercel为您生成的生产域名 (例如: hajimi.vercel.app) |
| `NEXTAUTH_SECRET` | `[您生成的随机密钥]` | 您为NextAuth生成的安全密钥 |

### ✅ 验证 (Verification)

**检查 Vercel 环境变量列表**: 在 Vercel 的 **"Environment Variables"** 页面，请仔细核对您添加的所有变量的键名是否存在拼写错误，以及值的开头和结尾是否与您的 `.env` 文件完全一致。

---
## 🧪 第四步：触发自动部署并最终验收 (CI/CD Test & Acceptance)

### 📍 目标
通过一次真实的 Git 推送，验证整个 CI/CD 流水线是否能按预期工作，并最终通过公共域名访问您的应用。

### 🔧 在本地做一次小修改

1. 打开您本地项目的 `src/app/page.tsx` 文件
2. 修改文件中的一小段文本，以便我们能直观地看到部署是否成功。例如，将主标题修改一下：

```tsx
// src/app/page.tsx
// ...
<h1 className="text-4xl font-bold text-center sm:text-left">
  欢迎来到 Hajimi on Vercel!
</h1>
// ...
```

### 📤 提交并推送到 GitHub

```shell
# 将所有修改添加到暂存区
git add .

# 创建一个描述性的提交
git commit -m "chore: test vercel auto-deployment"

# 推送到main分支
git push origin main

```

### ✅ 验证 (Verification)

#### 检查 Vercel 自动构建 (验收标准1)

1. 推送成功后，立即回到您在 Vercel 的项目仪表盘，并点击 **"Deployments"** 标签页
2. 您应该能看到一个新的部署任务出现在列表顶部，其状态为 **"Building"** 或 **"Queued"**，并且提交信息正是您刚刚写的 `"chore: test vercel auto-deployment"`
3. 这证明 Vercel 已成功接收到 GitHub 的推送通知并自动开始了构建

#### 检查线上应用 (验收标准2)

1. 等待部署状态变为绿色的 **"Ready"**
2. 点击部署记录旁边的 **"Visit"** 按钮，或者直接在浏览器中访问您的 Vercel 域名 (例如 `https://hajimi.vercel.app`)
3. 您应该能清楚地看到您刚刚修改后的欢迎页面，显示 **"欢迎来到 Hajimi on Vercel!"**
4. 这证明了整个 CI/CD 流程已成功打通！

---

## 🎉 任务完成

### 📝 操作
在您的项目管理工具中，将任务 0.4 标记为 **"完成"**。

---

## 📊 任务状态

| 任务编号 | 任务名称 | 状态 |
|:---:|:---:|:---:|
| 0.1 | 云服务初始化 SOP | ✅ **已完成** |
| 0.2 | 本地项目初始化 SOP | ✅ **已完成** |
| 0.3 | 集成 Prisma SOP | ✅ **已完成** |
| 0.4 | 自动化部署 (CI/CD) SOP | 🔄 **进行中** |

---

*此文档随项目开发持续更新*