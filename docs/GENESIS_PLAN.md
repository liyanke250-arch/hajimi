# 📋 Hajimi GRE 题库项目 - 创世纪行动计划

**项目代号**: Genesis  
**项目目标**: 搭建自动化、可扩展、专业化的 GRE 内容生产与管理系统  
**创建时间**: 2025-10-05  
**基于**: Gemini 建议 + Hajimi 现有基础设施

---

## 🎯 项目现状评估

### ✅ 已完成的基础设施
- [x] Supabase 项目已创建 (hajimi-prod)
- [x] Next.js 14 项目已初始化
- [x] Prisma ORM 已集成
- [x] Vercel 自动部署已配置
- [x] GitHub 仓库已建立
- [x] 开发工具链已完善

### 🎯 待完成的关键任务
- [ ] 数据库 Schema 设计（题目 + 词汇）
- [ ] 内容管理后台搭建
- [ ] 数据导入脚本开发
- [ ] 去重逻辑实现
- [ ] 前端展示页面

---

## 📅 执行计划

### 🏗️ 第一阶段：数据架构设计（预计 1-2 天）

#### ✅ 任务 1.1：创建开发环境数据库

**为什么需要两个数据库？**
- `hajimi-prod`: 生产环境，存放正式数据
- `hajimi-dev`: 开发环境，用于测试和实验

**执行步骤：**

1. **创建开发项目**
   ```bash
   # 在 Supabase 控制台创建新项目
   项目名称: hajimi-dev
   区域: Tokyo (ap-northeast-1)
   密码: [使用强密码]
   ```

2. **保存环境变量**
   ```bash
   # 在本地项目根目录创建 .env.development
   # 复制 .env 并修改为开发环境的配置
   
   DATABASE_URL="postgresql://postgres:[DEV-PASSWORD]@[DEV-HOST]:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://[DEV-PROJECT-ID].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[DEV-ANON-KEY]"
   ```

#### ✅ 任务 1.2：设计规范化数据库 Schema

**核心设计原则：**
- 词汇表独立，避免重复
- 题目-词汇多对多关联
- 支持版本控制
- 预留扩展字段

**Prisma Schema 设计：**

```prisma
// prisma/schema.prisma

// ==========================================
// 词汇表 (Vocabulary) - 全局唯一
// ==========================================
model Vocabulary {
  id                String   @id @default(cuid())
  word              String   @unique  // 确保单词唯一
  phonetic          String?
  definitionCn      String   @map("definition_cn")
  etymology         Json?    // 词源信息
  cognates          Json?    // 同源词
  exampleSentence   String?  @map("example_sentence")
  exampleTranslation String? @map("example_translation")
  
  // 审计字段
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  // 关联
  questions         QuestionVocabulary[]
  
  @@map("vocabularies")
  @@index([word])
}

// ==========================================
// 题目表 (Question)
// ==========================================
model Question {
  id                String   @id @default(cuid())
  uuid              String   @unique  // 业务 UUID
  sourceId          String   @map("source_id")  // 如 "Stage 1 Test 1 Section 1-1"
  version           Float    @default(1.0)
  
  // 题目内容
  questionType      String   @map("question_type")  // "TC", "SE", "RC", "Math"
  questionText      String   @map("question_text")
  options           Json
  correctAnswer     String   @map("correct_answer")
  
  // 难度评分
  difficulty        String   // "Easy", "Medium", "Hard"
  difficultyScore   Float    @map("difficulty_score")
  difficultyFactors Json     @map("difficulty_factors")
  
  // 解析内容
  analysis          Json     // 完整的解析对象
  
  // 审计字段
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  // 关联
  vocabularies      QuestionVocabulary[]
  
  @@map("questions")
  @@index([uuid])
  @@index([sourceId])
  @@index([questionType])
}

// ==========================================
// 题目-词汇关联表 (Many-to-Many)
// ==========================================
model QuestionVocabulary {
  id           String   @id @default(cuid())
  questionId   String   @map("question_id")
  vocabularyId String   @map("vocabulary_id")
  
  // 关联
  question     Question   @relation(fields: [questionId], references: [id], onDelete: Cascade)
  vocabulary   Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)
  
  // 审计
  createdAt    DateTime @default(now()) @map("created_at")
  
  @@unique([questionId, vocabularyId])
  @@map("question_vocabularies")
  @@index([questionId])
  @@index([vocabularyId])
}

// ==========================================
// 同义/反义词总结表 (可选)
// ==========================================
model WordRelation {
  id           String   @id @default(cuid())
  type         String   // "synonym" or "antonym"
  conceptCn    String   @map("concept_cn")
  word1        String
  word2        String
  sourceId     String?  @map("source_id")
  
  createdAt    DateTime @default(now()) @map("created_at")
  
  @@map("word_relations")
  @@index([type])
}
```

