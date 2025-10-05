# 🚀 Hajimi 项目开发文档

## 📋 项目概述

- **项目名称**: Hajimi - GRE智能备考平台
- **创建时间**: 2025-08-24 15:30
- **开发者**: AI Assistant (Cascade)
- **技术栈**: Next.js 14 + TypeScript + Tailwind CSS + Supabase

## 🎯 开发思路与技术选型

### 核心技术选择原因

1. **Next.js 14**:
   - 最新版本，支持App Router架构
   - SSR/SSG性能优异，SEO友好
   - 内置优化，开发体验好

2. **TypeScript**:
   - 类型安全，减少运行时错误
   - 提高代码质量和开发效率
   - 更好的IDE支持和重构能力

3. **Tailwind CSS**:
   - 原子化CSS，快速构建现代UI
   - 响应式设计支持
   - 减少CSS文件大小

4. **Supabase**:
   - 开源Firebase替代品
   - PostgreSQL数据库
   - 内置认证和实时功能

## 📁 项目结构设计

```
hajimi/
├── src/                    # 源代码目录 (Next.js 13+ 推荐)
│   └── app/               # App Router 目录
│       ├── layout.tsx     # 根布局组件
│       ├── page.tsx       # 首页组件
│       └── globals.css    # 全局样式
├── .env                   # 环境变量 (敏感信息)
├── .env.example          # 环境变量模板
├── .eslintrc.json        # ESLint配置
├── .gitignore            # Git忽略文件
├── next.config.mjs       # Next.js配置
├── package.json          # 项目依赖和脚本
├── postcss.config.mjs    # PostCSS配置
├── tailwind.config.ts    # Tailwind配置
└── tsconfig.json         # TypeScript配置
```

## ⏱️ 开发时间线

### 阶段 0: 项目初始化 (2025-08-24 14:00-15:30)

1. **任务 0.1**: 云服务初始化 ✅
   - Supabase项目创建
   - Vercel项目创建
   - 环境变量配置
   - Git仓库初始化

2. **任务 0.2**: 本地项目初始化 ✅
   - Next.js项目脚手架
   - TypeScript配置
   - Tailwind CSS配置
   - ESLint配置

### 阶段 1: 代码注释和文档 (2025-08-24 15:30-16:00)

3. **任务**: 添加详细代码注释 🔄
   - 配置文件注释
   - 组件代码注释
   - 开发思路文档

## 🔧 配置文件说明

### package.json

- **作用**: 项目依赖管理和脚本配置
- **核心依赖**: Next.js 14.2.5, React 18, TypeScript 5
- **开发依赖**: Tailwind CSS, ESLint, PostCSS, Autoprefixer
- **脚本**: dev (开发), build (构建), start (生产), lint (检查)

### tsconfig.json

- **作用**: TypeScript编译器配置
- **关键配置**:
  - 启用严格模式
  - 配置路径别名 @/\*
  - 支持Next.js插件

### tailwind.config.ts

- **作用**: Tailwind CSS框架配置
- **内容路径**: src目录下所有组件文件
- **主题扩展**: 自定义颜色变量

### next.config.mjs

- **作用**: Next.js框架配置
- **当前**: 使用默认配置，后续可扩展

### postcss.config.mjs

- **作用**: CSS后处理器配置
- **插件**: Tailwind CSS + Autoprefixer

### .eslintrc.json

- **作用**: 代码质量检查配置
- **规则**: 使用Next.js官方推荐配置

## 🎨 组件设计思路

### layout.tsx (根布局)

- **目的**: 定义全局页面结构
- **功能**: HTML结构、字体加载、元数据
- **设计**: 支持中文，使用Inter字体

### page.tsx (首页)

- **目的**: 项目欢迎页面
- **功能**: 展示项目信息，导航链接
- **设计**: 响应式布局，现代化UI

### globals.css (全局样式)

- **目的**: 全局CSS变量和基础样式
- **功能**: Tailwind导入，主题变量，暗色模式支持

## 🚀 开发最佳实践

1. **文件组织**: 使用src目录，按功能分组
2. **类型安全**: 所有组件使用TypeScript
3. **样式管理**: 优先使用Tailwind类名
4. **代码质量**: ESLint检查，严格模式
5. **版本控制**: 语义化提交信息

## 🔄 后续开发计划

1. **数据库设计**: Prisma + Supabase集成
2. **用户认证**: Supabase Auth集成
3. **核心功能**: GRE题目管理和练习
4. **UI组件**: 可复用组件库
5. **部署优化**: Vercel部署配置

## 📝 开发注意事项

1. **环境变量**: 敏感信息使用.env文件
2. **类型定义**: 为所有API和数据结构定义类型
3. **性能优化**: 使用Next.js内置优化功能
4. **SEO优化**: 合理使用metadata和结构化数据
5. **错误处理**: 完善的错误边界和用户反馈

---

_此文档随项目开发持续更新_
