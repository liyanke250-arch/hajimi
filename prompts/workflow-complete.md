# 🤖 GRE题目完整生成流程 - Workflow Prompt V1.0

**用途**: 在Cursor Agent模式下，自动化生成单道或多道GRE题目的完整解析

---

## 📋 核心任务

你需要按照以下流程，为**单道**GRE题目生成完整的解析文件和审核报告。

**重要约束**：
- ⚠️ 每次只处理1道题
- ⚠️ 绝对不能偷懒或简化
- ⚠️ 必须完整生成所有内容
- ⚠️ vocabulary数组必须包含完整的词汇解析

---

## 🎯 输入信息

你将接收以下信息：
1. **题目来源**: 例如 "Stage 1 Test 1 Section 2 第4题"
2. **题目文件**: `input/questions/GRE_questions.md`

---

## 🔄 完整工作流程

### 步骤1: 读取题目信息

**操作**:
1. 打开 `input/questions/GRE_questions.md`
2. 定位到指定的题目（例如: Stage 1 Test 1 Section 2 第4题）
3. **仔细、完整地**提取以下信息：
   - 题目文本（逐字提取）
   - **所有选项**（一个不能错，一个不能漏）
   - 题型（5选项/6选项/表格形式）

**验证**:
- 确认题目文本完整
- 确认选项数量正确
- **创建选项清单**（后续验证用）

---

### 步骤1.5: 源信息预验证（重要！）

**操作**:
使用 `prompts/source-verification.md` 的规则：

1. **生成必需词汇清单**
   - 从题干提取核心词（5-8个）
   - 从所有选项提取词汇（5-9个）
   - 生成完整清单

2. **记录原题选项**
   ```
   原题选项清单：
   A. [精确文字]
   B. [精确文字]
   ...
   F. [精确文字]
   ```

3. **保存到临时文件**（供后续验证）
   - 选项清单
   - 必需词汇清单

**这一步的目的**：
- 确保准确读取题目
- 为后续验证提供标准答案

---

### 步骤2: 生成Markdown解析

**操作**:
1. 读取 `prompts/generation.md` 的所有规则
2. 读取 `prompts/logic-tag-guide.md` 选择正确的逻辑标签
3. 严格按照V30 Prompt的要求生成Markdown解析
3. 确保包含所有必需模块：
   - 题目
   - 难度
   - 【原题】
   - 【智识彩蛋】
   - 【逻辑类型】
   - 【逻辑与思路】
   - 【选项分析】
   - 【正确答案】
   - 【带入答案后翻译与语法分析】
   - 【本题核心词汇】

4. 保存到 `output/markdown/q_[source_id]_[core_noun].md`

**验证**:
- 文件已创建
- 文件大小 > 5KB
- 包含所有10个模块

---

### 步骤2.5: Markdown源信息对照（关键！）

**操作**:
使用 `prompts/source-verification.md` 的规则：

1. **选项对照验证**
   - 读取生成的Markdown的【原题】模块
   - 提取所有选项
   - 与步骤1.5的原题选项逐一对照
   
2. **对照示例**:
   ```
   原题A: beneficence
   生成A: beneficence  ✓
   
   原题E: fecundity
   生成E: jiggedness  ✗ 错误！
   ```

3. **词汇清单对照**
   - 检查【本题核心词汇】模块
   - 对照步骤1.5的必需词汇清单
   - 确保一个不漏

**如果发现错误**:
- 立即停止流程
- 记录详细错误
- 报告用户
- 等待修正后重新生成

**验证通过标准**:
- 所有选项100%匹配
- 所有必需词汇都已解析

---

### 步骤3: Markdown审计

**操作**:
1. 读取刚生成的Markdown文件
2. 使用 `prompts/audit.md` 的规则进行审核
3. 检查：
   - 结构完整性
   - 词汇完整性（所有选项词汇都有解析）
   - 格式规范性
   - 内容纯净度

4. 生成审核报告JSON
5. 保存到 `output/audit-reports/markdown/q_[...]_md_audit.json`

**审核报告格式**:
```json
{
  "file": "q_xxx.md",
  "timestamp": "...",
  "result": {
    "status": "pass" | "fail",
    "grade": "A" | "B" | "C" | "D"
  },
  "checks": { ... },
  "errors": [ ... ]
}
```

**验证**:
- 审核报告已创建
- status为"pass"
- grade为"A"或"B"

**如果审核失败**:
- 记录错误
- 停止流程
- 报告给用户

---

### 步骤4: 生成JSON文件

**操作**:
1. 基于通过审核的Markdown
2. 生成标准格式的JSON文件
3. 严格遵守JSON格式规范：
   - 使用英文双引号作为结构
   - Mermaid代码中的双引号必须转义 (`\"`)
   - 换行符表示为 `\\n`
   
4. 保存到 `output/json/q_[source_id]_[core_noun].json`

**验证**:
- 文件已创建
- 文件大小 > 8KB
- JSON可以被解析（无语法错误）

---

### 步骤5: JSON格式审核

