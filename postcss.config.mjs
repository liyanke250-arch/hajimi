/**
 * PostCSS 配置文件
 * 创建时间: 2025-08-24 15:35
 * 
 * 开发思路:
 * 1. PostCSS 作为 CSS 后处理器，处理 Tailwind CSS 输出
 * 2. 配置必要插件：Tailwind CSS + Autoprefixer
 * 3. 确保浏览器兼容性和 CSS 优化
 * 
 * 插件说明:
 * - tailwindcss: 处理 Tailwind 指令，生成最终 CSS
 * - autoprefixer: 自动添加浏览器前缀，确保兼容性
 * 
 * 执行顺序: Tailwind 处理 -> Autoprefixer 添加前缀
 * 
 * @type {import('postcss-load-config').Config}
 */
const config = {
  plugins: {
    // Tailwind CSS 插件 - 处理 @tailwind 指令
    // 将 Tailwind 的 base、components、utilities 转换为实际 CSS
    tailwindcss: {},
    
    // Autoprefixer 插件 - 自动添加浏览器前缀
    // 根据 browserslist 配置添加 -webkit-, -moz- 等前缀
    // 解决了之前的 "Cannot find module 'autoprefixer'" 错误
    autoprefixer: {},
  },
};

export default config;