#### ✅ 任务 1.3：执行数据库迁移

```bash
# 1. 更新 Prisma Schema
# 将上述 Schema 复制到 prisma/schema.prisma

# 2. 创建迁移（开发环境）
npx prisma migrate dev --name add_gre_content_tables

# 3. 验证迁移
npx prisma studio  # 打开数据库可视化工具检查

# 4. 生成 Prisma Client
npx prisma generate
```

---

### 🔧 第二阶段：内容管理后台（预计 2-3 天）

#### ✅ 任务 2.1：评估 CMS 方案

**Directus vs Strapi 对比：**

| 特性 | Directus | Strapi |
|------|----------|--------|
| **适配现有数据库** | ⭐⭐⭐⭐⭐ 完美 | ⭐⭐⭐ 需要调整 |
| **TypeScript 支持** | ⭐⭐⭐⭐⭐ 原生 | ⭐⭐⭐⭐ 良好 |
| **学习曲线** | ⭐⭐⭐⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| **与 Prisma 兼容** | ⭐⭐⭐⭐⭐ 完美 | ⭐⭐⭐ 一般 |
| **社区支持** | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐⭐⭐ 优秀 |

**推荐：Directus**
- 理由：可以直接"包裹"现有的 Prisma Schema
- 优势：无需重复定义数据结构
- 适合：已有明确数据库设计的项目

#### ✅ 任务 2.2：安装 Directus

```bash
# 在项目根目录创建 CMS 子目录
mkdir cms
cd cms

# 安装 Directus
npm init directus-project@latest

# 配置选项：
# - Project Name: hajimi-cms
# - Database: PostgreSQL
# - Database Host: [使用 Supabase DEV 的连接信息]
# - Admin Email: [你的邮箱]
# - Admin Password: [设置强密码]

# 启动 Directus
npm run dev

# 访问: http://localhost:8055
```

#### ✅ 任务 2.3：配置 Directus 连接到 Supabase

```javascript
// cms/.env
DB_CLIENT="pg"
DB_HOST="[DEV-HOST]"
DB_PORT="5432"
DB_DATABASE="postgres"
DB_USER="postgres"
DB_PASSWORD="[DEV-PASSWORD]"
DB_SSL="true"

PUBLIC_URL="http://localhost:8055"
```

#### ✅ 任务 2.4：配置数据模型权限

在 Directus 后台：
1. 进入 Settings → Data Model
2. 应该能看到 `vocabularies`, `questions`, `question_vocabularies` 表
3. 配置每个表的显示字段和编辑权限
4. 设置合理的字段验证规则

---

### 🤖 第三阶段：自动化导入脚本（预计 2-3 天）

#### ✅ 任务 3.1：创建脚本目录结构

```bash
# 创建脚本目录
mkdir -p scripts/importers
mkdir -p scripts/utils

# 创建必要的文件
touch scripts/importers/question_importer.ts
touch scripts/utils/db_helpers.ts
touch scripts/utils/deduplication.ts
```

#### ✅ 任务 3.2：编写词汇去重逻辑

