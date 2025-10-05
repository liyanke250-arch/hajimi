# 📊 Hajimi GRE 题库数据库设计文档

**版本**: 2.0  
**创建时间**: 2025-10-05  
**基于**: 7道真实题目的JSON数据分析

---

## 🎯 设计目标

1. **避免数据重复** - 词汇全局唯一，多题共享
2. **保持灵活性** - 复杂JSON保留原始结构
3. **查询高效** - 合理的索引和关联
4. **易于维护** - 清晰的表结构和命名
5. **支持扩展** - 预留用户功能接口

---

## 📐 核心设计决策

### 决策 1: 词汇表独立 + 去重

**问题**: 同一个词可能出现在多道题中

**解决方案**:
```
Vocabulary 表
├─ word 字段设为 UNIQUE
├─ 通过 QuestionVocabulary 关联表实现多对多
└─ 导入时先查询，存在则复用，不存在则创建
```

**好处**:
- ✅ 避免重复存储
- ✅ 词汇统计准确（出现次数、难度分布）
- ✅ 更新词汇时，所有关联题目自动生效

**示例**:
```typescript
// "paradox" 出现在题1和题5
// 数据库中只有1条 Vocabulary 记录
// 但有2条 QuestionVocabulary 关联记录
```

---

### 决策 2: 选项独立表 vs JSON

**问题**: 选项是独立表还是JSON字段？

**最终方案**: **独立表** (QuestionOption)

**原因**:
```
独立表的优势:
✅ 方便查询某个选项的统计（如"insular"被选错多少次）
✅ 支持选项级别的分析（陷阱类型）
✅ 未来可以添加用户选择统计

JSON的劣势:
❌ 查询不便
❌ 统计困难
❌ 扩展受限
```

---

### 决策 3: analysis 对象如何存储？

**问题**: analysis 包含多层嵌套（intellectualEasterEgg, logicType, logicAndWalkthrough等）

**最终方案**: **保留完整JSON** + **提取关键字段**

**结构**:
```prisma
model Question {
  // 提取的关键字段（方便查询）
  difficultyLevel   String
  difficultyScore   Float
  sentenceComplexity String
  vocabRarity       String
  logicSubtlety     String
  
  // 完整的analysis对象（保持灵活性）
  analysis  Json
}
```

**好处**:
- ✅ 常用字段可以直接查询和排序
- ✅ 完整JSON保留所有细节
- ✅ 前端可以直接使用JSON渲染
- ✅ 未来修改JSON结构不影响数据库

---

### 决策 4: UUID 设计

**问题**: 使用数据库自增ID还是业务UUID？

**最终方案**: **两者都用**

**结构**:
```prisma
model Question {
  id    String @id @default(cuid())  // 数据库主键
  uuid  String @unique                // 业务标识
}

model Vocabulary {
  id    String @id @default(cuid())  // 数据库主键
  uuid  String @unique                // 业务标识
  word  String @unique                // 词汇本身也是唯一标识
}
```

**原因**:
- `id`: 数据库内部关联，性能更好
- `uuid`: 业务逻辑使用，人类可读
- `word`: 词汇的自然主键，方便去重

---

## 🗂️ 表结构详解

### 1. Questions 表

**用途**: 存储题目核心信息

**关键字段**:
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| uuid | String | 业务ID | "q_s1t1s1q1_victorians" |
| sourceId | String | 来源标识 | "Stage 1 Test 1 Section 1-1" |
| questionText | Text | 题目文本 | "It is a paradox..." |
| correctAnswer | String | 正确答案 | "B" 或 "C, E" |
| difficultyLevel | String | 难度等级 | "Easy", "Medium", "Hard" |
| analysis | Json | 完整解析 | { intellectualEasterEgg, ... } |

**索引**:
- `uuid` (unique)
- `sourceId`
- `difficultyLevel`

---

### 2. QuestionOption 表

**用途**: 存储题目选项

