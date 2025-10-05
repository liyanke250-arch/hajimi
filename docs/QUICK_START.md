# 🚀 Hajimi 项目快速开始指南

**适用对象**: 编程小白  
**预计时间**: 30分钟  
**目标**: 完成环境配置，导入第一道测试题

---

## ✅ 检查清单

在开始之前，确保您已经：
- [x] 安装了 Node.js
- [x] 安装了 GitHub Desktop
- [x] 有 Supabase 账号
- [x] 项目已克隆到本地

---

## 📋 步骤 1: 创建开发数据库（10分钟）

### 1.1 登录 Supabase

访问: https://supabase.com/dashboard

### 1.2 创建开发项目

```
点击 "New Project"

填写信息:
  项目名称: hajimi-dev
  数据库密码: [生成强密码]
  区域: Tokyo (ap-northeast-1)

点击 "Create new project"
等待初始化（约2-3分钟）
```

### 1.3 获取连接信息

```
项目创建后:

1. 点击 "Project Settings" (左下角齿轮)
2. 点击 "Database"
   复制: Host (如 db.xxxxx.supabase.co)

3. 点击 "API"
   复制: 
   - Project URL
   - anon public key
   - service_role key
```

### 1.4 创建配置文件

**重要**: 在项目根目录创建 `.env.development` 文件：

```env
NODE_ENV="development"

# 开发数据库（填入您刚才获取的信息）
DATABASE_URL="postgresql://postgres:[您的密码]@[您的Host]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[您的密码]@[您的Host]:5432/postgres"

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL="https://[您的Project-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[您的anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[您的service-role-key]"

# 本地配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-later"
```

**⚠️ 注意**: 
- 密码中的特殊字符需要URL编码
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`

---

## 📋 步骤 2: 应用数据库结构（5分钟）

### 2.1 生成数据库表

在项目根目录打开终端，运行：

```bash
# 1. 创建数据库迁移
npx prisma migrate dev --name init_gre_structure

# 您会看到：
# ✔ Generated Prisma Client
# ✔ The migration has been created successfully
```

### 2.2 验证数据库

```bash
# 打开数据库可视化工具
npx prisma studio

# 浏览器会自动打开 http://localhost:5555
# 您应该能看到以下表：
# - questions
# - question_options
# - vocabularies
# - question_vocabularies
```

---

## 📋 步骤 3: 导入第一道测试题（5分钟）

### 3.1 准备测试数据

将您提供的第一道题的JSON保存为：
`content/test/question_1.json`

### 3.2 运行导入脚本

```bash
npm run import:test
```

### 3.3 查看结果

您会看到类似这样的输出：

```
============================================================
🚀 Hajimi GRE 题目导入工具
============================================================

📂 找到 1 个JSON文件

[1/1] 处理文件: question_1.json

📝 开始导入题目: q_s1t1s1q1_victorians
   来源: Stage 1 Test 1 Section 1-1
  → 处理 8 个词汇...
  ✅ 创建新词汇: paradox
  ✅ 创建新词汇: Victorian
  ✅ 创建新词汇: cosmopolitan
  ✅ 创建新词汇: capricious
  ✅ 创建新词汇: insular
  ✅ 创建新词汇: mercenary
  ✅ 创建新词汇: idealistic
  ✅ 创建新词汇: intransigent
  → 创建/更新题目...
  ✅ 题目处理完成
  → 处理选项...
  ✅ 5 个选项已创建
  → 建立词汇关联...
  ✅ 8 个词汇已关联
✅ 题目导入成功: q_s1t1s1q1_victorians

============================================================
📊 导入完成统计
============================================================

  总文件数: 1
  ✅ 成功: 1
  ❌ 失败: 0
  📚 处理词汇: 8

============================================================
```

### 3.4 验证数据

```bash
# 再次打开 Prisma Studio
npx prisma studio

# 检查：
# 1. questions 表: 应该有1条记录
# 2. question_options 表: 应该有5条记录
# 3. vocabularies 表: 应该有8条记录
# 4. question_vocabularies 表: 应该有8条关联记录
```

---

## 📋 步骤 4: 测试词汇去重（5分钟）

### 4.1 准备第二道题

将第二道题的JSON保存为：
`content/test/question_2.json`

### 4.2 再次运行导入

```bash
npm run import:test
```

### 4.3 观察去重效果

您会看到：

```
[2/2] 处理文件: question_2.json
  → 处理 11 个词汇...
  ✅ 创建新词汇: detection
  ✅ 创建新词汇: molecular
  ♻️  词汇已存在，复用: analysis  ← 注意这里！
  ✅ 创建新词汇: unambiguous
  ...
```

**重点**: 如果两道题有相同的词汇，第二次会显示 `♻️ 词汇已存在，复用`

### 4.4 验证去重

```bash
npx prisma studio

# 检查 vocabularies 表:
# - 应该少于 8 + 11 = 19 条记录
# - 因为有些词汇被复用了
```

---

## 🎉 完成！

现在您已经：
- ✅ 配置了开发环境
- ✅ 创建了数据库结构
- ✅ 成功导入了测试题
- ✅ 验证了词汇去重功能

---

## 🚀 下一步

### 批量导入题目

```bash
# 1. 将所有JSON文件放到 content/unprocessed/
# 2. 运行导入
npm run import:questions

# 3. 脚本会自动处理所有文件
```

### 切换到生产环境

```bash
# 1. 创建 .env.production 文件
# 2. 填入生产数据库信息
# 3. 运行生产迁移
npx prisma migrate deploy

# 4. 导入到生产环境
npm run import:prod
```

---

## ❓ 常见问题

### Q1: 导入失败怎么办？

```bash
# 检查数据库连接
npx prisma db pull

# 查看详细错误
# 错误信息会显示在终端
```

### Q2: 如何重新开始？

```bash
# 重置数据库（⚠️ 会删除所有数据）
npx prisma migrate reset

# 重新应用迁移
npx prisma migrate dev
```

### Q3: 如何查看数据？

```bash
# 打开可视化工具
npx prisma studio

# 或者直接在 Supabase 后台查看
```

---

**最后更新**: 2025-10-05  
**需要帮助**: 随时在项目中提问！
