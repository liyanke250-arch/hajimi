# 🗄️ 任务 0.3: 集成 Prisma - 单颗粒 SOP

## 🎯 总目标
将 Prisma ORM 集成到现有的 Next.js 项目中，配置好数据库连接，定义初始数据模型，并成功执行第一次数据库迁移，为后端数据操作打下坚实基础。

## ⚠️ 前置条件
您必须已完成任务 0.1，并拥有一个包含真实、有效的 `DATABASE_URL` 的 `.env` 文件。

---

## 📦 第一步：安装并初始化 Prisma (Installation & Initialization)

### 📍 目标
在项目中添加 Prisma 作为开发依赖，并创建其核心配置文件。

### 🔧 执行安装与初始化命令
在您的项目根目录终端中，运行以下复合命令。它会先安装 Prisma CLI，然后立即运行初始化脚本。

```shell
npm install prisma --save-dev && npx prisma init
```

**命令说明：**
- `npm install prisma --save-dev`: 将 Prisma 库添加到项目的 `devDependencies` 中，因为它主要用于开发和构建阶段
- `npx prisma init`: 此命令会创建 `prisma` 文件夹以及其中的 `schema.prisma` 文件，并自动在 `.env` 文件中添加 `DATABASE_URL` 的占位符（如果文件或变量不存在）

### ✅ 验证 (Verification)

#### 检查依赖安装
确认 Prisma 已添加到 `package.json`。

```shell
# 在 PowerShell 中
cat package.json | findstr "prisma"

# 在 macOS/Linux 中
cat package.json | grep "prisma"
```

**预期输出应包含：** `"prisma": "^5..."` 这样一行，显示 Prisma 的版本号

#### 检查配置文件创建
确认 `prisma` 目录和 `schema.prisma` 文件已生成。

```shell
# 在 PowerShell 中
ls prisma

# 在 macOS/Linux 中
ls prisma
```

**预期输出应为：** `schema.prisma`

---

## 🔗 第二步：配置数据库连接 (Database Connection Configuration)

### 📍 目标
将您在任务 0.1 中获得的 Supabase 数据库连接字符串配置到项目中，让 Prisma 能够访问数据库。

### 🔧 操作步骤

#### 1. 确认 .env 文件
打开项目根目录下的 `.env` 文件。

#### 2. 配置 DATABASE_URL
确保文件中的 `DATABASE_URL` 变量的值，是您在任务 0.1 中由 AI 生成的、经过 URL 编码的完整连接字符串。

```env
# .env

# 这是从任务0.1中获取的、包含真实密码且已编码的连接字符串
DATABASE_URL="postgresql://postgres:[你的URL编码后的密码]@[你的HOST]:5432/postgres"

# ... 其他变量
```

### ✅ 验证 (Verification)

#### 检查变量是否存在
运行此命令确认 `.env` 文件中确实包含了 `DATABASE_URL` 这一行。

```shell
# 在 PowerShell 中
cat .env | findstr "DATABASE_URL"

# 在 macOS/Linux 中
cat .env | grep "DATABASE_URL"
```

**预期输出应显示：** `DATABASE_URL=...` 这一整行。这可以验证配置存在，而不会在终端历史中暴露完整的密码

---

## 📋 第三步：定义初始数据模型 (Data Modeling)

### 📍 目标
在 `schema.prisma` 文件中定义第一个数据模型（例如 User），这将作为数据库表的蓝图。

### 🔧 操作步骤

#### 1. 编辑 Schema 文件
打开 `prisma/schema.prisma` 文件。

#### 2. 替换文件内容
将文件内容完全替换为以下代码。我们明确指定了数据源，并定义了一个简单的 User 模型。