**关键字段**:
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| questionId | String | 关联题目 | cuid |
| choice | String | 选项标识 | "A", "B", "C" |
| text | String | 选项文本 | "capricious" |
| isCorrect | Boolean | 是否正确 | true/false |
| analysisText | Text | 选项分析 | "这是一个无关概念的选项..." |
| trapTypes | String[] | 陷阱类型 | ["Irrelevant Concept"] |

**唯一约束**: `[questionId, choice]`

---

### 3. Vocabularies 表

**用途**: 全局词汇库

**关键字段**:
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| uuid | String | 业务ID | "v_20250921_paradox" |
| word | String | 单词（唯一） | "paradox" |
| phonetic | String | 音标 | "[ˈpærədɒks]" |
| definitionCn | Text | 中文释义 | "n. 悖论" |
| etymology | Json | 词源信息 | { deconstruction, ... } |
| cognates | Json | 同源词 | [{ word, definition_cn }] |

**唯一约束**: `word`

**关键**: `word` 字段确保全局唯一，实现去重

---

### 4. QuestionVocabulary 表

**用途**: 题目-词汇多对多关联

**关键字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| questionId | String | 题目ID |
| vocabularyId | String | 词汇ID |
| role | String | 词汇角色（可选） |

**唯一约束**: `[questionId, vocabularyId]`

**示例查询**:
```typescript
// 查询题目的所有词汇
const question = await prisma.question.findUnique({
  where: { uuid: 'q_s1t1s1q1_victorians' },
  include: {
    vocabularies: {
      include: {
        vocabulary: true
      }
    }
  }
});

// 查询词汇出现在哪些题目中
const vocab = await prisma.vocabulary.findUnique({
  where: { word: 'paradox' },
  include: {
    questions: {
      include: {
        question: true
      }
    }
  }
});
```

---

## 🔄 数据导入流程

### 流程图

```
JSON文件
   ↓
1. 解析题目基本信息 → 创建/更新 Question
   ↓
2. 解析选项 → 创建 QuestionOption (先删除旧的)
   ↓
3. 解析词汇数组
   ↓
   对每个词汇:
   ├─ 查询 Vocabulary (by word)
   ├─ 存在? → 复用
   └─ 不存在? → 创建新记录
   ↓
4. 创建 QuestionVocabulary 关联
   ↓
✅ 完成
```

### 伪代码

```typescript
async function importQuestion(jsonData) {
  // 1. 创建/更新题目
  const question = await prisma.question.upsert({
    where: { uuid: jsonData.uuid },
    update: { /* ... */ },
    create: { /* ... */ }
  });

  // 2. 处理选项
  await prisma.questionOption.deleteMany({
    where: { questionId: question.id }
  });
  
  for (const opt of jsonData.options) {
    await prisma.questionOption.create({
      data: {
        questionId: question.id,
        choice: opt.choice,
        text: opt.text,
        isCorrect: jsonData.correctAnswer.includes(opt.choice),
        // ... 从 analysis.optionsAnalysis 提取
      }
    });
  }

  // 3. 处理词汇（去重）
  const vocabIds = [];
  for (const vocab of jsonData.vocabulary) {
    let vocabRecord = await prisma.vocabulary.findUnique({
      where: { word: vocab.word }
    });
    
    if (!vocabRecord) {
      vocabRecord = await prisma.vocabulary.create({
        data: { /* ... */ }
      });
    }
    
    vocabIds.push(vocabRecord.id);
  }

  // 4. 创建关联
  await prisma.questionVocabulary.deleteMany({
    where: { questionId: question.id }
  });
  
  for (const vocabId of vocabIds) {
    await prisma.questionVocabulary.create({
      data: {
        questionId: question.id,
        vocabularyId: vocabId
      }
    });
  }
}
```

---

## 📈 性能优化策略

### 1. 索引优化

```sql
-- 已添加的索引
CREATE INDEX idx_questions_uuid ON questions(uuid);
CREATE INDEX idx_questions_source_id ON questions(source_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX idx_vocabularies_word ON vocabularies(word);
CREATE INDEX idx_qv_question ON question_vocabularies(question_id);
CREATE INDEX idx_qv_vocabulary ON question_vocabularies(vocabulary_id);
```

### 2. 批量操作