```typescript
// scripts/utils/deduplication.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取或创建词汇
 * 如果词汇已存在，返回现有记录；否则创建新记录
 */
export async function getOrCreateVocabulary(vocabData: {
  word: string;
  phonetic?: string;
  definitionCn: string;
  etymology?: any;
  cognates?: any;
  exampleSentence?: string;
  exampleTranslation?: string;
}) {
  // 先尝试查找
  let vocab = await prisma.vocabulary.findUnique({
    where: { word: vocabData.word }
  });

  // 如果不存在，则创建
  if (!vocab) {
    vocab = await prisma.vocabulary.create({
      data: vocabData
    });
    console.log(`✅ 创建新词汇: ${vocabData.word}`);
  } else {
    console.log(`♻️  词汇已存在: ${vocabData.word}`);
  }

  return vocab;
}

/**
 * 批量处理词汇，返回词汇 ID 列表
 */
export async function processVocabularies(vocabularies: any[]) {
  const vocabIds: string[] = [];

  for (const vocab of vocabularies) {
    const processed = await getOrCreateVocabulary({
      word: vocab.word,
      phonetic: vocab.phonetic,
      definitionCn: vocab.definition_cn,
      etymology: vocab.etymology,
      cognates: vocab.cognates,
      exampleSentence: vocab.example?.sentence,
      exampleTranslation: vocab.example?.translation_cn
    });
    
    vocabIds.push(processed.id);
  }

  return vocabIds;
}
```

#### ✅ 任务 3.3：编写题目导入脚本

```typescript
// scripts/importers/question_importer.ts

import { PrismaClient } from '@prisma/client';
import { processVocabularies } from '../utils/deduplication';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * 导入单个题目
 */
export async function importQuestion(jsonData: any) {
  console.log(`\n📝 开始导入题目: ${jsonData.uuid}`);

  try {
    // 1. 处理词汇（去重）
    console.log('  → 处理词汇...');
    const vocabIds = await processVocabularies(jsonData.vocabulary);

    // 2. 创建或更新题目
    console.log('  → 创建/更新题目...');
    const question = await prisma.question.upsert({
      where: { uuid: jsonData.uuid },
      update: {
        sourceId: jsonData.source_id,
        version: jsonData.version,
        questionType: jsonData.questionType || 'TC',
        questionText: jsonData.questionText,
        options: jsonData.options,
        correctAnswer: jsonData.correctAnswer,
        difficulty: jsonData.difficulty.level,
        difficultyScore: jsonData.difficulty.score,
        difficultyFactors: jsonData.difficulty.factors,
        analysis: jsonData.analysis,
        updatedAt: new Date()
      },
      create: {
        uuid: jsonData.uuid,
        sourceId: jsonData.source_id,
        version: jsonData.version,
        questionType: jsonData.questionType || 'TC',
        questionText: jsonData.questionText,
        options: jsonData.options,
        correctAnswer: jsonData.correctAnswer,
        difficulty: jsonData.difficulty.level,
        difficultyScore: jsonData.difficulty.score,
        difficultyFactors: jsonData.difficulty.factors,
        analysis: jsonData.analysis
      }
    });

    // 3. 建立题目-词汇关联
    console.log('  → 建立词汇关联...');
    
    // 先删除旧的关联
    await prisma.questionVocabulary.deleteMany({
      where: { questionId: question.id }
    });

    // 创建新的关联
    for (const vocabId of vocabIds) {
      await prisma.questionVocabulary.create({
        data: {
          questionId: question.id,
          vocabularyId: vocabId
        }
      });
    }

    console.log(`✅ 题目导入成功: ${jsonData.uuid}`);
    return { success: true, questionId: question.id };

  } catch (error) {
    console.error(`❌ 导入失败: ${error}`);
    return { success: false, error };
  }
}

/**
 * 批量导入题目
 */
export async function importQuestionsFromDirectory(dirPath: string) {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  
  console.log(`\n🚀 开始批量导入，共 ${files.length} 个文件\n`);

  const results = {
    success: 0,
    failed: 0,
    errors: [] as any[]
  };

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const result = await importQuestion(jsonData);
    
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ file, error: result.error });
    }
  }

  console.log(`\n📊 导入完成统计:`);
  console.log(`  ✅ 成功: ${results.success}`);
  console.log(`  ❌ 失败: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log(`\n❌ 失败详情:`);
    results.errors.forEach(e => {
      console.log(`  - ${e.file}: ${e.error}`);
    });
  }

  await prisma.$disconnect();
}

