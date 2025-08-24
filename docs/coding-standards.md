# 📝 Hajimi 项目代码注释规范

## 📋 文档概述
- **创建时间**: 2025-08-24 19:55
- **适用范围**: Hajimi GRE智能备考平台
- **目标读者**: 开发团队成员、编程初学者、代码维护者

## 🎯 注释原则

### 1. **易懂性原则**
- 使用简单明了的中文表达
- 避免过于技术化的术语
- 为编程小白提供足够的背景知识

### 2. **完整性原则**
- 每个文件都必须有文件头注释
- 每个函数/组件都必须有功能说明
- 复杂逻辑必须有行内注释

### 3. **实用性原则**
- 解释"为什么"而不仅仅是"是什么"
- 提供实现思路和设计决策
- 包含未来扩展点和注意事项

## 📁 文件头注释模板

### React 组件文件 (.tsx)
```typescript
/**
 * [组件名称] ([英文名称])
 * 文件路径: [相对路径]
 * 创建时间: [YYYY-MM-DD HH:mm]
 * 
 * 开发思路:
 * 1. [主要功能描述]
 * 2. [设计考虑]
 * 3. [技术选择原因]
 * 4. [用户体验考虑]
 * 
 * 设计决策:
 * - [关键设计决策1]: [原因说明]
 * - [关键设计决策2]: [原因说明]
 * 
 * 技术实现:
 * - [技术点1]: [实现方式]
 * - [技术点2]: [实现方式]
 * 
 * 依赖关系:
 * - [依赖1]: [用途说明]
 * - [依赖2]: [用途说明]
 */
```

### 配置文件 (.ts/.mjs/.json)
```typescript
/**
 * [配置文件名称]
 * 创建时间: [YYYY-MM-DD HH:mm]
 * 
 * 开发思路:
 * 1. [配置目的]
 * 2. [关键配置项说明]
 * 3. [与其他配置的关系]
 * 
 * 配置说明:
 * - [配置项1]: [作用和影响]
 * - [配置项2]: [作用和影响]
 * 
 * 未来扩展点:
 * - [可能的扩展1]
 * - [可能的扩展2]
 */
```

## 🔧 函数/组件注释模板

### React 组件
```typescript
/**
 * [组件名称]
 * 
 * 功能说明:
 * - [主要功能1]
 * - [主要功能2]
 * - [交互行为]
 * 
 * 参数:
 * @param {类型} 参数名 - 参数说明
 * @param {类型} 参数名 - 参数说明
 * 
 * 返回:
 * JSX.Element - [返回内容描述]
 * 
 * 使用示例:
 * <ComponentName prop1="value1" prop2="value2" />
 * 
 * 注意事项:
 * - [重要提醒1]
 * - [重要提醒2]
 */
```

### 工具函数
```typescript
/**
 * [函数名称]
 * 
 * 功能说明:
 * [详细的功能描述，包括输入输出的关系]
 * 
 * 算法思路:
 * 1. [步骤1]
 * 2. [步骤2]
 * 3. [步骤3]
 * 
 * 参数:
 * @param {类型} 参数名 - 参数说明和约束
 * 
 * 返回:
 * @returns {类型} 返回值说明
 * 
 * 异常:
 * @throws {错误类型} 抛出条件
 * 
 * 示例:
 * const result = functionName(param1, param2);
 * console.log(result); // 预期输出
 */
```

## 💡 行内注释规范

### 1. **复杂逻辑注释**
```typescript
// 计算用户GRE分数的加权平均值
// 公式: (数学分数 * 0.5) + (语文分数 * 0.5)
// 这里使用加权平均是因为GRE数学和语文部分权重相等
const averageScore = (mathScore * 0.5) + (verbalScore * 0.5);
```

### 2. **业务逻辑注释**
```typescript
// 检查用户是否完成了今日练习目标
// 目标设定: 每日至少完成10道题目
if (completedQuestions >= DAILY_TARGET) {
  // 触发成就系统，记录用户连续完成天数
  updateAchievement(userId, 'daily_practice');
}
```

### 3. **技术实现注释**
```typescript
// 使用 useCallback 优化性能，避免子组件不必要的重渲染
// 依赖数组包含 [userId, questionId]，当这些值变化时才重新创建函数
const handleAnswerSubmit = useCallback((answer: string) => {
  submitAnswer(userId, questionId, answer);
}, [userId, questionId]);
```

## 🎨 CSS/样式注释规范

### Tailwind CSS 类名注释
```typescript
<div className={`
  grid grid-rows-[20px_1fr_20px]  // 创建三行网格: 顶部间距 + 主内容 + 底部间距
  items-center                     // 垂直居中对齐
  justify-items-center            // 水平居中对齐
  min-h-screen                    // 最小高度为视口高度
  p-8 pb-20                       // 内边距: 全方向8, 底部20
  gap-16                          // 网格间距16
  sm:p-20                         // 小屏幕及以上: 内边距20
`}>
```

### 自定义样式注释
```css
/* 
 * 自定义滚动条样式
 * 目的: 提供更好的视觉体验，与整体设计保持一致
 * 兼容性: Webkit 内核浏览器 (Chrome, Safari, Edge)
 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;                    /* 滚动条宽度 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--background); /* 轨道背景色，使用CSS变量支持主题切换 */
}
```

## 📊 数据模型注释规范

