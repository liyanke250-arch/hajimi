/**
 * 环境配置检查脚本
 * 文件路径: scripts/check-setup.ts
 * 创建时间: 2025-10-05
 * 
 * 功能: 检查项目配置是否完整
 * 使用: npm run check:setup
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('\n🔍 Hajimi 项目配置检查\n');
console.log('='.repeat(60));

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

/**
 * 检查文件是否存在
 */
function checkFile(filePath: string, required: boolean = true): boolean {
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${filePath}`);
    checks.passed++;
    return true;
  } else {
    if (required) {
      console.log(`❌ ${filePath} (必需)`);
      checks.failed++;
    } else {
      console.log(`⚠️  ${filePath} (可选)`);
      checks.warnings++;
    }
    return false;
  }
}

/**
 * 检查环境变量
 */
function checkEnvVar(varName: string, required: boolean = true): boolean {
  const value = process.env[varName];
  
  if (value) {
    console.log(`✅ ${varName}: [已设置]`);
    checks.passed++;
    return true;
  } else {
    if (required) {
      console.log(`❌ ${varName}: [未设置] (必需)`);
      checks.failed++;
    } else {
      console.log(`⚠️  ${varName}: [未设置] (可选)`);
      checks.warnings++;
    }
    return false;
  }
}

// ==========================================
// 检查项目文件
// ==========================================
console.log('\n📁 检查项目文件:\n');

checkFile('package.json');
checkFile('tsconfig.json');
checkFile('prisma/schema.prisma');
checkFile('.cursorrules');
checkFile('.gitignore');
checkFile('docs/QUICK_START.md');
checkFile('docs/DATABASE_DESIGN.md');
checkFile('scripts/importers/question_importer.ts');
checkFile('scripts/utils/vocabulary-dedup.ts');

// ==========================================
// 检查目录结构
// ==========================================
console.log('\n📂 检查目录结构:\n');

checkFile('scripts/importers', true);
checkFile('scripts/utils', true);
checkFile('content/test', true);
checkFile('content/unprocessed', true);

// ==========================================
// 检查环境配置
// ==========================================
console.log('\n🔧 检查环境配置:\n');

const hasEnvDev = checkFile('.env.development', false);
const hasEnvProd = checkFile('.env.production', false);
const hasEnv = checkFile('.env', false);

if (!hasEnvDev && !hasEnv) {
  console.log('\n⚠️  警告: 没有找到环境配置文件');
  console.log('   请创建 .env.development 或 .env 文件');
}

// ==========================================
// 检查依赖包
// ==========================================
console.log('\n📦 检查依赖包:\n');

const packageJson = JSON.parse(
  fs.readFileSync('package.json', 'utf-8')
);

const requiredDeps = [
  '@prisma/client',
  'next',
  'react',
  'react-dom'
];

const requiredDevDeps = [
  'prisma',
  'typescript',
  'ts-node',
  '@types/node'
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}`);
    checks.passed++;
  } else {
    console.log(`❌ ${dep} (必需)`);
    checks.failed++;
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
    checks.passed++;
  } else {
    console.log(`❌ ${dep} (必需)`);
    checks.failed++;
  }
});

// ==========================================
// 显示结果
// ==========================================
console.log('\n' + '='.repeat(60));
console.log('📊 检查结果\n');
console.log(`  ✅ 通过: ${checks.passed}`);
console.log(`  ❌ 失败: ${checks.failed}`);
console.log(`  ⚠️  警告: ${checks.warnings}`);
console.log('='.repeat(60));

if (checks.failed === 0) {
  console.log('\n🎉 所有必需项检查通过！\n');
  console.log('下一步:');
  console.log('  1. 确保 .env.development 已配置');
  console.log('  2. 运行: npx prisma migrate dev');
  console.log('  3. 运行: npm run import:test\n');
} else {
  console.log('\n⚠️  发现问题，请先解决失败项\n');
  process.exit(1);
}

process.exit(0);
