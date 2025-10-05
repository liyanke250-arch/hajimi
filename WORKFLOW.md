# 📋 Hajimi 项目工作流程文档

## 🎯 文档目的

记录项目的标准工作流程，确保团队协作的一致性和效率。

---

## 🚀 开发工作流

### 1. 开始新功能开发

#### 1.1 创建功能分支

```bash
# 确保在最新的 main 分支
git checkout main
git pull origin main

# 创建新功能分支（命名规范: feature/功能名称）
git checkout -b feature/user-authentication

# 或者修复bug（命名规范: fix/bug描述）
git checkout -b fix/login-error
```

#### 1.2 开发前检查

- [ ] 确认需求文档（PRD.md）
- [ ] 查看相关的 Sprint 任务文档（project XX.md）
- [ ] 检查是否有依赖的功能未完成
- [ ] 确认数据库 schema 是否需要更新

### 2. 开发过程

#### 2.1 代码编写规范

```bash
# 启动开发服务器
npm run dev

# 在新终端监听 TypeScript 类型检查
npm run type-check  # 需要在 package.json 中添加此脚本

# 在新终端监听 ESLint
npm run lint
```

#### 2.2 必须遵循的规则

- ✅ 所有代码必须有完整的中文注释（参考 docs/coding-standards.md）
- ✅ 遵循 TypeScript 严格模式，不使用 any
- ✅ 组件必须有清晰的 Props 类型定义
- ✅ 使用 Tailwind CSS，避免自定义 CSS
- ✅ 复杂逻辑必须拆分成独立函数
- ✅ 使用 Server Components 作为默认

#### 2.3 数据库变更流程

```bash
# 1. 修改 prisma/schema.prisma
# 2. 创建迁移
npx prisma migrate dev --name describe_your_change

# 3. 生成 Prisma Client
npx prisma generate

# 4. 验证迁移
npx prisma studio  # 打开数据库可视化工具检查
```

### 3. 提交代码

#### 3.1 提交前检查清单

- [ ] 代码已格式化（保存时自动格式化）
- [ ] 没有 ESLint 错误
- [ ] 没有 TypeScript 类型错误
- [ ] 所有新文件都有文件头注释
- [ ] 删除了 console.log 等调试代码
- [ ] 测试了主要功能路径

#### 3.2 提交规范

```bash
# 查看修改的文件
git status

# 添加文件到暂存区
git add .

# 提交（遵循 Conventional Commits 规范）
git commit -m "feat(auth): 实现用户登录功能

- 添加登录表单组件
- 集成 Supabase Auth
- 添加错误处理和用户反馈
- 实现记住登录状态

Closes #123"
```

#### 3.3 提交类型说明

| 类型       | 说明          | 示例                                   |
| ---------- | ------------- | -------------------------------------- |
| `feat`     | 新功能        | `feat(practice): 添加答题计时器`       |
| `fix`      | Bug修复       | `fix(login): 修复登录失败后的错误提示` |
| `docs`     | 文档更新      | `docs: 更新API文档`                    |
| `style`    | 代码格式调整  | `style: 格式化代码`                    |
| `refactor` | 重构          | `refactor(utils): 优化分数计算逻辑`    |
| `perf`     | 性能优化      | `perf(dashboard): 优化数据加载性能`    |
| `test`     | 测试相关      | `test(auth): 添加登录单元测试`         |
| `chore`    | 构建/工具配置 | `chore: 更新依赖包`                    |

### 4. 推送和部署

#### 4.1 推送到远程仓库

```bash
# 首次推送分支
git push -u origin feature/user-authentication

# 后续推送
git push
```

#### 4.2 创建 Pull Request

1. 访问 GitHub 仓库
2. 点击 "Compare & pull request"
3. 填写 PR 描述：

   ```markdown
   ## 功能描述

   实现用户登录功能

   ## 变更内容

   - [ ] 添加登录表单组件
   - [ ] 集成 Supabase Auth
   - [ ] 添加错误处理

   ## 测试说明

   1. 访问 /login 页面
   2. 输入有效凭证
   3. 验证登录成功并跳转

   ## 相关文档

   - PRD.md 第3.2节
   - project 01.md 任务1.1

   ## 截图

   （如果有UI变更，请附上截图）
   ```

#### 4.3 代码审查

- 等待团队成员审查
- 根据反馈修改代码
- 确保 CI/CD 检查通过

#### 4.4 合并到主分支

