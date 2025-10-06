# 🎯 从这里开始 - 超级简单版

**适用对象**: 编程小白  
**原则**: 每次只做一件事，做完一步再看下一步

---

## 📍 您现在的位置

✅ 代码已经准备好了  
✅ 工具已经安装好了  
⏳ 现在需要配置数据库

---

## ✅ 第一步：创建开发数据库（已完成）

### ✅ 1.1 打开 Supabase 网站

**操作**:
1. 打开浏览器
2. 访问: https://supabase.com/dashboard
3. 登录您的账号

**完成标志**: 看到 Supabase 控制台

---

### ✅ 1.2 点击创建新项目

**操作**:
1. 找到 "New Project" 按钮（绿色的）
2. 点击它

**完成标志**: 弹出创建项目的表单

---

### ✅ 1.3 填写项目信息

**操作**:
1. **项目名称**: 输入 `hajimi-dev`
2. **数据库密码**: 
   - 点击 "Generate a password" 按钮
   - 或者自己输入一个强密码（至少12位，包含大小写字母和数字）
3. **重要**: 立即复制这个密码，保存到记事本
4. **区域**: 选择 `Tokyo (ap-northeast-1)`

**完成标志**: 所有信息已填写

---

### ✅ 1.4 创建项目

**操作**:
1. 点击 "Create new project" 按钮
2. 等待 2-3 分钟（会显示进度条）

**完成标志**: 看到项目控制台

---

### ✅ 1.5 获取 Host 信息

**操作**:
1. 点击左下角的 **齿轮图标** (Project Settings)
2. 点击左侧的 **Database**
3. 找到 "Connection string" 部分
4. 找到 **Host** 这一行
5. 复制 Host 的值（类似 `db.xxxxx.supabase.co`）
6. 保存到记事本

**完成标志**: 您有了 Host 地址

---

### ✅ 1.6 获取 Project URL

**操作**:
1. 点击左侧的 **API**
2. 找到 "Project URL" 部分
3. 复制 URL（类似 `https://xxxxx.supabase.co`）
4. 保存到记事本

**完成标志**: 您有了 Project URL

---

### ✅ 1.7 获取 API Keys

**操作**:
1. 在同一个 API 页面
2. 找到 "Project API keys" 部分
3. 复制 **anon public** 的值（很长的字符串，以 `eyJ` 开头）
4. 保存到记事本，标注为 "anon key"
5. 复制 **service_role** 的值（也很长）
6. 保存到记事本，标注为 "service_role key"

**完成标志**: 您有了两个 API keys

---

### ✅ 1.8 整理信息

**操作**:
在记事本中，您现在应该有：

```
开发数据库信息:
1. 密码: [您的密码]
2. Host: db.xxxxx.supabase.co
3. Project URL: https://xxxxx.supabase.co
4. anon key: eyJhb...
5. service_role key: eyJhb...
```

**完成标志**: 5个信息都有了

---

## ✅ 第一步完成！

**恭喜！** 您已经完成了第一步：
- ✅ 创建了开发数据库
- ✅ 获取了所有连接信息
- ✅ 创建了配置文件
- ✅ 测试了数据库连接

---

## 🚀 第二步：应用数据库设计

现在我们要把设计好的数据库结构（表、字段）应用到开发数据库。

### 2.1 更新数据库设计文件

**操作**:
1. 在 VS Code 左侧找到 `prisma/schema.prisma` 文件
2. 打开它
3. 您会看到只有一个简单的 User 表
4. 我们需要替换成完整的 GRE 题库设计

**完成标志**: schema.prisma 文件已打开

**做完告诉我**: "我打开了 schema.prisma"

---

### 2.2 替换为完整设计

**操作**:
1. 在 VS Code 左侧找到 `prisma/schema_optimized.prisma` 文件
2. 打开它
3. 全选所有内容（Ctrl + A）
4. 复制（Ctrl + C）
5. 回到 `prisma/schema.prisma` 文件
6. 全选（Ctrl + A）
7. 粘贴（Ctrl + V）替换
8. 保存（Ctrl + S）

**完成标志**: schema.prisma 文件内容变多了，有很多表的定义

**做完告诉我**: "我替换好了"

---

### 2.3 应用到数据库

**操作**:
在终端输入这个命令：