// 命令行执行
if (require.main === module) {
  const dirPath = process.argv[2] || './content/unprocessed';
  importQuestionsFromDirectory(dirPath);
}
```

#### ✅ 任务 3.4：添加脚本到 package.json

```json
{
  "scripts": {
    "import:questions": "ts-node scripts/importers/question_importer.ts",
    "import:dev": "ts-node scripts/importers/question_importer.ts ./content/test",
    "db:reset": "prisma migrate reset && prisma db push",
    "cms:dev": "cd cms && npm run dev"
  }
}
```

---

### 🧪 第四阶段：闭环测试（预计 1 天）

#### ✅ 任务 4.1：准备测试数据

```bash
# 创建测试目录
mkdir -p content/test

# 将您提供的示例 JSON 保存为 test_question_1.json
```

#### ✅ 任务 4.2：执行完整测试流程

```bash
# 1. 运行导入脚本
npm run import:dev

# 2. 检查数据库
npx prisma studio

# 3. 检查 Directus 后台
# 访问 http://localhost:8055
# 验证题目和词汇是否正确显示

# 4. 重复导入测试（验证去重）
npm run import:dev
# 应该看到 "词汇已存在" 的提示

# 5. 修改 JSON 后再次导入
# 验证 upsert 逻辑是否正确更新
```

#### ✅ 任务 4.3：前端验证

```bash
# 创建简单的测试页面
# src/app/test-question/page.tsx
```

---

### 🏭 第五阶段：生产节奏（持续进行）

#### ✅ 任务 5.1：建立日常工作流

```
每日工作循环：
1. 生成 JSON 解析文件（使用您的 Prompt）
2. 保存到 content/unprocessed/
3. 运行导入脚本: npm run import:questions
4. 在 Directus 中审核和微调
5. Git 提交备份
6. 更新 Trello 看板
```

#### ✅ 任务 5.2：监控和优化

- 定期检查词汇重复率
- 优化导入脚本性能
- 收集常见问题并改进

---

## 📊 项目里程碑

| 阶段 | 预计时间 | 关键交付物 | 状态 |
|------|---------|-----------|------|
| 阶段 1 | 1-2 天 | 数据库 Schema | ⏳ 待开始 |
| 阶段 2 | 2-3 天 | Directus 后台 | ⏳ 待开始 |
| 阶段 3 | 2-3 天 | 导入脚本 | ⏳ 待开始 |
| 阶段 4 | 1 天 | 闭环测试 | ⏳ 待开始 |
| 阶段 5 | 持续 | 内容生产 | ⏳ 待开始 |

---

## 🎯 成功标准

### 技术指标
- [ ] 词汇去重率 > 95%
- [ ] 导入成功率 > 99%
- [ ] 单题导入时间 < 2秒
- [ ] Directus 响应时间 < 500ms

### 业务指标
- [ ] 完成 10 道题的完整测试
- [ ] 建立稳定的日常工作流
- [ ] 前端成功展示数据库内容

---

## 📝 注意事项

### 安全
- ✅ 所有敏感信息使用环境变量
- ✅ 开发和生产环境严格分离
- ✅ 定期备份数据库

### 性能
- ✅ 使用事务处理批量操作
- ✅ 为常用查询添加索引
- ✅ 监控数据库连接池

### 可维护性
- ✅ 代码添加详细注释
- ✅ 保持 Schema 版本控制
- ✅ 记录所有重要决策

---

**最后更新**: 2025-10-05  
**维护者**: Hajimi 开发团队  
**基于**: Gemini 建议 + 项目实际情况