```prisma
// prisma/schema.prisma

// 1. 定义数据源 (Datasource)
//    - 'db' 是数据源的名称。
//    - 'provider' 指定我们使用的是 PostgreSQL 数据库。
//    - 'url' 指示Prisma从环境变量 .env 文件中加载名为 "DATABASE_URL" 的值。
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 2. 定义Prisma客户端生成器 (Generator)
//    - 'client' 是生成器的名称。
//    - 'provider' 指定我们要生成 JavaScript/TypeScript 版本的Prisma客户端。
generator client {
  provider = "prisma-client-js"
}

// 3. 定义数据模型 (Model)
//    - 'model User' 将会映射到数据库中一个名为 'User' 的表。
model User {
  // 字段名   类型      属性/约束
  
  // 'id' 字段是字符串类型，并被设置为主键(@id)。
  // @default(cuid()) 会在创建新记录时自动生成一个唯一的ID。
  id        String   @id @default(cuid())
  
  // 'email' 字段是字符串类型，并且在表中必须是唯一的(@unique)。
  email     String   @unique
  
  // 'name' 字段是字符串类型，但它是可选的(?)，意味着可以为null。
  name      String?
  
  // 'createdAt' 字段是日期时间类型。
  // @default(now()) 会在记录创建时自动设置为当前时间。
  createdAt DateTime @default(now())
  
  // 'updatedAt' 字段是日期时间类型。
  // @updatedAt 会在记录每次被更新时自动更新为当前时间。
  updatedAt DateTime @updatedAt
}
```

### ✅ 验证 (Verification)

#### 格式化并验证 Schema
运行 Prisma 的内置命令来检查您的 `schema.prisma` 文件是否有语法错误。

```shell
npx prisma format
```

**预期输出应为：** `Prisma schema formatted successfully.` 这证明您的模型定义是有效且格式正确的

---

## 🚀 第四步：执行数据库迁移与客户端生成 (Migration & Generation)

### 📍 目标
将您在 `schema.prisma` 中定义的 User 模型应用到远程 Supabase 数据库中，创建实际的 User 表，并生成可在代码中使用的 Prisma 客户端。

### 🔧 运行迁移命令
执行 `migrate dev` 命令。Prisma 会：
- 比较您的 Prisma schema 与数据库的当前状态
- 生成一个 SQL 迁移文件来弥补差异（即创建 User 表）
- 将此 SQL 应用到您的 Supabase 数据库
- 自动运行 `prisma generate`

```shell
npx prisma migrate dev --name init
```

**参数说明：**
- `--name init`: 为这次迁移指定一个描述性的名称，例如 "init"

### ✅ 验证 (Verification)

#### 检查本地迁移文件
确认迁移文件已在本地成功创建。

```shell
# 在 PowerShell 中
ls prisma/migrations

# 在 macOS/Linux 中
ls prisma/migrations
```

**预期输出应为：** 一个新的文件夹，其名称类似 `20250824080200_init`，包含了时间戳和您指定的名称

#### 检查 Prisma 客户端生成
确认 `prisma generate` 已成功运行并生成了客户端。

```shell
# 在 PowerShell 中
ls node_modules/@prisma/client

# 在 macOS/Linux 中
ls node_modules/@prisma/client
```

**预期输出应包含：** `index.d.ts`, `package.json` 等文件，证明 Prisma 客户端已成功生成或更新

#### 检查 Supabase 数据库 (最终验收标准)
1. 打开浏览器，登录您的 Supabase 账户
2. 进入 `hajimi-prod` 项目
3. 在左侧导航栏点击 **Table Editor** (表格编辑器) 图标
4. 您应该能清楚地看到一个名为 **User** 的新表，其列（`id`, `email`, `name`, `createdAt`, `updatedAt`）与您在 `schema.prisma` 中定义的完全一致

---

## 🎉 任务完成

### 📝 操作
在您的项目管理工具中，将任务 0.3 标记为 **"完成"**。

---

## 📊 任务状态

| 任务编号 | 任务名称 | 状态 |
|:---:|:---:|:---:|
| 0.1 | 云服务初始化 SOP | ✅ **已完成** |
| 0.2 | 本地项目初始化 SOP | ✅ **已完成** |
| 0.3 | 集成 Prisma SOP | ✅ **已完成** |