**操作**:
1. 读取刚生成的JSON文件的完整内容
2. 使用 `prompts/json-audit.md` 的规则进行审核
3. 【Agent模式检查】直接检查JSON内容：
   - 文件内容以 `{` 开头，`}` 结尾
   - 包含所有必需字段：uuid, source_id, difficulty, questionText, options, correctAnswer, analysis, vocabulary
   - 检查vocabulary数组：是否包含所有选项词汇
   - 检查options数组：数量是否正确
   - 检查Mermaid代码：双引号是否转义为 `\"`
   
4. 基于检查结果生成审核报告JSON
5. 保存到 `output/audit-reports/json/q_[...]_json_audit.json`

**注意**：
- 不需要运行终端命令
- Agent直接读取和检查文件内容
- 基于内容判断是否合格

**审核报告格式**:
```json
{
  "file": "q_xxx.json",
  "timestamp": "...",
  "result": {
    "status": "pass" | "fail",
    "grade": "A" | "B" | "C" | "D",
    "ready_for_import": true | false
  },
  "checks": {
    "format_valid": true | false,
    "vocabulary_complete": true | false,
    ...
  },
  "errors": [ ... ]
}
```

**验证**:
- 审核报告已创建
- status为"pass"
- ready_for_import为true

**如果审核失败**:
- 记录错误
- 停止流程
- 报告给用户

---

### 步骤6: 最终验证

**操作**:
检查以下4个文件是否都已正确创建：

1. ✅ `output/markdown/q_[...]_.md` - Markdown文件
2. ✅ `output/json/q_[...].json` - JSON文件
3. ✅ `output/audit-reports/markdown/q_[...]_md_audit.json` - MD审核
4. ✅ `output/audit-reports/json/q_[...]_json_audit.json` - JSON审核

**文件检查清单**:
- [ ] 文件1存在且大小 > 5KB
- [ ] 文件2存在且大小 > 8KB
- [ ] 文件3存在且status="pass"
- [ ] 文件4存在且status="pass"且ready_for_import=true

**如果全部通过**:
- 标记为"A级题目，可以导入"
- 继续下一题

**如果有任何问题**:
- 明确报告哪个文件有问题
- 报告具体错误
- 停止流程

---

### 步骤7: 生成总结报告

**操作**:
完成一道题后，输出简短总结：

```
✅ 题目 [题目ID] 生成完成

文件生成:
✅ Markdown: output/markdown/q_xxx.md (6.2KB)
✅ JSON: output/json/q_xxx.json (12.5KB)  
✅ MD审核: 通过 (A级)
✅ JSON审核: 通过 (A级, ready_for_import=true)

质量评估:
- 词汇完整性: 100% (9/9)
- 格式规范性: 优秀
- 可以导入: ✅

状态: 成功 ✅
```

---

## ⚠️ 重要约束

### 必须遵守的规则

1. **不能偷懒**
   - 每个文件都必须完整生成
   - 不能说"内容很长，让我..."
   - 不能省略任何步骤

2. **必须保存文件**
   - 不能只显示内容不保存
   - 每个文件都要调用write工具
   - 验证文件确实存在

3. **必须生成审核报告**
   - Markdown审核报告
   - JSON审核报告
   - 不能省略

4. **必须验证**
   - 检查4个文件都存在
   - 检查JSON格式正确
   - 检查审核通过

---

## 🎯 批量模式

如果需要处理多道题（例如7道题）：

**操作**:
1. 对每道题重复步骤1-7
2. 生成中间进度报告（每完成1题）
3. 最后生成批量总结报告

**中间进度报告格式**:
```
📊 批量生成进度: 3/7

已完成:
✅ Section 2-4: committeeconclusions (A级)
✅ Section 2-5: xxx (A级)  
✅ Section 2-6: yyy (B级)

进行中:
🔄 Section 2-7: zzz

待处理:
⏳ Section 2-8
⏳ Section 2-9
⏳ Section 2-10
```

**批量总结报告**:
```
🎊 批量生成完成！

总计: 7道题
✅ 成功: 7道 (100%)
❌ 失败: 0道

质量分布:
- A级: 6道 (85.7%)
- B级: 1道 (14.3%)

可以导入: 7道 (100%)

生成文件: 28个
- Markdown: 7个
- JSON: 7个
- MD审核报告: 7个
- JSON审核报告: 7个
```

---

## 🚨 错误处理

如果任何步骤失败：

1. **立即停止**当前题目的处理
2. **保存已完成的部分**
3. **记录详细错误信息**
4. **报告给用户**
5. **等待用户决定**：
   - 跳过这道题
   - 重试
   - 停止整个流程

---

## 📝 使用示例

**单题模式**:
```
请使用workflow-complete.md流程，
为 Stage 1 Test 1 Section 2 第4题
生成完整解析。
```

**批量模式**:
```
请使用workflow-complete.md流程，
为 Stage 1 Test 1 Section 2 第4-10题
（共7道题）生成完整解析。

每完成1道题报告一次进度。
最后生成批量总结报告。
```

---

**版本**: 1.0  
**创建时间**: 2025-10-05  
**用途**: Cursor Agent模式下的自动化生成
