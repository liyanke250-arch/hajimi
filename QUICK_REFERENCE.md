# ⚡ Hajimi 快速参考卡

**适用场景**: 日常使用速查

---

## 🚀 常用命令

### 启动 Directus（管理后台）
```bash
cd cms
.\start.bat
```
访问: http://localhost:8055  
登录: admin@test.com / admin123456

---

### 导入题目
```bash
# 测试导入
npm run import:test

# 批量导入
npm run import:questions
```

---

### 查看数据库
```bash
# 本地工具
npx prisma studio

# 或访问 Supabase
# https://supabase.com/dashboard
```

---

### 开发网站
```bash
npm run dev
```
访问: http://localhost:3000

---

## 📁 重要文件位置

### 配置文件
- `.env` - 数据库配置
- `cms/.env` - Directus 配置

### 凭据文件
- `cms/CREDENTIALS.md` - Directus 登录信息

### 数据目录
- `content/test/` - 测试数据
- `content/unprocessed/` - 待导入数据

---

## 📚 文档速查

| 需求 | 文档 |
|------|------|
| 新手入门 | START_HERE.md |
| 批量导入 | docs/BATCH_IMPORT_GUIDE.md |
| JSON 格式 | docs/JSON_FORMAT_GUIDE.md |
| 数据库设计 | docs/DATABASE_DESIGN.md |
| 常见问题 | docs/FAQ_DATABASE.md |
| 今日总结 | docs/TODAY_SUMMARY.md |

---

## 🔧 故障排查

### Directus 连不上
```bash
# 重启 Directus
cd cms
.\start.bat
```

### 导入失败
- 检查 JSON 格式（英文引号）
- 查看错误详情
- 参考 docs/JSON_FORMAT_GUIDE.md

### 数据库连不上
- 检查 .env 文件
- 运行 `npx prisma db pull` 测试

---

**最后更新**: 2025-10-05
