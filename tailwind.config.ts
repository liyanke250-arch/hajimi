/**
 * Tailwind CSS 配置文件
 * 创建时间: 2025-08-24 15:35
 * 
 * 开发思路:
 * 1. 使用 TypeScript 配置，提供类型安全
 * 2. 配置内容路径，确保所有组件样式被扫描
 * 3. 扩展默认主题，支持 CSS 变量
 * 4. 为后续自定义样式预留扩展空间
 * 
 * 实现细节:
 * - content: 指定需要扫描的文件路径，包含 src 目录下所有组件
 * - theme.extend: 扩展默认主题，使用 CSS 变量支持暗色模式
 * - plugins: 当前为空，后续可添加官方插件
 */

import type { Config } from "tailwindcss";

const config: Config = {
  // 内容路径配置 - 告诉 Tailwind 在哪些文件中查找类名
  // 包含 src 目录下的所有页面、组件和应用文件
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",     // Pages Router 页面 (兼容性)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // 可复用组件
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",       // App Router 页面和布局
  ],
  
  // 主题配置
  theme: {
    extend: {
      // 颜色扩展 - 使用 CSS 变量实现主题切换
      colors: {
        background: "var(--background)", // 背景色变量
        foreground: "var(--foreground)", // 前景色变量
        // 后续可扩展：
        // primary: "var(--primary)",
        // secondary: "var(--secondary)",
        // accent: "var(--accent)",
      },
      // 未来扩展点：
      // fontFamily: 自定义字体
      // spacing: 自定义间距
      // borderRadius: 自定义圆角
      // animation: 自定义动画
    },
  },
  
  // 插件配置 - 当前为空，后续可添加
  plugins: [
    // 可考虑添加的插件：
    // @tailwindcss/forms - 表单样式
    // @tailwindcss/typography - 文本排版
    // @tailwindcss/aspect-ratio - 宽高比
  ],
};

export default config;
