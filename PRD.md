# GRE智能备考平台产品需求文档 (PRD)

| 项目信息     | 详情          |
| ------------ | ------------- |
| **文档版本** | v5.0-nextjs   |
| **创建日期** | 2025年8月23日 |
| **最后更新** | 2025年8月23日 |
| **项目代号** | Hajimi        |
| **负责人**   | 开发团队      |

---

## 📋 目录

1. [项目概述](#1-项目概述)
   - [产品愿景与定位](#11-产品愿景与定位)
   - [核心价值主张](#12-核心价值主张)
   - [商业模式](#13-商业模式)
2. [GRE题型深度分析](#2-gre题型深度分析)
   - [Verbal Reasoning (语文推理)](#21-verbal-reasoning-语文推理)
   - [Quantitative Reasoning (数学推理)](#22-quantitative-reasoning-数学推理)
   - [Analytical Writing (分析性写作)](#23-analytical-writing-分析性写作)
3. [功能需求](#3-功能需求)
   - [核心练习功能](#31-核心练习功能)
   - [用户与数据分析](#32-用户与数据分析)
   - [单词模块](#33-单词模块-核心功能)
4. [技术架构](#4-技术架构-nextjs生态重构版)
   - [整体架构](#41-整体架构)
   - [核心技术栈](#42-核心技术栈)
   - [数据与服务 (BaaS)](#43-数据与服务-baas)
5. [数据库设计](#5-数据库设计-prisma-schema定义)
6. [开发计划](#6-开发计划-milestones-for-nextjs-mvp)
   - [Sprint 0: 项目奠基与CI/CD流水线搭建](#sprint-0-项目奠基与cicd流水线搭建)
   - [Sprint 1: 用户认证与数据基础](#sprint-1-用户认证与数据基础)
   - [Sprint 2: 核心答题闭环](#sprint-2-核心答题闭环)
7. [质量保证](#7-质量保证)
   - [测试策略](#71-测试策略)
   - [代码质量与协作](#72-代码质量与协作)
8. [风险评估与缓解策略](#8-风险评估与缓解策略)
   - [技术风险](#81-技术风险)
   - [市场风险](#82-市场风险)
   - [运营风险](#83-运营风险)

---

## 🎯 项目概览

|    项目特性     | 详情                                              |
| :-------------: | :------------------------------------------------ |
| 🎓 **目标用户** | 全球GRE考生（重点：中国大陆市场）                 |
|  💻 **技术栈**  | Next.js + TypeScript + Prisma + Supabase + Vercel |
| 🚀 **部署方式** | Vercel全球CDN + 自动化CI/CD                       |
| 💰 **商业模式** | Freemium（免费版 + 专业版订阅）                   |
| 📊 **核心功能** | 智能练习 + 模考系统 + 错题本 + 单词记忆           |
| 🌐 **服务区域** | 全球（数据库：东京ap-northeast-1）                |

---

## 1. 项目概述

### 1.1 产品愿景与定位

打造一款基于现代TypeScript全栈技术栈的、世界一流的GRE（研究生入学考试）智能备考平台。我们致力于通过极致的性能、智能化的数据分析和无缝的用户体验，为全球考生提供最高效、最个性化的练习与模考工具，帮助他们达成目标分数。

### 1.2 核心价值主张

|      价值点       | 描述                                                                                  |
| :---------------: | :------------------------------------------------------------------------------------ |
|  🚀 **极致性能**  | 依托Vercel的全球边缘网络与Next.js的先进渲染策略，提供即时加载、流畅无延迟的答题体验。 |
|  🧠 **智能诊断**  | 通过精准的数据分析，平台能像私人教练一样，帮助用户快速定位知识盲区和能力弱点。        |
| 🎯 **个性化学习** | 从动态生成的错题本到AI驱动的学习路径规划，我们提供为每个用户量身定制的备考方案。      |
|  ✨ **现代体验**  | 简洁、直观、响应式的UI设计，让备考过程不再枯燥，成为一种高效且愉悦的体验。            |

### 1.3 商业模式

#### Freemium (免费增值)模式

| 版本                   | 功能范围                                                                                     | 目标                       |
| ---------------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| **免费版 (Free Tier)** | 有限的练习题、基础的答题历史和错题本功能                                                     | 吸引用户，展示产品核心价值 |
| **专业版 (Pro Tier)**  | 完整题库、无限次完整模考、AI驱动的详细学习报告、个性化学习路径推荐、高级单词本及写作辅助功能 | 主要收入来源               |

**目标用户**: 全球范围内准备GRE考试的在校大学生和在职人士，初期重点关注中国大陆市场。

## 2. GRE题型深度分析

### 2.1 Verbal Reasoning (语文推理)

**核心挑战**: 庞大的学术词汇量、对复杂长难句的结构分析能力、严谨的形式逻辑推理。

#### 2.1.1 阅读理解 (Reading Comprehension)

- **特点**: 题材广泛（社科、自然科学、人文），文章结构复杂（例如：新旧观点对比、现象解释、实验论证）
- **考察核心**: 信息定位、主旨归纳、作者态度判断、逻辑推理（例如：取非、延伸、类比）

#### 2.1.2 文本完成 (Text Completion)

- **特点**: 1至3个空格，通过上下文的逻辑关系（转折、递进、因果、对比）选择最恰当的词汇
- **考察核心**: 词汇的精准辨析和句子内部的短期逻辑推理的高度结合

#### 2.1.3 句子等价 (Sentence Equivalence)

- **特点**: 6个选项中选择2个，这两个正确选项不一定是严格的同义词，但填入后必须使整个句子的核心逻辑与含义等价
- **考察核心**: 精准的词义理解和对句子整体语气及内涵的把握

### 2.2 Quantitative Reasoning (数学推理)

**核心挑战**: 对数学概念的精确理解、快速心算与估算能力、数据图表分析和应用题建模。

#### 2.2.1 数量比较 (Quantitative Comparison)

- **特点**: 比较A、B两个量的大小关系。陷阱多，通常不需要算出精确值
- **考察核心**: 估算能力、特殊值法（0, 1, -1, 分数）的灵活应用、逻辑判断

#### 2.2.2 单选题 & 多选题 (Multiple Choice/Answer)

- **特点**: 传统的选择题形式，考察具体的数学知识点和综合应用
- **考察核心**: 扎实的数学基础知识（算术、代数、几何、数据分析）

#### 2.2.3 数值输入 (Numeric Entry)

- **特点**: 没有选项，要求计算出精确答案（整数或分数）。对计算的准确性要求最高
- **考察核心**: 细心和精确的计算能力，避免计算失误

### 2.3 Analytical Writing (分析性写作)

**核心挑战**: 批判性思维、构建逻辑严谨的论证、清晰且符合学术规范的书面表达。

#### 2.3.1 Issue Task

对一个具有争议性的社会话题进行观点论述，要求有深度、有逻辑地支持自己的立场，并考虑潜在的反方观点。

#### 2.3.2 Argument Task

对一段给定的、存在逻辑漏洞的论证进行批判性分析，准确找出其逻辑谬误并提出具体的改进建议。

## 3. 功能需求

### 3.1 核心练习功能

#### 3.1.1 练习模式

- **分类练习**: 用户可按题型（如阅读理解、数量比较）进行专项突破
- **难度选择**: 提供简单、中等、困难三个级别的题目筛选
- **计时练习**: 模拟考试时间压力，训练答题节奏

#### 3.1.2 模考模式

- **完整模考**: 完整模拟GRE机考流程，包括所有Section和休息时间
- **分段模考**: 用户可选择进行单独的Verbal或Quantitative Section模考
- **自适应难度** (高级功能): 根据用户在前一个同类型Section的答题表现，动态调整下一个同类型Section的难度，高度还原真实考试体验

#### 3.1.3 答题界面

- 清晰的题目与选项展示，支持数学公式（KaTeX）的正确渲染
- 提供"标记"功能，方便用户在练习或模考中回顾疑难题目
- 提供题目导航面板，允许用户在Section内自由跳转
- 显眼的倒计时器，并提供时间耗尽前的提醒

### 3.2 用户与数据分析

#### 3.2.1 用户系统 (由Supabase Auth驱动)

- 支持邮箱/密码注册与登录
- 支持Google/GitHub等主流第三方账号一键登录
- 提供个人资料管理页面，允许用户设置目标分数等信息

#### 3.2.2 学习仪表盘 (Dashboard)

- **答题日历** (热力图): 可视化展示用户的每日练习量和坚持情况
- **正确率统计**: 提供按题型、难度、知识点等多维度的正确率分析图表
- **时间分析**: 分析用户在不同题型上的平均答题用时，帮助优化时间分配
- **强弱项分析**: 通过算法智能识别用户的知识点薄弱环节

#### 3.2.3 错题本 (核心功能)

- 所有答错的题目将自动收录至错题本
- 支持按知识点或错误原因对错题进行分类和筛选
- 允许用户为每道错题添加个人笔记和反思
- 提供错题重做功能，并跟踪错题的掌握状态（已掌握/待巩固）

#### 3.2.4 学习报告 (Pro功能)

- 自动生成可供分享的周度/月度学习报告
- 以图表形式展示用户的进步曲线
- 分析用户当前水平与目标分数的差距，并提供针对性建议

### 3.3 单词模块 (核心功能)

#### 3.3.1 核心词库

- 内置权威的GRE核心词汇、同义词群组

#### 3.3.2 智能复习

- 基于艾宾浩斯遗忘曲线的智能复习算法（Spaced Repetition System, SRS），自动为用户安排复习计划

#### 3.3.3 个性化词库 (Pro功能)

- 从用户在练习中遇到的生词、错题词汇中自动抽词，生成个人专属的生词本

## 4. 技术架构 (Next.js生态重构版)

### 4.1 整体架构

采用基于Vercel平台的现代化全栈TypeScript架构。利用Next.js将前后端开发体验一体化，并通过BaaS（后端即服务）简化通用服务的开发，使团队能专注于核心业务逻辑。

### 4.2 核心技术栈

| 组件          | 技术选型                | 说明                                                                                              |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| **语言**      | TypeScript              | 为整个项目（前端、后端、脚本）提供端到端的类型安全，是AI协作的最佳语言                            |
| **全栈框架**  | Next.js (App Router)    | React的官方推荐框架。集成了前端渲染、后端API/Server Actions、服务器组件等功能，实现高效的全栈开发 |
| **UI库**      | React                   | 业界标准的声明式UI库，拥有最庞大的生态系统                                                        |
| **样式**      | TailwindCSS + shadcn/ui | 实用程序优先的CSS框架，结合高质量、可定制的UI组件配方，极大加速UI开发                             |
| **数据库ORM** | Prisma                  | 下一代Node.js和TypeScript的ORM。提供类型安全的数据库访问，自动生成客户端，杜绝SQL拼写错误         |
| **部署/托管** | Vercel                  | 提供全球CDN、Serverless Functions和无缝的Git集成，是Next.js应用的最佳部署平台                     |

### 4.3 数据与服务 (BaaS)

| 服务         | 技术选型              | 说明                                                                                                               |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **数据库**   | Supabase (PostgreSQL) | 完全托管、高可用、可轻松扩展的PostgreSQL服务。**区域将选择亚太地区（东京, ap-northeast-1）**以优化中国大陆访问速度 |
| **用户认证** | Supabase Auth         | 处理所有用户注册、登录、密码重置、会话管理等功能。通过其JS库与Next.js无缝集成                                      |
| **文件存储** | Supabase Storage      | 用于存储题目中的图片、用户头像等静态资源，自带CDN加速                                                              |

## 5. 数据库设计 (Prisma Schema定义)

> **注**: 以下Schema将在`prisma/schema.prisma`文件中定义。Prisma将自动根据此文件生成SQL迁移脚本并管理数据库状态。

```prisma
// file: prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==============
// 核心表结构
// ==============

model Profile {
  id           String    @id @default(uuid()) // 使用独立的UUID作为主键
  userId       String    @unique @map("user_id") // 关联到Supabase Auth的用户ID
  username     String?   @unique
  targetScore  Int?      @map("target_score")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // 关系
  sessions     PracticeSession[]
  userAnswers  UserAnswer[]
  vocabProgress UserVocabularyProgress[]

  @@map("profiles")
}

model Question {
  id             Int      @id @default(autoincrement())
  questionUid    String   @unique @map("question_uid")
  section        String   // "verbal", "quantitative"
  questionType   String   @map("question_type")
  difficulty     String   // "easy", "medium", "hard"
  content        Json
  correctAnswer  Json     @map("correct_answer")
  explanation    String?
  tags           String[]
  createdAt      DateTime @default(now()) @map("created_at")

  // 关系
  userAnswers    UserAnswer[]

  @@map("questions")
}

model UserAnswer {
  id               BigInt    @id @default(autoincrement())
  userId           String    @map("user_id")
  questionId       Int       @map("question_id")
  sessionUid       String    @map("session_uid")
  userAnswer       Json?     @map("user_answer")
  isCorrect        Boolean   @map("is_correct")
  timeSpentSeconds Int       @map("time_spent_seconds")
  answeredAt       DateTime  @default(now()) @map("answered_at")

  // 关系
  profile          Profile          @relation(fields: [userId], references: [userId])
  question         Question         @relation(fields: [questionId], references: [id])
  practiceSession  PracticeSession  @relation(fields: [sessionUid], references: [sessionUid])

  @@map("user_answers")
}

model PracticeSession {
  id               BigInt    @id @default(autoincrement())
  sessionUid       String    @unique @map("session_uid")
  userId           String    @map("user_id")
  sessionType      String    @map("session_type") // "practice", "mock_test"
  section          String?
  totalQuestions   Int       @map("total_questions")
  correctAnswers   Int       @map("correct_answers")
  totalTimeSeconds Int       @map("total_time_seconds")
  startedAt        DateTime  @default(now()) @map("started_at")
  completedAt      DateTime? @map("completed_at")

  // 关系
  profile          Profile      @relation(fields: [userId], references: [userId])
  userAnswers      UserAnswer[]

  @@map("practice_sessions")
}

// ==============
// 单词模块表结构
// ==============

model Vocabulary {
  id                 Int      @id @default(autoincrement())
  word               String   @unique
  definition         String
  pronunciation      String?
  exampleSentences   String[] @map("example_sentences")
  difficultyLevel    Int?     @map("difficulty_level")
  frequencyRank      Int?     @map("frequency_rank")
  createdAt          DateTime @default(now()) @map("created_at")

  // 关系
  userProgress       UserVocabularyProgress[]

  @@map("vocabulary")
}

model UserVocabularyProgress {
  id             BigInt    @id @default(autoincrement())
  userId         String    @map("user_id")
  wordId         Int       @map("word_id")
  masteryLevel   Int       @default(0) @map("mastery_level") // e.g., 0-5
  reviewCount    Int       @default(0) @map("review_count")
  lastReviewedAt DateTime? @map("last_reviewed_at")
  nextReviewAt   DateTime? @map("next_review_at")

  // 关系
  profile        Profile    @relation(fields: [userId], references: [userId])
  vocabulary     Vocabulary @relation(fields: [wordId], references: [id])

  @@unique([userId, wordId])
  @@map("user_vocabulary_progress")
}

## 6. 开发计划 (Milestones for Next.js MVP)

#### Sprint 0: 项目奠基与CI/CD流水线搭建

**总目标**: 准备好所有开发、部署和协作所需的基础设施，做到"代码一提交，网站就更新"。

| 任务 | 负责人 | 子任务 / 操作指南 | ✅ 验收标准 (如何检查) |
|------|--------|------------------|----------------------|
| **0.1: 云服务初始化** | [姓名] | 1. 在Supabase创建hajimi-prod项目(区域选东京)，保存数据库连接字符串<br>2. 在Vercel创建hajimi-prod项目 | 1. 检查: Supabase和Vercel仪表盘可访问 |
| **0.2: 本地项目初始化** | [姓名] | 1. 运行 `npx create-next-app@latest hajimi` (使用TypeScript, TailwindCSS, App Router)<br>2. 初始化Git仓库 | 1. 检查: 运行 `npm run dev`，能在 localhost:3000 看到Next.js欢迎页面 |
| **0.3: 集成Prisma** | [姓名] | 1. `npm install prisma --save-dev & npx prisma init`<br>2. 在.env文件中配置DATABASE_URL<br>3. 在prisma/schema.prisma中定义初始模型<br>4. `npx prisma migrate dev --name init` 创建第一个数据库迁移 | 1. 检查: 迁移成功，在Supabase中能看到创建的表<br>2. 检查: `npx prisma generate` 成功生成Prisma客户端 |
| **0.4: 自动化部署 (CI/CD)** | [姓名] | 1. 在GitHub创建私有仓库并推送代码<br>2. 将Vercel项目连接到该GitHub仓库<br>3. 在Vercel环境变量中配置所有Supabase相关的密钥和URL | 1. 检查: 推送代码到main分支后，Vercel自动构建和部署<br>2. 检查: 能通过Vercel提供的域名访问到Next.js欢迎页面 |

#### Sprint 1: 用户认证与数据基础

**总目标**: 搭建用户系统，并将核心数据（题目）录入数据库，打通用户身份验证。
| 任务 | 负责人 | 子任务 / 操作指南 | ✅ 验收标准 (如何检查) |
|------|--------|------------------|----------------------|
| **1.1: Supabase Auth集成** | [姓名] | 1. `npm install @supabase/supabase-js`<br>2. 创建Supabase客户端的单例<br>3. 使用Next.js Server Actions实现注册、登录、登出逻辑 | 1. 检查: 新用户能注册，并在Supabase Auth后台看到<br>2. 检查: 已有用户能登录和登出 |
| **1.2: 路由保护与用户状态** | [姓名] | 1. 创建/dashboard页面<br>2. 使用Next.js中间件(middleware.ts)或在页面Server Component中检查用户会话<br>3. 未登录访问/dashboard时，重定向到/login | 1. 检查: 未登录用户无法访问/dashboard<br>2. 检查: 创建一个能根据登录状态显示不同内容的动态导航栏 |
| **1.3: 题库导入脚本** | [姓名] | 1. 创建一个临时的seed_data/questions.json文件<br>2. 创建一个脚本 (scripts/seed.ts)，使用Prisma客户端读取JSON并批量创建题目<br>3. 在package.json中添加"db:seed": "ts-node scripts/seed.ts" | 1. 检查: 运行`npm run db:seed`后，Supabase的Question表中出现JSON文件中的数据 |

#### Sprint 2: 核心答题闭环

**总目标**: 实现MVP最核心的功能——用户选择题目、进行练习、提交答案并获得反馈。

| 任务 | 负责人 | 子任务 / 操作指南 | ✅ 验收标准 (如何检查) |
|------|--------|------------------|----------------------|
| **2.1: 题目获取逻辑** | [姓名] | 1. 创建一个Next.js Server Action: getPracticeQuestions(params)<br>2. Action内部使用Prisma，根据参数随机查询题目<br>3. 安全: 使用select只返回必要的、不含答案的字段 | 1. 检查: 创建一个测试页面，调用该Action能成功获取并展示题目数据<br>2. 检查: 返回的数据中不包含答案字段 |
| **2.2: 答题界面UI (shadcn/ui)** | [姓名] | 1. 安装shadcn/ui<br>2. 使用Card, Button, RadioGroup等组件搭建答题界面<br>3. 使用useState或useReducer管理客户端状态 | 1. 检查: 界面能清晰展示题目，用户可以交互选择答案<br>2. 检查: 倒计时、题目导航等基础功能正常 |
| **2.3: 答案提交与批改** | [姓名] | 1. 创建另一个Server Action: submitAnswers(payload)<br>2. Action内部在一个Prisma事务($transaction)中完成所有批改和数据库写入逻辑<br>3. 逻辑: 对比答案，计算分数，将结果写入UserAnswer和PracticeSession表<br>4. Action返回详细的批改结果 | 1. 检查: 调用该Action后，能在Supabase表中看到新创建的答题记录<br>2. 检查: Action返回的批改结果（分数、对错）准确无误 |
| **2.4: 结果展示页** | [姓名] | 1. 创建/practice/results/[sessionId]动态路由页面<br>2. 页面通过sessionId参数，调用一个Server Action从数据库获取该次练习的所有详细结果<br>3. 使用UI组件将批改结果清晰地展示给用户 | 1. 检查: 练习结束后，用户能看到一个详细的结果报告<br>2. 检查: 用户可以回顾自己做错的题、正确答案和解析。核心学习闭环完成！ |

#### Sprint 3: 数据分析与用户体验优化

**总目标**: 构建学习仪表盘、错题本系统，提供数据驱动的学习洞察。

| 任务 | 负责人 | 子任务 / 操作指南 | ✅ 验收标准 (如何检查) |
|------|--------|------------------|----------------------|
| **3.1: 学习仪表盘开发** | [姓名] | 1. 创建/dashboard页面布局<br>2. 实现答题日历热力图组件<br>3. 添加正确率统计图表（使用Chart.js或Recharts）<br>4. 实现时间分析和强弱项分析算法 | 1. 检查: 用户能看到直观的学习数据可视化<br>2. 检查: 各项统计数据准确反映用户的练习情况 |
| **3.2: 错题本系统** | [姓名] | 1. 创建/mistakes页面<br>2. 实现错题分类和筛选功能<br>3. 添加个人笔记功能<br>4. 实现错题重做和掌握状态跟踪 | 1. 检查: 用户能方便地管理和复习错题<br>2. 检查: 错题掌握状态能正确更新 |
| **3.3: 学习报告生成** | [姓名] | 1. 实现周度/月度报告生成算法<br>2. 创建报告展示页面<br>3. 添加报告分享功能<br>4. 实现进步曲线和目标差距分析 | 1. 检查: 能生成详细的学习报告<br>2. 检查: 报告内容准确且有指导价值 |

#### Sprint 4: 单词模块与智能功能

**总目标**: 实现单词记忆系统和AI驱动的个性化功能。

| 任务 | 负责人 | 子任务 / 操作指南 | ✅ 验收标准 (如何检查) |
|------|--------|------------------|----------------------|
| **4.1: 核心词库建设** | [姓名] | 1. 导入GRE核心词汇数据<br>2. 创建/vocabulary页面<br>3. 实现单词学习界面<br>4. 添加发音和例句功能 | 1. 检查: 词库数据完整且准确<br>2. 检查: 单词学习界面友好易用 |
| **4.2: 智能复习算法** | [姓名] | 1. 实现SRS（间隔重复）算法<br>2. 创建复习计划生成逻辑<br>3. 添加复习提醒功能<br>4. 实现掌握度评估 | 1. 检查: 复习计划科学合理<br>2. 检查: 算法能有效提升记忆效果 |
| **4.3: 个性化词库** | [姓名] | 1. 实现从练习中自动提取生词<br>2. 创建个人词库管理页面<br>3. 添加词汇标记和分类功能<br>4. 实现词汇学习进度跟踪 | 1. 检查: 能自动识别和收集用户生词<br>2. 检查: 个人词库功能完整 |

#### Sprint 5: 高级功能与性能优化

**总目标**: 实现模考系统、写作模块，并进行全面的性能优化。

| 任务 | 负责人 | 子任务 / 操作指南 | ✅ 验收标准 (如何检查) |
|------|--------|------------------|----------------------|
| **5.1: 完整模考系统** | [姓名] | 1. 实现完整GRE模考流程<br>2. 添加自适应难度算法<br>3. 创建模考结果分析页面<br>4. 实现模考历史记录 | 1. 检查: 模考体验接近真实考试<br>2. 检查: 自适应难度算法工作正常 |
| **5.2: 写作练习模块** | [姓名] | 1. 创建Issue Task和Argument Task练习页面<br>2. 实现写作计时器和字数统计<br>3. 添加写作模板和指导<br>4. 实现基础的写作评估功能 | 1. 检查: 写作练习界面完整<br>2. 检查: 基础评估功能有效 |
| **5.3: 性能优化** | [姓名] | 1. 实现图片和资源懒加载<br>2. 优化数据库查询性能<br>3. 添加缓存策略<br>4. 进行Core Web Vitals优化 | 1. 检查: 页面加载速度显著提升<br>2. 检查: Core Web Vitals指标达标 |

### 🗓️ 开发时间线总览

| Sprint | 阶段 | 预计时长 | 核心交付物 | 里程碑 |
|:---:|:---:|:---:|:---|:---:|
| **Sprint 0** | 🏗️ 基础设施 | 1-2周 | 项目搭建、CI/CD、数据库 | ✅ 开发环境就绪 |
| **Sprint 1** | 🔐 用户系统 | 2-3周 | 认证系统、题库导入 | ✅ 用户可注册登录 |
| **Sprint 2** | 🎯 核心功能 | 3-4周 | 练习系统、答题流程 | ✅ MVP核心闭环 |
| **Sprint 3** | 📊 数据分析 | 2-3周 | 仪表盘、错题本 | ✅ 学习洞察完整 |
| **Sprint 4** | 📚 单词模块 | 2-3周 | 词汇系统、智能复习 | ✅ 记忆功能上线 |
| **Sprint 5** | 🚀 高级功能 | 3-4周 | 模考系统、性能优化 | ✅ 产品功能完整 |

**总预计开发时长**: 13-19周（约3-5个月）

---

## 7. 质量保证

### 7.1 测试策略

- **单元测试 (Unit Testing)**: 使用Vitest或Jest，对核心的业务逻辑（如计分算法、Server Actions）和独立的React组件进行测试
- **集成测试 (Integration Testing)**: 在Prisma和Server Actions层面，确保与数据库的交互逻辑准确无误
- **端到端测试 (End-to-End Testing)**: 使用Cypress或Playwright，模拟真实用户操作流程（如注册-登录-答题-查看报告），确保整个应用流程通畅

### 7.2 代码质量与协作

- **代码审查 (Code Review)**: 所有代码变更必须通过Pull Request提交，并由至少一名其他团队成员审查通过后方可合并
- **静态分析与格式化**: 强制启用ESLint进行代码静态分析，并使用Prettier统一代码风格，通过CI流程（如GitHub Actions）自动检查
- **文档**: 核心函数和API接口（Server Actions）必须有完善的JSDoc注释
- **版本控制**: 遵循功能分支工作流，为每个颗粒任务创建独立分支，清晰管理功能开发、发布和修复流程

## 8. 风险评估与缓解策略

### 8.1 技术风险

| 风险 | 描述 | 缓解策略 |
|------|------|----------|
| **生态快速迭代** | Next.js和Vercel生态系统更新非常快，可能存在API变更或最佳实践演进 | 锁定主要依赖的版本，定期（而非持续）跟进升级，并为升级预留测试时间 |

### 8.2 市场风险

| 风险 | 描述 | 缓解策略 |
|------|------|----------|
| **竞争激烈** | GRE备考市场已有成熟产品如Magoosh、Manhattan Prep等 | 专注差异化优势（极致的Web体验、与现代工作流结合的智能分析），建立独特的用户价值 |

### 8.3 运营风险

| 风险 | 描述 | 缓解策略 |
|------|------|----------|
| **题库版权** | 题目内容可能涉及版权问题 | 与权威机构合作或自主开发原创题目，确保合规性 |

---

## 9. 附录

### 9.1 技术参考资源

| 资源类型 | 链接/说明 |
|----------|-----------|
| **Next.js 官方文档** | https://nextjs.org/docs |
| **Prisma 文档** | https://www.prisma.io/docs |
| **Supabase 文档** | https://supabase.com/docs |
| **shadcn/ui 组件库** | https://ui.shadcn.com |
| **TailwindCSS 文档** | https://tailwindcss.com/docs |

### 9.2 GRE 考试参考

| 资源 | 用途 |
|:---:|:---|
| **ETS 官方指南** | 题型标准和评分规则 |
| **GRE 词汇表** | 核心词汇数据源 |
| **官方练习题** | 题目质量基准 |

### 9.3 竞品分析

| 产品 | 优势 | 我们的差异化 |
|:---:|:---|:---|
| **Magoosh** | 题库丰富，视频讲解 | 更现代的技术栈，更好的用户体验 |
| **Manhattan Prep** | 权威性强，教学体系完整 | 智能化程度更高，个性化更强 |
| **Kaplan** | 品牌知名度高 | 更灵活的学习方式，更优的性价比 |

### 9.4 关键指标定义

| 指标 | 定义 | 目标值 |
|:---:|:---|:---:|
| **用户留存率** | 7天/30天活跃用户比例 | 7天>40%, 30天>20% |
| **练习完成率** | 开始练习后完成的比例 | >80% |
| **付费转化率** | 免费用户转为付费用户的比例 | >5% |
| **页面加载速度** | 首屏加载时间 | <2秒 |
| **Core Web Vitals** | LCP, FID, CLS | 全部达到Good标准 |

---

> **文档维护**: 本文档将根据项目进展和需求变化持续更新维护。
>
> **最后更新**: 2025年8月24日 | **版本**: v5.1-formatted
```