```bash
# 在 GitHub 上合并 PR 后，更新本地仓库
git checkout main
git pull origin main

# 删除已合并的功能分支
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

---

## 🔧 常用命令速查

### 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint 检查
npm run lint:fix     # 自动修复 ESLint 错误
```

### Prisma 命令

```bash
npx prisma studio                    # 打开数据库可视化工具
npx prisma migrate dev              # 创建并应用迁移（开发环境）
npx prisma migrate deploy           # 应用迁移（生产环境）
npx prisma generate                 # 生成 Prisma Client
npx prisma db push                  # 快速同步 schema（开发时使用）
npx prisma format                   # 格式化 schema 文件
```

### Git 命令

```bash
git status                          # 查看状态
git log --oneline --graph           # 查看提交历史
git diff                            # 查看未暂存的修改
git diff --staged                   # 查看已暂存的修改
git stash                           # 暂存当前修改
git stash pop                       # 恢复暂存的修改
```

---

## 🐛 问题排查流程

### 1. 开发服务器无法启动

```bash
# 1. 清理缓存和重新安装依赖
rm -rf node_modules .next
npm install

# 2. 检查环境变量
cat .env  # 确认所有必需的变量都存在

# 3. 检查端口占用
# Windows
netstat -ano | findstr :3000
# Mac/Linux
lsof -i :3000
```

### 2. 数据库连接失败

```bash
# 1. 测试数据库连接
npx prisma db pull

# 2. 检查 DATABASE_URL 是否正确
echo $DATABASE_URL  # Mac/Linux
echo %DATABASE_URL%  # Windows

# 3. 重新生成 Prisma Client
npx prisma generate
```

### 3. TypeScript 类型错误

```bash
# 1. 重新生成类型定义
npx prisma generate

# 2. 重启 TypeScript 服务器
# 在 VS Code 中: Ctrl/Cmd + Shift + P -> "TypeScript: Restart TS Server"

# 3. 检查 tsconfig.json 配置
```

### 4. Vercel 部署失败

1. 检查 Vercel 环境变量是否配置完整
2. 查看 Vercel 部署日志
3. 确认 build 命令在本地能成功执行
4. 检查 next.config.mjs 配置

---

## 📝 代码审查检查清单

### 功能性

- [ ] 功能按需求文档实现
- [ ] 边界情况已处理
- [ ] 错误处理完整
- [ ] 用户体验流畅

### 代码质量

- [ ] 代码结构清晰
- [ ] 命名语义化
- [ ] 注释完整且准确
- [ ] 没有重复代码
- [ ] 遵循项目规范

### 性能

- [ ] 没有不必要的重渲染
- [ ] 使用了适当的优化（memo, useCallback等）
- [ ] 图片已优化
- [ ] 数据库查询高效

### 安全

- [ ] 用户输入已验证
- [ ] 敏感数据已保护
- [ ] 没有硬编码的密钥
- [ ] API 路由有权限检查

### 测试

- [ ] 主要功能已测试
- [ ] 边界情况已测试
- [ ] 错误场景已测试

---

## 🎯 Sprint 工作流

### Sprint 开始

1. 团队会议讨论 Sprint 目标
2. 分配任务给团队成员
3. 更新 project XX.md 文档
4. 创建相关的 GitHub Issues

### Sprint 进行中

1. 每日站会（可选）
2. 更新任务状态
3. 及时沟通阻塞问题
4. 代码审查和反馈

### Sprint 结束

1. 演示完成的功能
2. 回顾和总结
3. 更新文档
4. 规划下一个 Sprint

---

## 🔄 持续改进

### 工作流程优化

- 定期回顾工作流程的效率
- 收集团队反馈
- 更新此文档
- 分享最佳实践

### 学习和成长

- 记录遇到的问题和解决方案
- 分享有用的工具和技巧
- 代码审查中学习
- 定期技术分享

---

## 📞 获取帮助

### 项目相关

- 查看 PRD.md 了解产品需求
- 查看 DEVELOPMENT.md 了解技术架构
- 查看 docs/coding-standards.md 了解代码规范
- 查看 project XX.md 了解具体任务

### 技术问题

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### 团队沟通

- GitHub Issues: 报告 Bug 和功能请求
- Pull Request: 代码审查和讨论
- 项目文档: 记录决策和规范

---

**最后更新**: 2025-10-05  
**维护者**: Hajimi 开发团队

**注意**: 此文档会随着项目发展持续更新，请定期查看最新版本。
