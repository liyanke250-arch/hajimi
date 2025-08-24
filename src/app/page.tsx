/**
 * 首页组件 (Home Page)
 * 文件路径: src/app/page.tsx
 * 创建时间: 2025-08-24 15:35
 * 
 * 开发思路:
 * 1. 作为 Hajimi GRE 备考平台的欢迎页面
 * 2. 展示项目核心价值和功能入口
 * 3. 使用现代化的响应式设计
 * 4. 提供清晰的用户引导和导航
 * 
 * 设计决策:
 * - 采用 Grid 布局：header、main、footer 三段式结构
 * - 响应式设计：移动端和桌面端自适应
 * - 品牌展示：使用 Next.js logo 作为临时品牌标识
 * - 行动导向：突出"开始练习"和"学习仪表板"按钮
 * 
 * UI 组件结构:
 * - Header: 品牌 logo 和标题
 * - Main: 核心内容和 CTA 按钮
 * - Footer: 辅助导航链接
 * 
 * 技术实现:
 * - 使用 Next.js Image 组件优化图片加载
 * - Tailwind CSS 实现响应式布局
 * - 支持暗色模式切换
 */

import Image from "next/image";

/**
 * 首页组件
 * 
 * 功能说明:
 * - 展示 Hajimi 平台的核心价值主张
 * - 提供主要功能的入口链接
 * - 响应式布局适配不同设备
 * 
 * 布局结构:
 * - 使用 CSS Grid 创建三行布局
 * - 主内容区域居中显示
 * - 底部导航提供辅助链接
 * 
 * 交互设计:
 * - 主要按钮使用对比色突出显示
 * - 悬停效果提供视觉反馈
 * - 链接包含适当的无障碍属性
 */
export default function Home() {
  return (
    // 主容器 - 使用 Grid 布局创建三行结构
    // grid-rows-[20px_1fr_20px]: 顶部间距 + 主内容 + 底部间距
    // min-h-screen: 确保至少占满整个视口高度
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      {/* 主内容区域 - 位于 Grid 的第二行 */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        {/* 品牌标识 - 使用 Next.js logo 作为临时品牌标识 */}
        {/* Next.js Image 组件提供自动优化和懒加载 */}
        <Image
          className="dark:invert"  // 暗色模式下反转颜色
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority  // 优先加载，因为是首屏内容
        />
        
        {/* 主标题 - 项目名称和欢迎信息 */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          欢迎来到 Hajimi - CI/CD 测试
        </h1>
        
        {/* 副标题 - 项目描述和价值主张 */}
        <p className="text-lg text-center sm:text-left text-gray-600">
          GRE智能备考平台 - 基于AI的个性化学习方案 🚀 [部署测试 v2.0]
        </p>
        
        {/* 功能特性列表 - 突出核心功能 */}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            开始你的GRE备考之旅{" "}
            {/* 内联代码样式 - 突出显示关键词 */}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              智能练习
            </code>
          </li>
          <li>个性化学习计划和进度跟踪</li>
        </ol>

        {/* 主要行动按钮组 - CTA (Call to Action) */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          
          {/* 主要按钮 - "开始练习" */}
          {/* 使用深色背景突出显示，引导用户主要操作 */}
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/practice"
          >
            开始练习
          </a>
          
          {/* 次要按钮 - "学习仪表板" */}
          {/* 使用边框样式，作为次要操作选项 */}
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/dashboard"
          >
            学习仪表板
          </a>
        </div>
      </main>
      
      {/* 页脚导航 - 位于 Grid 的第三行 */}
      {/* 提供辅助功能和信息页面的链接 */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
        {/* 关于项目链接 */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about"
        >
          <Image
            aria-hidden  // 装饰性图标，屏幕阅读器忽略
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          关于项目
        </a>
        
        {/* 使用帮助链接 */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/help"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          使用帮助
        </a>
        
        {/* GitHub 外部链接 */}
        {/* 使用 target="_blank" 在新标签页打开 */}
        {/* rel="noopener noreferrer" 提供安全性保护 */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          GitHub →
        </a>
      </footer>
    </div>
  );
}