```bash
npx prisma migrate dev --name init_gre_structure
```

**这个命令会做什么**:
1. 读取 schema.prisma
2. 在开发数据库创建所有表
3. 生成 Prisma Client

**预计时间**: 30秒

**完成标志**: 看到 "✔ Generated Prisma Client"

**做完告诉我**: 把终端输出复制给我看

---

### 2.4 查看数据库

**操作**:
在终端输入：

```bash
npx prisma studio
```

**会发生什么**:
- 浏览器会自动打开
- 显示数据库管理界面
- 您能看到所有创建的表

**完成标志**: 看到 questions, vocabularies 等表

**做完告诉我**: "我看到表了"

---

---

## ✅ 第二步完成！

**恭喜！** 您已经完成了：
- ✅ 更新了数据库设计
- ✅ 创建了所有数据库表
- ✅ 成功导入了第一道测试题
- ✅ 验证了词汇去重功能

---

## ✅ 第三步：安装内容管理后台（Directus）（已完成）

现在我们要安装一个可视化的管理界面，让您能像使用 Excel 一样管理题目。

### ✅ 3.1 创建 CMS 目录

**操作**：
在终端输入：

```bash
mkdir cms
```

**完成标志**：左侧文件列表出现 `cms` 文件夹

**做完告诉我**："创建了 cms 文件夹"

---

### ✅ 3.2 进入 CMS 目录

**操作**：
在终端输入：

```bash
cd cms
```

**完成标志**：终端路径变成 `...\hajimi\cms>`

**做完告诉我**："进入了 cms 目录"

---

### ✅ 3.3 初始化项目

**操作**：
在终端输入：

```bash
npm init -y
```

**完成标志**：看到 "Wrote to package.json"

**做完告诉我**："初始化完成"

---

### ✅ 3.4 安装 Directus

**操作**：
在终端输入：

```bash
npm install directus
```

**预计时间**：2-3分钟（下载依赖）

**完成标志**：看到 "added XXX packages"

**做完告诉我**："Directus 安装完成"

---

---

## ✅ 第三步完成！

**恭喜！** 您已经完成了：
- ✅ 安装了 Directus CMS
- ✅ 配置了数据库连接
- ✅ 创建了管理员账号
- ✅ 成功登录 Directus
- ✅ 可以查看和管理题目了

---

## 🎊 所有核心功能已完成！

您现在拥有：
1. ✅ 开发数据库（hajimi-dev）
2. ✅ 数据库表结构（9个表）
3. ✅ 自动导入脚本（词汇去重）
4. ✅ 可视化管理后台（Directus）
5. ✅ 前端演示页面（/demo）
6. ✅ 完整的文档系统
7. ✅ 7道题目成功导入并验证

---

## 🚀 下一步：批量导入题目

### 准备工作：

1. **创建 JSON 文件格式规范**
   - 避免中文引号
   - 避免反引号
   - 保持标准 JSON 格式

2. **批量导入流程**：
   ```bash
   # 1. 将 JSON 文件放到 content/unprocessed/
   # 2. 运行导入命令
   npm run import:questions
   # 3. 在 Directus 中查看结果
   ```

3. **使用 Directus 管理**：
   ```bash
   # 启动 Directus
   cd cms
   .\start.bat
   
   # 访问 http://localhost:8055
   # 登录: admin@test.com / admin123456
   ```

---

## 📚 参考文档

- `docs/TODAY_SUMMARY.md` - 今日完成总结
- `docs/DATABASE_DESIGN.md` - 数据库设计详解
- `docs/FAQ_DATABASE.md` - 常见问题解答
- `cms/CREDENTIALS.md` - 登录凭据

---

**🎉 恭喜您完成了整个系统搭建和验证！**

## 🚀 系统已验证功能

### 数据库系统 ✅
- 9个核心表运行正常
- 支持超长文本（1GB）
- 词汇自动去重（100%验证）

### 导入系统 ✅
- 成功导入7道题目
- 61个词汇（自动去重）
- 所有数据完整

### 管理后台 ✅
- Directus: http://localhost:8055
- 登录: admin@test.com / admin123456
- 可查看和编辑所有数据

### 前端展示 ✅
- 列表页: http://localhost:3000/demo
- 详情页: 完整解析展示
- 响应式设计
- 优雅的UI

