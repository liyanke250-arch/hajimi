/**
 * JSON 清理工具
 * 文件路径: scripts/utils/json-cleaner.ts
 * 创建时间: 2025-10-05
 * 
 * 功能: 修复JSON中的中文引号和特殊字符
 */

import * as fs from 'fs';

/**
 * 清理JSON字符串
 */
export function cleanJsonString(jsonString: string): string {
  let cleaned = jsonString;
  
  // 替换中文引号为英文引号
  cleaned = cleaned.replace(/"/g, '"');  // 左引号
  cleaned = cleaned.replace(/"/g, '"');  // 右引号
  cleaned = cleaned.replace(/'/g, "'");  // 左单引号
  cleaned = cleaned.replace(/'/g, "'");  // 右单引号
  
  // 替换反引号（在JSON字符串值中）
  // 注意：只替换字符串值中的反引号，不影响结构
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  return cleaned;
}

/**
 * 清理JSON文件
 */
export function cleanJsonFile(inputPath: string, outputPath?: string): void {
  console.log(`\n🧹 清理JSON文件: ${inputPath}`);
  
  try {
    // 读取文件
    const content = fs.readFileSync(inputPath, 'utf-8');
    
    // 清理
    const cleaned = cleanJsonString(content);
    
    // 验证JSON格式
    try {
      JSON.parse(cleaned);
      console.log('  ✅ JSON格式验证通过');
    } catch (e) {
      console.error('  ❌ JSON格式仍然有问题:', e);
      throw e;
    }
    
    // 保存
    const output = outputPath || inputPath;
    fs.writeFileSync(output, cleaned, 'utf-8');
    console.log(`  ✅ 已保存到: ${output}\n`);
    
  } catch (error) {
    console.error('  ❌ 清理失败:', error);
    throw error;
  }
}

// 命令行执行
if (require.main === module) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  
  if (!inputPath) {
    console.error('用法: ts-node json-cleaner.ts <输入文件> [输出文件]');
    process.exit(1);
  }
  
  cleanJsonFile(inputPath, outputPath);
}
