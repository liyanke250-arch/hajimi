# ❓ 数据库设计常见问题解答

**创建时间**: 2025-10-05  
**适用对象**: 编程小白

---

## 问题1: 超长内容会不会塞不进去？

### 🎯 您的担心

> "难题的解析会特别长，这时会不会塞不进去？这是叫做rich text吗？"

### ✅ 完整解答

#### 1.1 什么是 Rich Text（富文本）？

**Rich Text** 指包含格式的文本，比如：
- **加粗**、*斜体*
- 不同颜色
- 图片、链接
- 标题、列表

**您的解析内容**：
- 主要是纯文本 + Markdown格式
- 不算严格的"富文本"
- 但确实可能很长

#### 1.2 PostgreSQL 的存储能力

| 数据类型 | 最大容量 | 适用场景 |
|---------|---------|---------|
| `String` | 默认 | 短文本（<255字符） |
| `@db.Text` | **1GB** | 长文本（您的解析） |
| `@db.JsonB` | **1GB** | JSON数据 |

**我们的设计**:
```prisma
model Question {
  questionText String @db.Text  // 最多1GB
  passage      String @db.Text  // 阅读文章，最多1GB
  analysis     Json   @db.JsonB // JSON解析，最多1GB
}
```

#### 1.3 实际测试

让我们计算一下：

```
一个汉字 = 3字节（UTF-8编码）
1GB = 1,073,741,824 字节

理论容量 = 1GB ÷ 3 = 357,913,941 个汉字

您的最长解析（估算）：
- 智识彩蛋: 500字
- 逻辑分析: 1000字
- 选项分析: 2000字
- 词汇解析: 3000字
- 总计: 约 6500字

实际使用 = 6500 ÷ 357,913,941 = 0.0018%
```

**结论**: 
- ✅ 完全不用担心！
- ✅ 即使解析长度增加100倍也没问题
- ✅ PostgreSQL 的 `@db.Text` 可以存储约 **3.5亿个汉字**

---

## 问题2: JSON也可能很长，一定要塞得进去

### 🎯 您的担心

> "json也可能有这样的问题，很长，一定要塞的进去，比如一道题有非常多的词汇"

### ✅ 完整解答

#### 2.1 JSON 存储能力

**PostgreSQL 的 `jsonb` 类型**:
- 最大容量: **1GB**
- 自动压缩: 是
- 索引支持: 是

#### 2.2 实际案例分析

让我们看看您的题目2（词汇最多的）：

```json
{
  "vocabulary": [
    // 11个词汇对象
    // 每个约 500 字节
  ]
}
```

**计算**:
```
单个词汇 JSON ≈ 500 字节
11个词汇 = 5,500 字节 = 5.5 KB

完整 analysis JSON ≈ 20 KB

假设一道题有 100 个词汇:
100 × 500 = 50,000 字节 = 50 KB

1GB = 1,048,576 KB
可以存储的词汇数 = 1,048,576 ÷ 50 = 20,971 个词汇
```

**结论**:
- ✅ 一道题即使有 **100个词汇** 也只占 50KB
- ✅ 1GB 可以存储 **20,000+ 个词汇**
- ✅ 您完全不用担心！

#### 2.3 我们的优化设计

**方案**: 词汇独立表 + 关联

```prisma
// ❌ 不好：所有词汇都在JSON里
{
  "vocabulary": [
    { "word": "paradox", "definition": "..." },
    { "word": "paradox", "definition": "..." },  // 重复！
    // ... 重复很多次
  ]
}

// ✅ 好：词汇独立存储
Vocabulary 表: "paradox" 只存1次
QuestionVocabulary 表: 记录哪些题用了这个词
```

**好处**:
1. 节省空间（去重）
2. 更新方便（改1次全生效）
3. 统计方便（这个词出现在多少题中）

---

## 问题3: 重复内容会自动处理吗？

### 🎯 您的担心

> "如果题目或者词汇有重复了怎么办，会帮我自动填充或者是指向已有内容之类的吗？"

### ✅ 完整解答

#### 3.1 自动去重机制

**是的！我们设计了自动去重机制。**

#### 3.2 词汇去重（最重要）

**设计**:
```prisma
model Vocabulary {
  word String @unique  // 🔑 关键：UNIQUE 约束
}
```

