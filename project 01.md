# 任务 0.1: 云服务初始化 - 单颗粒 SOP

**总目标**: 安全、正确地创建并配置 Supabase 和 Vercel 项目，并让 AI 为后续所有步骤生成标准化的环境变量配置，杜绝手动复制粘贴带来的错误。

---

## 🛠️ 第零步：准备环境 (Setup)

### Git 分支
确保您位于项目的主分支上。这是 Sprint 0 的第一个任务，`main` 分支是理想的起点。

### 信息暂存区
在您的本地电脑上，打开一个安全的文本编辑器（如 VS Code, Sublime Text, 或系统自带的记事本），创建一个名为 `secrets.txt` 的临时文件。

**⚠️ 至关重要**: 立即将 `secrets.txt` 添加到项目根目录的 `.gitignore` 文件中，以防止任何意外提交。

### 验证 (Verification)

#### 检查当前分支
在您的项目终端中运行，确认您在 `main` 分支：

```bash
git branch
```
*(预期输出中 `* main` 会被高亮显示)*

#### 检查 .gitignore
确认 `secrets.txt` 已被正确忽略：

```bash
# 在.gitignore文件中添加 'secrets.txt' 这一行，然后运行:
cat .gitignore | grep "secrets.txt"
```
*(预期输出应为 `secrets.txt`)*

## 🎯 第一步：生成 (Generation) - AI 作为"领航员"

**目标**: 由我（AI）为您提供清晰的操作指南和需要收集的信息清单。

### 操作
您已经成功执行了这一步。根据您的指令，我将提供以下三项内容：

### a. Supabase 项目创建指南

1. **访问官网**: 打开浏览器，前往 `supabase.com`
2. **登录并新建项目**: 登录您的账户，点击 "New Project"
3. **组织与命名**: 选择您的组织，并为项目命名，例如 `hajimi-prod`
4. **生成安全密码**: 创建一个强大且安全的数据库密码。建议使用密码管理器生成。请立即将此密码复制到您的 `secrets.txt` 文件中
5. **选择区域**: 按照您的要求，请选择 **Tokyo (ap-northeast-1)**
6. **创建项目**: 点击 "Create new project"，等待项目初始化完成

#### 收集关键信息

- **Host**: 导航到 "Project Settings" (左下角齿轮图标) > "Database" > "Connection info"，复制 Host 的值（例如：`db.abcdefg.supabase.co`）
- **Project ID**: 您的项目 URL 中 `https://app.supabase.com/project/` 后面的部分就是 Project ID（例如：`abcdefg`）
- **API Keys**: 导航到 "Project Settings" > "API"。复制以下两个密钥：
  - `anon public` 密钥 (ANON_KEY)
  - `service_role secret` 密钥 (SERVICE_ROLE_KEY) - **此密钥拥有最高权限，绝不能泄露**
### b. Vercel 项目创建指南

1. **访问官网**: 打开新标签页，前往 `vercel.com`
2. **登录并添加项目**: 登录您的账户，点击 "Add New..." > "Project"
3. **创建占位符**: Vercel 会提示您导入一个 Git 仓库。暂时跳过这一步。现在我们只是创建一个项目占位符，后续再进行关联。您可以选择一个模板或直接关闭此窗口，只要在您的 Vercel 仪表盘能看到一个新的项目即可

### c. 标准环境变量模板 (.env.example)

这是您的项目未来所需的环境变量结构：

```env
# .env.example

# Supabase / Prisma
# 用于后端服务和 Prisma ORM 连接到 Supabase 数据库的连接字符串
# 注意：密码中的特殊字符需要进行 URL 编码
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# Supabase Client (for frontend)
# 这些是公开的变量，用于在 Next.js 前端初始化 Supabase 客户端
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Supabase Admin (optional, for scripts or server-side admin tasks)
# 这是服务角色密钥，拥有完全访问权限。切勿在前端暴露
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```
### 验证 (Verification)

**检查清单**: 请确认您已从我这里清楚地收到了以上 a、b、c 三项完整的指南和模板。
---

## 🔧 第二步：执行与收集 (Manual Execution & Info Gathering)

**目标**: 根据我的指南，完成手动操作，并将所有关键信息安全地收集到您的临时暂存区 `secrets.txt`。

### 执行 Supabase 创建

1. 严格按照 **第一步 a** 的指南完成 Supabase 项目创建
2. 将以下信息准确无误地复制并粘贴到您的 `secrets.txt` 文件中：
   - `[YOUR-PASSWORD]`
   - `[YOUR-HOST]`
   - `[YOUR-PROJECT-ID]`
   - `[YOUR-ANON-KEY]`
   - `[YOUR-SERVICE-ROLE-KEY]`

### 执行 Vercel 创建

按照 **第一步 b** 的指南，在 Vercel 上创建一个项目占位符。

### 验证 (Verification)

#### 检查云服务平台

