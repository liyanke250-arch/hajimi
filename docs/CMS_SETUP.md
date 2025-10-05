# 🎨 Directus CMS 安装指南

**创建时间**: 2025-10-05  
**适用对象**: 编程小白  
**目标**: 安装可视化的内容管理后台

---

## 🎯 什么是 Directus？

**简单来说**：
- 一个漂亮的数据库管理界面
- 可以像 Excel 一样查看和编辑数据
- 不需要写代码就能管理题目

**好处**：
- ✅ 可视化管理题目和词汇
- ✅ 方便查找和编辑
- ✅ 支持批量操作
- ✅ 有搜索和筛选功能

---

## 📋 安装步骤

### 步骤 1: 创建 CMS 目录

**在终端输入**：

```bash
mkdir cms
cd cms
```

---

### 步骤 2: 初始化 Directus

**在终端输入**：

```bash
npm init -y
npm install directus
```

**预计时间**: 2-3分钟（下载依赖）

---

### 步骤 3: 创建配置文件

**创建文件**: `cms/.env`

**内容**：
```env
# Directus 配置
PORT=8055
PUBLIC_URL=http://localhost:8055

# 密钥（随机生成）
KEY=replace-with-random-string
SECRET=replace-with-another-random-string

# 管理员账号
ADMIN_EMAIL=admin@hajimi.local
ADMIN_PASSWORD=admin123456

# 数据库连接（使用开发数据库）
DB_CLIENT=pg
DB_HOST=db.tzgbbbkgvdpmwqmmlrzq.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=fnuMGuIzlPDnYfDy
DB_SSL=true
```

---

### 步骤 4: 初始化 Directus

**在终端输入**：

```bash
npx directus bootstrap
```

**会发生什么**：
- 创建管理员账号
- 初始化系统表
- 准备就绪

---

### 步骤 5: 启动 Directus

**在终端输入**：

```bash
npx directus start
```

**会发生什么**：
- 启动服务器
- 浏览器自动打开 http://localhost:8055
- 看到登录界面

**登录信息**：
- 邮箱: admin@hajimi.local
- 密码: admin123456

---

## 🎯 使用 Directus

### 登录后您会看到：

1. **Collections（集合）** - 就是您的数据库表
   - questions
   - vocabularies
   - question_options
   - 等等

2. **可以做什么**：
   - 查看所有题目
   - 搜索和筛选
   - 编辑题目内容
   - 查看词汇统计

---

**最后更新**: 2025-10-05
