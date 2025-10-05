# 📝 JSON 格式规范指南

**创建时间**: 2025-10-05  
**重要性**: ⭐⭐⭐⭐⭐  
**目的**: 确保 JSON 文件能被正确导入

---

## ⚠️ 关键规则

### 规则 1: 只使用英文双引号

**❌ 错误**：
```json
{
  "title": "这是"错误的"格式"
}
```

**✅ 正确**：
```json
{
  "title": "这是正确的格式"
}
```

---

### 规则 2: 不使用反引号

**❌ 错误**：
```json
{
  "text": "看到 `paradox` 信号"
}
```

**✅ 正确**：
```json
{
  "text": "看到 paradox 信号"
}
```

---

### 规则 3: 保持标准 JSON 格式

**❌ 错误**：
```json
{
  "list": [
    "item1"
    "item2"  // 缺少逗号
  ]
}
```

**✅ 正确**：
```json
{
  "list": [
    "item1",
    "item2"
  ]
}
```

---

## 🛠️ 修复方法

### 方法 1: 在生成时避免

**在 AI Prompt 中添加**：
```
重要：生成的 JSON 必须符合标准格式：
1. 只使用英文双引号 "
2. 不使用反引号 `
3. 不使用中文引号 " "
4. 所有数组和对象元素间有逗号
```

### 方法 2: 使用查找替换

**在 VS Code 中**：
1. 打开 JSON 文件
2. 按 `Ctrl + H`（查找替换）
3. 查找：`"`（中文左引号）
4. 替换为：`"`（英文引号）
5. 全部替换

**重复这个过程**：
- `"` → `"`（中文右引号）
- `'` → `'`（中文左单引号）
- `'` → `'`（中文右单引号）

### 方法 3: 使用在线工具

访问：https://jsonformatter.org/
1. 粘贴您的 JSON
2. 点击 "Format/Beautify"
3. 检查是否有错误
4. 复制格式化后的结果

---

## ✅ 验证 JSON 格式

### 在线验证

访问：https://jsonlint.com/
- 粘贴 JSON
- 点击 "Validate JSON"
- 看到绿色 ✓ 就是正确的

### 本地验证

**使用 Node.js**：
```bash
node -e "JSON.parse(require('fs').readFileSync('your-file.json', 'utf-8'))"
```

如果没有错误，说明格式正确！

---

## 📋 标准 JSON 模板

```json
{
  "uuid": "q_s1t1s1q1_victorians",
  "source_id": "Stage 1 Test 1 Section 1-1",
  "version": 10.0,
  "difficulty": {
    "level": "Easy",
    "score": 3.0,
    "factors": {
      "sentence_complexity": "低",
      "vocab_rarity": "中",
      "logic_subtlety": "中"
    }
  },
  "questionText": "题目文本（使用英文引号）",
  "options": [
    { "choice": "A", "text": "option1" },
    { "choice": "B", "text": "option2" }
  ],
  "correctAnswer": "B",
  "analysis": {
    "intellectualEasterEgg": {
      "title": "标题",
      "association_principle": "原则",
      "content": ["内容1", "内容2"]
    },
    "logicType": {
      "officialTag": "contrast-paradox",
      "signal_words": ["word1", "word2"],
      "oneLiner": "一句话总结",
      "challenge": "核心挑战"
    },
    "logicAndWalkthrough": [],
    "optionsAnalysis": [],
    "sentenceWithAnswer": "完整句子",
    "translation": "中文翻译",
    "grammaticalAnalysis": {}
  },
  "vocabulary": []
}
```

---

## 🎯 最佳实践

### 1. 小批量测试

**建议**：
- 先导入 10-20 道题测试
- 确认格式正确
- 再批量导入

### 2. 备份原始文件

**建议**：
- 保留原始 JSON 文件
- 导入成功后再删除或移动

### 3. 记录导入日志

**建议**：
```bash
# 导入时保存日志
npm run import:questions > import_log.txt 2>&1
```

---

**最后更新**: 2025-10-05