- 打开 [Supabase Dashboard](https://app.supabase.com/dashboard/projects)，确认能看到名为 `hajimi-prod` 的项目
- 打开 [Vercel Dashboard](https://vercel.com/dashboard)，确认能看到名为 `hajimi-prod` 的项目

#### 检查信息收集情况

在终端中运行以下命令，检查 `secrets.txt` 文件是否包含所有五个关键信息：

```bash
# 注意：此命令会显示您的密钥，请确保环境安全
cat secrets.txt
```
*(预期输出应清晰地展示您从 Supabase 收集的所有五个值)*
---

## 🔍 第三步：审查与生成最终配置 (Review & Finalize Config)

**目标**: 将您收集到的真实密钥交由我填充到标准模板中，生成可直接使用的 `.env` 文件，避免手动拼接和编码错误。

### AI 配置填充

**操作**: 现在，请向我提供您在 `secrets.txt` 中收集的真实信息。请使用以下格式：

```
我已经成功创建了项目，并收集了所有密钥。现在请使用我提供的这些真实信息，帮我生成最终的.env文件内容。请注意，DATABASE_URL需要进行URL编码。

我的信息如下:
- [YOUR-PASSWORD]: p@$$w0rd123!
- [YOUR-HOST]: db.abcdefg.supabase.co
- [YOUR-PROJECT-ID]: abcdefg
- [YOUR-ANON-KEY]: ey... (请粘贴完整的key)
- [YOUR-SERVICE-ROLE-KEY]: ey... (请粘贴完整的key)
```

### AI 生成最终 .env 文件

**操作**: 待您提供信息后，我将返回经过正确 URL 编码的、可直接复制的 `.env` 文件内容。例如：

```env
# .env (由AI生成，已处理编码)

DATABASE_URL="postgresql://postgres:p%40%24%24w0rd123!@db.abcdefg.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://abcdefg.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."
SUPABASE_SERVICE_ROLE_KEY="ey..."
```

### 优化与确认

**操作**: 收到 `.env` 内容后，请对我提出以下要求：

```
这个.env文件看起来很棒。请再帮我生成一个对应的.env.example文件，用于提交到Git仓库。在这个文件里，请把所有真实的密钥替换成占位符，并为每个变量添加一行注释解释它的用途。
```

我将返回您在 **第一步 c** 中已见过的、安全的、带注释的 `.env.example` 文件。

### 验证 (Verification)

- **检查编码**: 对比我生成的 `DATABASE_URL` 和您原始的密码。确认密码中的特殊字符（如 `@`, `$`, `!`）已被替换为百分号编码（如 `%40`, `%24`, `%21`）
- **检查 .env.example 安全性**: 仔细检查我最后生成的 `.env.example` 文件内容，确认其中不包含任何真实的密钥或个人信息，所有敏感值都已被 `[占位符]` 替代

## ✅ 第四步：最终集成 (Final Integration)

**目标**: 将我生成的配置安全地应用到您的本地项目中。

### 文件创建与内容填充

1. 在您本地 `hajimi` 项目的根目录，创建 `.env` 文件，将我生成的包含真实密钥的内容复制进去
2. 在同一目录，创建 `.env.example` 文件，将我生成的不含密钥、带注释的内容复制进去

### 🔒 安全检查

再次打开 `.gitignore` 文件，用肉眼再三确认，里面必须包含 `.env` 这一行。

### 版本控制

将安全的文件添加到 Git 暂存区并提交。

### 清理

立即从您的电脑上彻底删除 `secrets.txt` 文件。

### 验证 (Verification)

#### 验证 .gitignore 规则
在项目根目录运行此命令：

```bash
cat .gitignore | grep ".env"
```
*(预期输出必须是 `.env`，确认该文件被忽略)*

#### 验证 Git 状态
运行 `git status`，这是最关键的验证：

```bash
git status
```
*(预期输出应该在 "Changes to be committed" 或 "Untracked files" 中看到 `.env.example` 和 `.gitignore`，但**绝对不能看到 `.env` 文件**。如果看到 `.env`，说明 `.gitignore` 配置有误，切勿提交！)*

#### 提交安全文件

```bash
git add .env.example .gitignore
git commit -m "chore: setup environment variables (Task 0.1)"
```

#### 验证清理
确认临时密钥文件已被删除：

```bash
ls secrets.txt
```
*(预期输出应该是错误消息，如 "ls: cannot access 'secrets.txt': No such file or directory"，证明文件已不存在)*

---

## 🎉 颗粒关闭

**操作**: 在您的项目管理工具中，将任务 0.1 标记为"完成"。

### 总结

通过这个增强版的 SOP，您不仅完成了手动创建工作，还利用 AI：

- ✅ **标准化了流程**，确保没有遗漏
- ✅ **自动生成了配置**，避免了手动拼接 URL 和忘记编码等常见错误
- ✅ **创建了安全的模板文件**，建立了良好的工程实践
- ✅ **通过明确的验证命令**，在每个关键节点确认了操作的正确性和安全性