---

## 📚 下一步

### 立即可做：
1. **查看演示**: 访问 http://localhost:3000/demo
2. **管理数据**: 访问 http://localhost:8055
3. **批量导入**: 准备剩余题目的JSON

### 规划中：
1. 设计自动化生成流程
2. 批量导入1900道题
3. 优化前端功能
4. 开发用户系统

---

**您现在可以开始批量导入题目了！** 🚀

参考文档：
- QUICK_REFERENCE.md - 快速参考
- docs/BATCH_IMPORT_GUIDE.md - 批量导入指南
- FINAL_SUMMARY_20251005.md - 今日总结

---

## 🚀 第四步：准备自动化生成流程

现在我们要准备自动化生成1900道题的流程。

### 4.1 了解自动化流程

**操作**：
1. 打开 `docs/AUTO_GENERATION_DESIGN.md` 文件
2. 阅读整个设计方案
3. 理解4个阶段：
   - 阶段1: 生成Markdown
   - 阶段2: 质量审计
   - 阶段3: 生成JSON
   - 阶段4: 自动入库

**完成标志**：您理解了整个流程

**做完告诉我**："我读完了设计方案"

---

### 4.2 准备Prompt文件

**操作**：
1. 在项目中创建 `prompts` 文件夹
2. 将桌面的两个文件复制进来：
   - `GRE V30.0 prompt.md` → `prompts/generation.md`
   - `GRE V1.0 audit.md` → `prompts/audit.md`

**Windows操作**：
```
1. 在VS Code左侧，右键点击项目根目录
2. 选择"新建文件夹"
3. 输入: prompts
4. 用文件管理器复制文件
```

**完成标志**：prompts文件夹中有2个md文件

**做完告诉我**："Prompt文件准备好了"

---

### 4.3 准备题目文件

**操作**：
1. 在项目中创建 `input/questions` 文件夹
2. 创建一个测试题目文件：`input/questions/test_question.txt`
3. 内容格式：
```
题目ID: Stage 1 Test 1 Section 1-8
题目文本: [您的题目文本]
选项:
A. option1
B. option2
C. option3
D. option4
E. option5
正确答案: B
```

**完成标志**：有一个测试题目文件

**做完告诉我**："测试题目准备好了"

---

### 4.4 创建输出目录结构

**操作**：
在终端输入：

```bash
mkdir output
mkdir output\markdown
mkdir output\json
mkdir output\errors
mkdir output\logs
mkdir state
```

**完成标志**：左侧文件列表出现这些文件夹

**做完告诉我**："目录结构创建完成"

---

### 4.5 第一次手动测试

**目的**：在自动化之前，先手动走一遍流程

**操作**：
1. 打开一个AI对话（比如Cursor Chat）
2. 准备好 `prompts/generation.md` 的内容
3. 把测试题目发给AI
4. 查看生成的Markdown
5. 把Markdown保存到 `output/markdown/test1.md`

**完成标志**：您有了第一个手动生成的Markdown

**做完告诉我**："我生成了第一个Markdown"

---

### 4.6 手动审计测试

**操作**：
1. 打开另一个AI对话
2. 准备好 `prompts/audit.md` 的内容
3. 把生成的Markdown发给审计AI
4. 查看审计结果
5. 看是否通过

**完成标志**：您知道了审计AI会检查什么

**做完告诉我**："我完成了手动审计"

---

### 4.7 手动转JSON测试

**操作**：
1. 如果审计通过
2. 从Markdown中找到JSON代码块
3. 复制JSON内容
4. 保存到 `output/json/test1.json`
5. 验证格式是否正确

**完成标志**：您有了第一个JSON文件

**做完告诉我**："JSON提取完成"

---

### 4.8 手动导入测试

**操作**：
在终端输入：

```bash
copy output\json\test1.json content\test\
npm run import:test
```

**完成标志**：导入成功，在Directus中能看到

**做完告诉我**："手动流程全部走通了"

---

## ✅ 第四步完成！

**恭喜！** 您已经：
- ✅ 理解了自动化流程
- ✅ 准备好了Prompt文件
- ✅ 创建了目录结构
- ✅ 手动测试了完整流程
- ✅ 验证了每个环节

**下一步**：
等您把手动流程走通后，我会帮您把这个流程自动化！

