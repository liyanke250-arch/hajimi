/**
 * 根布局组件 (Root Layout)
 * 文件路径: src/app/layout.tsx
 * 创建时间: 2025-08-24 15:35
 * 
 * 开发思路:
 * 1. Next.js 14 App Router 的根布局组件
 * 2. 定义全站的 HTML 结构和元数据
 * 3. 配置全局字体和样式
 * 4. 提供一致的页面框架
 * 
 * 设计决策:
 * - 使用 Inter 字体：现代、易读、支持多语言
 * - 设置中文语言标签：SEO 和无障碍优化
 * - 导入全局样式：Tailwind CSS 基础样式
 * - 元数据配置：搜索引擎优化
 * 
 * 技术实现:
 * - 使用 next/font/google 优化字体加载
 * - 利用 Next.js 14 的 Metadata API
 * - 支持服务端渲染 (SSR)
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 字体配置 - 使用 Google Fonts 的 Inter 字体
// Inter: 现代无衬线字体，专为数字界面设计
// subsets: ["latin"] - 仅加载拉丁字符集，减少字体文件大小
const inter = Inter({ subsets: ["latin"] });

// 元数据配置 - 用于 SEO 和社交媒体分享
// Next.js 14 的 Metadata API 会自动生成相应的 HTML meta 标签
export const metadata: Metadata = {
  title: "Hajimi - GRE智能备考平台",
  description: "基于AI的GRE备考平台，提供智能练习和个性化学习方案",
  // 未来可扩展的元数据：
  // keywords: ["GRE", "备考", "AI", "智能学习"],
  // authors: [{ name: "Hajimi Team" }],
  // openGraph: { ... }, // 社交媒体分享
  // twitter: { ... },   // Twitter 卡片
};

/**
 * 根布局组件
 * 
 * 功能说明:
 * - 定义整个应用的 HTML 结构
 * - 应用全局字体样式
 * - 渲染子页面内容
 * 
 * 参数:
 * @param children - 子页面或组件内容
 * 
 * 返回:
 * 完整的 HTML 文档结构
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // HTML 根元素 - 设置语言为中文
    // lang="zh" 有助于搜索引擎和屏幕阅读器正确处理内容
    <html lang="zh">
      {/* Body 元素 - 应用 Inter 字体样式 */}
      {/* inter.className 由 next/font 自动生成，包含字体优化 */}
      <body className={inter.className}>
        {/* 子页面内容渲染区域 */}
        {/* children 将包含各个页面的具体内容 */}
        {children}
      </body>
    </html>
  );
}
