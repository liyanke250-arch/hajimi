# ✅ Hajimi 项目配置检查清单

**创建时间**: 2025-10-05  
**用途**: 确保所有配置正确完成

---

## 📋 第一部分：已完成的配置

### ✅ 代码和脚本（已完成）

- [x] 数据库 Schema 设计
- [x] 导入脚本编写
- [x] 词汇去重逻辑
- [x] TypeScript 配置
- [x] 依赖包安装
- [x] 文档系统完善
- [x] Git 提交

**状态**: ✅ 100% 完成

---

## 📋 第二部分：需要您手动操作

### 🔧 任务 1: 创建 Supabase 开发数据库

**预计时间**: 10分钟

#### 步骤：

1. **访问 Supabase**
   - [ ] 打开 https://supabase.com/dashboard
   - [ ] 登录您的账号

2. **创建新项目**
   - [ ] 点击 "New Project"
   - [ ] 项目名称: `hajimi-dev`
   - [ ] 数据库密码: [生成强密码]
   - [ ] 区域: `Tokyo (ap-northeast-1)`
   - [ ] 点击 "Create new project"
   - [ ] 等待 2-3 分钟初始化

3. **获取连接信息**
   - [ ] 点击 "Project Settings" → "Database"
   - [ ] 复制 Host: `db.xxxxx.supabase.co`
   - [ ] 点击 "API"
   - [ ] 复制 Project URL
   - [ ] 复制 anon public key
   - [ ] 复制 service_role key

4. **保存信息**
   - [ ] 创建临时文件记录这些信息
   - [ ] 确保文件不会被提交到 Git

**完成标志**: 您有了开发数据库的所有连接信息

---

### 🔧 任务 2: 创建环境配置文件

**预计时间**: 5分钟

#### 步骤：

1. **创建 .env.development 文件**
   - [ ] 在项目根目录创建文件
   - [ ] 复制以下模板：

```env
NODE_ENV="development"

# 开发数据库（填入您的信息）
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

2. **填入真实信息**
   - [ ] 替换所有 `[您的...]` 占位符
   - [ ] 特殊字符需要URL编码（@ → %40）

3. **验证文件**
   - [ ] 确认文件名正确: `.env.development`
   - [ ] 确认在 .gitignore 中（已自动添加）

**完成标志**: `.env.development` 文件存在且包含正确信息

---

### 🔧 任务 3: 应用数据库结构

**预计时间**: 5分钟

#### 步骤：

1. **打开终端**
   - [ ] 在 VS Code 中打开终端
   - [ ] 确认在项目根目录

2. **运行迁移命令**
   ```bash
   npx prisma migrate dev --name init_gre_structure
   ```
   
   - [ ] 等待命令完成
   - [ ] 看到 "✔ Generated Prisma Client"
   - [ ] 看到 "✔ The migration has been created successfully"

3. **验证数据库**
   ```bash
   npx prisma studio
   ```
   
   - [ ] 浏览器自动打开
   - [ ] 能看到以下表：
     - questions
     - question_options
     - vocabularies
     - question_vocabularies
     - test_sets

**完成标志**: Prisma Studio 中能看到所有表

---

### 🔧 任务 4: 导入测试数据

**预计时间**: 5分钟

#### 步骤：

1. **准备测试数据**
   - [ ] 将第一道题的JSON保存为 `content/test/question_1.json`
   - [ ] 确认JSON格式正确

2. **运行导入脚本**
   ```bash
   npm run import:test
   ```
   
   - [ ] 看到进度输出
   - [ ] 看到 "✅ 题目导入成功"
   - [ ] 看到统计信息

3. **验证数据**
   ```bash
   npx prisma studio
   ```
   
   - [ ] questions 表: 1条记录
   - [ ] question_options 表: 5条记录
   - [ ] vocabularies 表: 8条记录
   - [ ] question_vocabularies 表: 8条记录

**完成标志**: 数据库中有完整的题目数据

---

### 🔧 任务 5: 测试词汇去重

**预计时间**: 5分钟

#### 步骤：

1. **添加第二道题**
   - [ ] 保存为 `content/test/question_2.json`

2. **再次运行导入**
   ```bash
   npm run import:test
   ```
   
   - [ ] 观察输出
   - [ ] 看到 "♻️ 词汇已存在，复用" 的提示

3. **验证去重**
   - [ ] 打开 Prisma Studio
   - [ ] vocabularies 表的记录数 < 19
   - [ ] 说明有词汇被复用了

**完成标志**: 词汇去重功能正常工作

---

## 🎯 完成后您将拥有

### ✅ 完整的开发环境

```
开发数据库 (hajimi-dev)
  ↓
本地项目配置
  ↓
导入脚本就绪
  ↓
测试数据导入成功
  ↓
词汇去重验证通过
```

### ✅ 可以开始的工作

1. **批量导入题目**
   ```bash
   # 将JSON文件放到 content/unprocessed/
   npm run import:questions
   ```

2. **开发前端页面**
   ```bash
   npm run dev
   # 开始开发题目展示页面
   ```

3. **查看数据**
   ```bash
   npx prisma studio
   # 随时查看数据库内容
   ```

---

## 📞 遇到问题？

### 常见问题

#### Q1: 数据库连接失败

```bash
# 检查环境变量
cat .env.development

# 测试连接
npx prisma db pull
```

#### Q2: 导入脚本报错

```bash
# 检查JSON格式
# 确保文件是有效的JSON

# 查看详细错误
# 错误信息会显示在终端
```

#### Q3: 词汇没有去重

```bash
# 检查 vocabularies 表
# 确认 word 字段是 UNIQUE

# 查看导入日志
# 应该有 "♻️ 词汇已存在" 的提示
```

---

## 🎉 准备就绪！

完成所有任务后，您就可以：
- ✅ 批量导入1900道题目
- ✅ 词汇自动去重
- ✅ 开发前端页面
- ✅ 添加新题型（阅读、数学）
- ✅ 管理360套套题

**现在，请从任务1开始！** 🚀

---

**需要帮助？** 完成每个任务后告诉我，我会帮您检查和继续下一步！
