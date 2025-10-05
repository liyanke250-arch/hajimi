# 🔧 环境配置完整指南

**创建时间**: 2025-10-05  
**适用对象**: 编程小白  
**目标**: 配置开发和生产环境分离

---

## 🎯 为什么需要两个数据库？

### 开发数据库 (hajimi-dev)
- ✅ 用于测试和实验
- ✅ 可以随意删除和重建
- ✅ 不影响真实用户数据
- ✅ 导入脚本先在这里测试

### 生产数据库 (hajimi-prod)
- ✅ 存放正式数据
- ✅ 用户访问的真实数据
- ✅ 严格保护，不能乱改
- ✅ 测试通过后才导入

### 类比理解

```
就像写文章：
草稿本 (dev) → 随便涂改，不怕出错
正式稿 (prod) → 最终版本，给别人看的
```

---

## 📋 完整配置步骤

### 步骤 1: 在 Supabase 创建开发数据库

#### 1.1 登录 Supabase

访问: https://supabase.com/dashboard

#### 1.2 创建新项目

```
点击 "New Project"

项目名称: hajimi-dev
组织: [选择您的组织]
数据库密码: [生成强密码，保存到密码管理器]
区域: Tokyo (ap-northeast-1)

点击 "Create new project"
等待 2-3 分钟初始化完成
```

#### 1.3 获取连接信息

```
进入项目后:

1. 点击左侧 "Project Settings" (齿轮图标)
2. 点击 "Database"
3. 找到 "Connection string"
   - Host: db.xxxxx.supabase.co
   - Database name: postgres
   - Port: 5432
   - User: postgres

4. 点击 "API"
   - Project URL: https://xxxxx.supabase.co
   - anon public key: eyJ...
   - service_role key: eyJ...
```

#### 1.4 保存信息

创建临时文件 `secrets-dev.txt`（记得加到 .gitignore）：

```
DEV-PASSWORD: [您的开发数据库密码]
DEV-HOST: db.xxxxx.supabase.co
DEV-PROJECT-ID: xxxxx
DEV-ANON-KEY: eyJ...
DEV-SERVICE-ROLE-KEY: eyJ...
```

---

### 步骤 2: 创建环境配置文件

#### 2.1 创建 .env.development

在项目根目录创建 `.env.development` 文件：

```env
NODE_ENV="development"

# 开发数据库
DATABASE_URL="postgresql://postgres:[DEV-PASSWORD]@[DEV-HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[DEV-PASSWORD]@[DEV-HOST]:5432/postgres"

# Supabase 开发环境
NEXT_PUBLIC_SUPABASE_URL="https://[DEV-PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[DEV-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[DEV-SERVICE-ROLE-KEY]"

# 本地配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
```

#### 2.2 创建 .env.production（生产环境）

```env
NODE_ENV="production"

# 生产数据库
DATABASE_URL="postgresql://postgres:[PROD-PASSWORD]@[PROD-HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PROD-PASSWORD]@[PROD-HOST]:5432/postgres"

# Supabase 生产环境
NEXT_PUBLIC_SUPABASE_URL="https://[PROD-PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[PROD-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[PROD-SERVICE-ROLE-KEY]"

# 生产配置
NEXTAUTH_URL="https://hajimi.vercel.app"
NEXTAUTH_SECRET="[PROD-SECRET]"
```

#### 2.3 更新 .gitignore

确保环境文件不被提交：

```
.env
.env.local
.env.development
.env.production
.env*.local
secrets-dev.txt
secrets-prod.txt
```

---

### 步骤 3: 配置环境切换

#### 3.1 更新 package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:prod": "NODE_ENV=production next dev",
    "build": "next build",
    "start": "next start",
    
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    
    "db:push": "prisma db push",
    "db:push:prod": "dotenv -e .env.production -- prisma db push",
    "db:studio": "prisma studio",
    "db:studio:prod": "dotenv -e .env.production -- prisma studio",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "dotenv -e .env.production -- prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/seed.ts",
    
    "import:dev": "ts-node scripts/importers/question_importer.ts",
    "import:prod": "dotenv -e .env.production -- ts-node scripts/importers/question_importer.ts"
  }
}
```

---

## 🔧 MCP 配置检查

### 当前状态

您的 MCP 配置文件显示：
```json
{
  "mcpServers": {}
}
```

**说明**: MCP 服务器为空，这是正常的。

### 什么是 MCP？

**MCP (Model Context Protocol)** 是 Cursor 的扩展协议，用于：
- 连接外部工具
- 访问数据库
- 调用API

### 是否需要配置 MCP？

**对于您的项目：暂时不需要！**

原因：
1. ✅ Prisma 已经提供了数据库访问
2. ✅ 导入脚本可以直接运行
3. ✅ 不需要额外的外部工具

**未来可能需要**:
- 如果要让 Cursor 直接查询数据库
- 如果要集成外部API
- 如果要使用特殊工具

---

## 📦 需要安装的依赖

### 必需依赖

```bash
# 1. TypeScript 执行环境
npm install -D ts-node @types/node

# 2. 环境变量管理
npm install -D dotenv-cli

# 3. 文件系统操作
npm install -D @types/fs-extra fs-extra
```

### 可选依赖（推荐）

```bash
# 进度条显示
npm install -D cli-progress @types/cli-progress

# 颜色输出
npm install -D chalk

# 日期处理
npm install date-fns
```

---

## 🚀 完整配置流程

### 流程图

```
1. 创建 Supabase 开发项目 (hajimi-dev)
   ↓
2. 保存开发环境连接信息
   ↓
3. 创建 .env.development 文件
   ↓
4. 安装必要依赖
   ↓
5. 应用数据库迁移到开发环境
   ↓
6. 测试导入脚本
   ↓
7. 确认无误后，应用到生产环境
```

---

## 🎯 环境切换命令

### 开发环境（默认）

```bash
# 使用 .env.development
npm run dev
npm run db:studio
npm run import:dev
```

### 生产环境

```bash
# 使用 .env.production
npm run dev:prod
npm run db:studio:prod
npm run import:prod
```

---

## ⚠️ 安全检查清单

- [ ] .env 文件已加入 .gitignore
- [ ] .env.development 文件已加入 .gitignore
- [ ] .env.production 文件已加入 .gitignore
- [ ] secrets-*.txt 文件已加入 .gitignore
- [ ] 开发和生产数据库使用不同的密码
- [ ] SERVICE_ROLE_KEY 绝不暴露在前端

---

**最后更新**: 2025-10-05  
**维护者**: Hajimi 开发团队