```typescript
// ❌ 不好：逐个插入
for (const vocab of vocabularies) {
  await prisma.vocabulary.create({ data: vocab });
}

// ✅ 好：批量插入
await prisma.vocabulary.createMany({
  data: vocabularies,
  skipDuplicates: true  // 跳过重复
});
```

### 3. 事务处理

```typescript
await prisma.$transaction(async (tx) => {
  const question = await tx.question.create({ /* ... */ });
  await tx.questionOption.createMany({ /* ... */ });
  await tx.questionVocabulary.createMany({ /* ... */ });
});
```

---

## 🎨 前端使用示例

### 1. 获取题目完整信息

```typescript
const question = await prisma.question.findUnique({
  where: { uuid: 'q_s1t1s1q1_victorians' },
  include: {
    options: true,
    vocabularies: {
      include: {
        vocabulary: true
      }
    }
  }
});

// 返回结构
{
  id: "...",
  uuid: "q_s1t1s1q1_victorians",
  questionText: "It is a paradox...",
  correctAnswer: "B",
  analysis: { /* 完整JSON */ },
  options: [
    { choice: "A", text: "capricious", isCorrect: false },
    { choice: "B", text: "insular", isCorrect: true },
    // ...
  ],
  vocabularies: [
    {
      vocabulary: {
        word: "paradox",
        phonetic: "[ˈpærədɒks]",
        definitionCn: "n. 悖论",
        // ...
      }
    },
    // ...
  ]
}
```

### 2. 按难度查询题目

```typescript
const easyQuestions = await prisma.question.findMany({
  where: {
    difficultyLevel: 'Easy'
  },
  orderBy: {
    difficultyScore: 'asc'
  },
  take: 10
});
```

### 3. 词汇统计

```typescript
// 查询出现次数最多的词汇
const topWords = await prisma.vocabulary.findMany({
  include: {
    _count: {
      select: { questions: true }
    }
  },
  orderBy: {
    questions: {
      _count: 'desc'
    }
  },
  take: 50
});
```

---

## 🚀 迁移步骤

### 步骤 1: 更新 Schema

```bash
# 备份当前 schema
cp prisma/schema.prisma prisma/schema.prisma.backup

# 使用新 schema
cp prisma/schema_optimized.prisma prisma/schema.prisma
```

### 步骤 2: 创建迁移

```bash
# 开发环境
npx prisma migrate dev --name add_gre_content_structure

# 检查迁移SQL
cat prisma/migrations/[timestamp]_add_gre_content_structure/migration.sql
```

### 步骤 3: 应用迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 打开数据库查看
npx prisma studio
```

---

## 📝 注意事项

### 1. 词汇去重逻辑

**重要**: 必须使用 `word` 字段查询，而不是 `uuid`

```typescript
// ✅ 正确
const vocab = await prisma.vocabulary.findUnique({
  where: { word: 'paradox' }
});

// ❌ 错误：uuid 是题目特定的
const vocab = await prisma.vocabulary.findUnique({
  where: { uuid: 'v_20250921_paradox' }
});
```

### 2. JSON 字段更新

```typescript
// 更新 analysis 的某个字段
await prisma.question.update({
  where: { uuid: '...' },
  data: {
    analysis: {
      ...existingAnalysis,
      intellectualEasterEgg: newEasterEgg
    }
  }
});
```

### 3. 级联删除

- 删除题目 → 自动删除选项和关联
- 删除词汇 → 自动删除关联（但不删除题目）

---

## 🎯 未来扩展

### 1. 用户功能

- User 表已预留
- UserPractice 表已预留
- 可以记录用户答题历史

### 2. 统计功能

- LogicType 表（逻辑类型统计）
- TrapType 表（陷阱类型统计）
- WordRelation 表（同义/反义词）

### 3. 搜索功能

```typescript
// 全文搜索（需要添加扩展）
await prisma.$queryRaw`
  SELECT * FROM questions
  WHERE to_tsvector('english', question_text) @@ to_tsquery('paradox')
`;
```

---

**最后更新**: 2025-10-05  
**维护者**: Hajimi 开发团队