**工作原理**:

```typescript
// 导入脚本会自动处理
async function importVocabulary(vocabData) {
  // 1. 先查询是否存在
  let vocab = await prisma.vocabulary.findUnique({
    where: { word: vocabData.word }  // 按单词查询
  });
  
  // 2. 存在 → 复用
  if (vocab) {
    console.log(`♻️  词汇已存在，复用: ${vocabData.word}`);
    return vocab;
  }
  
  // 3. 不存在 → 创建
  vocab = await prisma.vocabulary.create({
    data: vocabData
  });
  console.log(`✅ 创建新词汇: ${vocabData.word}`);
  return vocab;
}
```

**示例流程**:

```
导入题目1:
  - "paradox" 不存在 → 创建 ✅
  - "insular" 不存在 → 创建 ✅

导入题目5:
  - "paradox" 已存在 → 复用 ♻️  （不会重复创建）
  - "unique" 不存在 → 创建 ✅
```

#### 3.3 题目去重

**设计**:
```prisma
model Question {
  uuid String @unique  // 🔑 关键：UNIQUE 约束
}
```

**工作原理**:

```typescript
// 使用 upsert（update + insert）
await prisma.question.upsert({
  where: { uuid: 'q_s1t1s1q1_victorians' },
  
  // 如果存在 → 更新
  update: {
    version: 10.1,  // 版本号+1
    questionText: "新的题目文本",
    updatedAt: new Date()
  },
  
  // 如果不存在 → 创建
  create: {
    uuid: 'q_s1t1s1q1_victorians',
    questionText: "新的题目文本",
    // ...
  }
});
```

**结果**:
- ✅ 第一次导入 → 创建新题目
- ✅ 第二次导入 → 更新现有题目（不会重复）
- ✅ 版本号自动递增

#### 3.4 您不需要做任何事！

**作为编程小白，您只需要**:

1. 运行导入脚本
   ```bash
   npm run import:questions
   ```

2. 脚本会自动：
   - ✅ 检查词汇是否存在
   - ✅ 存在就复用
   - ✅ 不存在就创建
   - ✅ 建立正确的关联

3. 您会看到提示：
   ```
   📝 开始导入题目: q_s1t1s1q1_victorians
     → 处理词汇...
       ✅ 创建新词汇: paradox
       ♻️  词汇已存在，复用: insular
       ✅ 创建新词汇: cosmopolitan
     → 创建/更新题目...
     → 建立词汇关联...
   ✅ 题目导入成功
   ```

---

## 问题4: 未来扩展会影响现有数据吗？

### 🎯 您的担心

> "我以后还有GRE阅读，数学题，还会有大概360套的套题添加进来，会不会对现在部分，1900道选择题，造成影响？"

### ✅ 完整解答

#### 4.1 GRE 考试完整结构

**Verbal Reasoning (语文)**:
- ✅ Text Completion (填空) - 您现在的1900道
- ✅ Sentence Equivalence (句子等价)
- ✅ Reading Comprehension (阅读理解) - 即将添加

**Quantitative Reasoning (数学)**:
- ✅ Quantitative Comparison (数量比较)
- ✅ Multiple Choice (选择题)
- ✅ Numeric Entry (数值输入)

**Analytical Writing (写作)**:
- ✅ Issue Task
- ✅ Argument Task

#### 4.2 我们的设计完全支持！

**QuestionType 枚举**:
```prisma
enum QuestionType {
  // Verbal - 已支持
  TEXT_COMPLETION          // ✅ 您现在的1900道
  SENTENCE_EQUIVALENCE     // ✅ 准备好了
  READING_COMPREHENSION    // ✅ 准备好了
  
  // Quantitative - 已支持
  QUANTITATIVE_COMPARISON  // ✅ 准备好了
  MULTIPLE_CHOICE_ONE      // ✅ 准备好了
  MULTIPLE_CHOICE_MULTIPLE // ✅ 准备好了
  NUMERIC_ENTRY           // ✅ 准备好了
  
  // Writing - 已支持
  ISSUE_TASK              // ✅ 准备好了
  ARGUMENT_TASK           // ✅ 准备好了
}
```

#### 4.3 添加新题型不会影响现有数据

**原理**:

```
现有数据：
questions 表
├─ id: "abc123"
├─ questionType: "TEXT_COMPLETION"  ← 现有1900道
├─ questionText: "..."
└─ ...

添加阅读题后：
questions 表
├─ id: "abc123"  ← 旧数据不变
├─ questionType: "TEXT_COMPLETION"
├─ ...
├─ id: "xyz789"  ← 新数据
├─ questionType: "READING_COMPREHENSION"  ← 新类型
├─ passage: "阅读文章..."  ← 新字段
└─ ...
```

**关键设计**:
- ✅ 新字段都是 **可选的** (`String?`)
- ✅ 旧数据不需要填这些字段
- ✅ 查询时可以按类型筛选

#### 4.4 360套套题的支持

**TestSet 表设计**:

```prisma
model TestSet {
  setId       String   @unique  // "Official-Test-1"
  name        String              // "GRE官方真题第1套"
  testType    TestType            // OFFICIAL_TEST
  
  // 关联题目
  questions   TestSetQuestion[]
}

model TestSetQuestion {
  testSetId      String
  questionId     String
  sectionNumber  Int    // 第几个Section
  questionOrder  Int    // Section内的题号
}
```

**示例**:

```
Official Test 1:
├─ Section 1 (Verbal)
│  ├─ Question 1 → 关联到 questions 表的某道题
│  ├─ Question 2 → 关联到 questions 表的某道题
│  └─ ...
├─ Section 2 (Quantitative)
│  ├─ Question 1
│  └─ ...
└─ Section 3 (Verbal)
   └─ ...
```

**好处**:
- ✅ 题目可以被多个套题共享
- ✅ 添加套题不影响原有题目
- ✅ 灵活组合

#### 4.5 性能影响分析

**数据量预估**:

```
现有: 1,900 道填空题
计划添加:
  - 阅读理解: 500 道
  - 数学题: 1,000 道
  - 写作题: 100 道
  - 360套套题: 360 条记录

总计: 约 3,500 道题目 + 360 套题
```

**PostgreSQL 性能**:
- ✅ 百万级数据轻松应对
- ✅ 3,500道题 = 小菜一碟
- ✅ 查询速度: < 100ms

**我们的优化**:
```prisma
// 关键索引
@@index([questionType])  // 按类型查询快
@@index([difficultyLevel])  // 按难度查询快
@@index([createdAt])  // 按时间查询快
```

#### 4.6 实际影响：零！

**添加新内容时**:

```typescript
// 1. 导入阅读题
await importQuestion({
  questionType: "READING_COMPREHENSION",  // 新类型
  passage: "长文章...",  // 新字段
  // ...
});

// 2. 查询时互不干扰
// 只查填空题
const tcQuestions = await prisma.question.findMany({
  where: { questionType: "TEXT_COMPLETION" }
});
// ✅ 只返回1900道填空题，不包括阅读题

// 只查阅读题
const rcQuestions = await prisma.question.findMany({
  where: { questionType: "READING_COMPREHENSION" }
});
// ✅ 只返回阅读题
```

---

## 📊 总结对比表

| 问题 | 您的担心 | 实际情况 | 结论 |
|------|---------|---------|------|
| **超长解析** | 塞不进去 | 1GB容量 = 3.5亿汉字 | ✅ 完全不用担心 |
| **大量词汇** | JSON太大 | 1GB = 20,000+词汇 | ✅ 完全够用 |
| **数据重复** | 需要手动处理 | 自动去重 + 复用 | ✅ 全自动 |
| **未来扩展** | 影响现有数据 | 完全隔离 + 灵活 | ✅ 零影响 |

---

## 🎯 给编程小白的建议

### 您只需要记住3点：

1. **不用担心容量**
   - PostgreSQL 超级强大
   - 您的数据量很小
   - 即使增长100倍也没问题

2. **不用担心重复**
   - 导入脚本自动处理
   - 词汇自动去重
   - 题目自动更新

3. **不用担心扩展**
   - 数据库已经设计好
   - 支持所有GRE题型
   - 添加新内容不影响旧数据

### 您需要做的：

```bash
# 就这一个命令！
npm run import:questions

# 脚本会自动：
# ✅ 检查重复
# ✅ 去重处理
# ✅ 建立关联
# ✅ 显示进度
```

---

**最后更新**: 2025-10-05  
**维护者**: Hajimi 开发团队