### Prisma Schema 注释
```prisma
/**
 * 用户模型 (User Model)
 * 
 * 业务说明:
 * - 存储GRE学习者的基本信息
 * - 支持邮箱和第三方登录
 * - 关联学习记录和成绩数据
 * 
 * 数据关系:
 * - 一对多: User -> Practice (一个用户有多个练习记录)
 * - 一对多: User -> Achievement (一个用户有多个成就)
 * 
 * 扩展计划:
 * - 添加学习偏好设置
 * - 添加社交功能字段
 */
model User {
  // 主键字段 - 使用CUID确保全局唯一性
  // CUID比UUID更短，更适合在URL中使用
  id        String   @id @default(cuid())
  
  // 认证字段 - 必须唯一，用于登录验证
  email     String   @unique
  
  // 可选字段 - 用户可以选择不填写真实姓名
  name      String?
  
  // 审计字段 - 自动维护，用于数据分析和调试
  createdAt DateTime @default(now())  // 注册时间
  updatedAt DateTime @updatedAt       // 最后更新时间

  @@map("users")  // 数据库表名映射为复数形式，符合命名约定
}
```

## 🔄 API 注释规范

### API 路由注释
```typescript
/**
 * GET /api/questions/[id]
 * 
 * 功能: 获取指定ID的GRE题目详情
 * 
 * 业务逻辑:
 * 1. 验证用户身份和权限
 * 2. 检查题目ID的有效性
 * 3. 返回题目内容和选项
 * 4. 记录用户访问日志
 * 
 * 参数:
 * @param id - 题目唯一标识符 (CUID格式)
 * 
 * 响应:
 * @returns {Question} 题目对象，包含题干、选项、难度等信息
 * 
 * 错误处理:
 * - 400: 题目ID格式错误
 * - 401: 用户未认证
 * - 404: 题目不存在
 * - 500: 服务器内部错误
 * 
 * 安全考虑:
 * - 不返回正确答案，防止作弊
 * - 限制访问频率，防止爬虫
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 实现代码...
}
```

## 🧪 测试代码注释规范

```typescript
/**
 * 用户认证功能测试套件
 * 
 * 测试范围:
 * - 用户注册流程
 * - 登录验证
 * - 权限检查
 * - 错误处理
 */
describe('用户认证', () => {
  /**
   * 测试用户注册功能
   * 
   * 验证点:
   * 1. 有效邮箱可以成功注册
   * 2. 重复邮箱注册会返回错误
   * 3. 无效邮箱格式会被拒绝
   */
  test('用户注册 - 成功场景', async () => {
    // 准备测试数据
    const userData = {
      email: 'test@example.com',
      name: '测试用户'
    };
    
    // 执行注册操作
    const result = await registerUser(userData);
    
    // 验证结果
    expect(result.success).toBe(true);
    expect(result.user.email).toBe(userData.email);
  });
});
```

## 📚 注释最佳实践

### ✅ 好的注释示例
```typescript
// ✅ 解释业务逻辑和原因
// 设置24小时的缓存时间，因为GRE题目内容相对稳定
// 这样可以减少数据库查询，提高页面加载速度
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// ✅ 解释复杂的算法
// 使用二分查找算法定位用户的分数等级
// 时间复杂度: O(log n)，比线性查找更高效
const scoreLevel = binarySearchScoreLevel(userScore, scoreLevels);

// ✅ 提供使用示例和注意事项
// 计算两个日期之间的天数差
// 注意: 结果包含起始日期，不包含结束日期
// 示例: calculateDaysBetween('2024-01-01', '2024-01-03') 返回 2
function calculateDaysBetween(startDate: string, endDate: string): number {
  // 实现代码...
}
```

### ❌ 避免的注释方式
```typescript
// ❌ 重复代码内容，没有额外价值
// 设置用户名
const userName = 'John';

// ❌ 过于简单，没有解释原因
// 循环数组
for (let i = 0; i < items.length; i++) {
  // ...
}

// ❌ 过时或错误的注释
// 返回用户列表 (实际上这个函数返回的是单个用户)
function getUser(id: string): User {
  // ...
}
```

## 🔧 工具和自动化

### 1. **VS Code 扩展推荐**
- **Better Comments**: 彩色注释分类
- **Document This**: 自动生成JSDoc注释
- **Chinese (Simplified) Language Pack**: 中文界面支持

### 2. **注释模板配置**
在 VS Code 中设置代码片段，快速插入注释模板：

```json
{
  "React Component Header": {
    "prefix": "rch",
    "body": [
      "/**",
      " * $1 ($2)",
      " * 文件路径: $3",
      " * 创建时间: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE",
      " * ",
      " * 开发思路:",
      " * 1. $4",
      " * 2. $5",
      " * ",
      " * 设计决策:",
      " * - $6",
      " * ",
      " * 技术实现:",
      " * - $7",
      " */"
    ],
    "description": "React组件文件头注释"
  }
}
```

## 📋 检查清单

在提交代码前，请确认：

- [ ] 每个新文件都有完整的文件头注释
- [ ] 每个函数/组件都有功能说明
- [ ] 复杂逻辑有行内注释解释
- [ ] 注释使用简单易懂的中文
- [ ] 包含了实现思路和设计决策
- [ ] 提供了使用示例（如适用）
- [ ] 注释内容与代码实际功能一致
- [ ] 没有过时或误导性的注释

## 🎯 总结

良好的代码注释是团队协作和项目维护的基础。通过遵循这些规范，我们可以：

1. **降低学习成本** - 新成员能快速理解代码
2. **提高维护效率** - 减少调试和修改时间
3. **保证代码质量** - 强制思考设计决策
4. **促进知识传承** - 保留开发经验和教训

记住：**好的注释不是解释代码在做什么，而是解释为什么要这样做。**

---

*本文档会随着项目发展持续更新和完善*