---

## 💡 重要提示

**为什么要先手动测试？**
1. 理解每个步骤在做什么
2. 发现可能的问题
3. 调整Prompt和流程
4. 确保质量符合预期

**只有手动流程完美了，自动化才有意义！**

---

**现在从 4.1 开始！** 😊

一步一步来，不着急！

---

## 🎼 第五步：使用Composer批量生成

现在我们已经验证了流程（手动生成了3道题），可以使用Cursor的Composer功能来加速生成！

### 5.1 了解Composer功能

**Composer是什么**：
- Cursor的高级功能
- 可以执行复杂的多步骤任务
- 可以同时创建/编辑多个文件
- 有任务检查和验证机制

**和普通对话的区别**：
- 普通对话：一问一答
- Composer：给任务，自动完成

**完成标志**：您理解了Composer

**做完告诉我**："我理解了Composer"

---

### 5.2 打开Composer

**操作**：
1. 在Cursor中，按快捷键 `Ctrl + I`（或 `Cmd + I` on Mac）
2. 或者点击右上角的"Composer"图标
3. 看到Composer界面

**完成标志**：Composer界面打开

**做完告诉我**："Composer打开了"

---

### 5.3 编写Composer任务

**操作**：
在Composer中输入以下任务（可以复制）：

```
请按以下流程为 input/questions/GRE_questions.md 中的
Stage 1 Test 1 Section 2 第4题 生成完整解析：

1. 读取题目信息
2. 使用 prompts/generation.md 的规则生成Markdown解析
3. 保存到 output/markdown/q_s1t1s2q4_[题目核心词].md
4. 生成对应的JSON文件
5. 保存到 output/json/q_s1t1s2q4_[题目核心词].json
6. 生成Markdown审核报告
7. 保存到 output/audit-reports/markdown/
8. 生成JSON审核报告
9. 保存到 output/audit-reports/json/

完成后请验证：
- 4个文件都已创建
- JSON格式正确（可解析）
- 词汇数量完整（包含所有选项词汇）
- 文件大小合理（每个文件>5KB）

如果任何步骤失败，请明确报告。
```

**完成标志**：任务已输入

**做完告诉我**："任务已输入"

---

### 5.4 执行Composer任务

**操作**：
1. 检查任务内容
2. 按回车或点击"Generate"
3. 等待Composer执行
4. 观察进度

**预计时间**：2-3分钟

**完成标志**：Composer显示"完成"

**做完告诉我**："Composer执行完成了"

---

### 5.5 验证生成结果

**操作**：
检查以下4个文件是否都存在且有内容：

1. `output/markdown/q_s1t1s2q4_*.md`
2. `output/json/q_s1t1s2q4_*.json`
3. `output/audit-reports/markdown/q_s1t1s2q4_*_md_audit.json`
4. `output/audit-reports/json/q_s1t1s2q4_*_json_audit.json`

**检查方法**：
- 在VS Code左侧查看文件
- 打开文件看内容是否完整
- 文件大小是否合理（不是空文件）

**完成标志**：4个文件都正确

**做完告诉我**："验证通过"或"有问题"

---

### 5.6 查看审核报告

**操作**：
1. 打开 `output/audit-reports/json/q_s1t1s2q4_*_json_audit.json`
2. 查看 `result.status`
3. 查看 `result.grade`
4. 查看 `errors` 数组

**判断标准**：
- status = "pass" → 可以导入
- status = "fail" → 需要修复
- grade = "A" → 完美
- grade = "B" → 良好
- grade = "C" → 需要审核

**完成标志**：知道这道题的质量

**做完告诉我**：报告结果（pass/fail，等级）

---

## ✅ 第五步完成！

**恭喜！** 您已经：
- ✅ 学会了使用Composer
- ✅ 理解了批量生成流程
- ✅ 知道如何验证结果
- ✅ 会查看审核报告

**下一步**：
如果Composer生成效果好，就可以批量生成更多题目了！

---

## 💡 Composer的优势

1. **自动化**：不需要手动复制粘贴
2. **验证机制**：可以检查文件是否创建
3. **批量处理**：可以一次处理多道题
4. **错误报告**：明确告诉您哪里出错

**现在从 5.1 开始！** 😊

让我们试试Composer的威力！
