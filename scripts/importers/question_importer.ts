/**
 * 题目导入脚本
 * 文件路径: scripts/importers/question_importer.ts
 * 创建时间: 2025-10-05
 * 
 * 开发思路:
 * 1. 读取JSON文件
 * 2. 自动处理词汇去重
 * 3. 导入题目和选项
 * 4. 建立题目-词汇关联
 * 5. 显示详细进度
 * 
 * 使用方法:
 * npm run import:test  # 导入测试目录
 * npm run import:questions  # 导入所有未处理的题目
 */

import * as fs from 'fs';
import * as path from 'path';
import prisma from '../utils/prisma-client';
import { processVocabularies } from '../utils/vocabulary-dedup';

/**
 * 从 analysis.optionsAnalysis 中提取选项分析
 */
function getOptionAnalysis(optionsAnalysis: any[], choice: string) {
  const analysis = optionsAnalysis.find(
    (opt: any) => opt.option.startsWith(choice)
  );
  
  if (!analysis) {
    return { analysisText: null, trapTypes: [] };
  }
  
  return {
    analysisText: analysis.analysis?.analysis_text || null,
    trapTypes: analysis.analysis?.trap_types || []
  };
}

/**
 * 导入单个题目
 * 
 * 功能说明:
 * - 解析JSON数据
 * - 处理词汇（自动去重）
 * - 创建/更新题目
 * - 创建选项
 * - 建立词汇关联
 * 
 * 参数:
 * @param jsonData - 题目JSON数据
 * 
 * 返回:
 * @returns 导入结果
 */
export async function importQuestion(jsonData: any) {
  console.log(`\n📝 开始导入题目: ${jsonData.uuid}`);
  console.log(`   来源: ${jsonData.source_id}`);

  try {
    // ==========================================
    // 第1步: 处理词汇（自动去重）
    // ==========================================
    const vocabIds = await processVocabularies(jsonData.vocabulary || []);

    // ==========================================
    // 第2步: 创建/更新题目
    // ==========================================
    console.log(`  → 创建/更新题目...`);
    
    const question = await prisma.question.upsert({
      where: { uuid: jsonData.uuid },
      
      // 如果存在，更新这些字段
      update: {
        sourceId: jsonData.source_id,
        version: jsonData.version || 1.0,
        questionText: jsonData.questionText,
        correctAnswer: jsonData.correctAnswer,
        
        // 难度信息
        difficultyLevel: jsonData.difficulty.level.toUpperCase(),
        difficultyScore: jsonData.difficulty.score,
        sentenceComplexity: jsonData.difficulty.factors.sentence_complexity,
        vocabRarity: jsonData.difficulty.factors.vocab_rarity,
        logicSubtlety: jsonData.difficulty.factors.logic_subtlety,
        
        // 完整的 analysis JSON
        analysis: jsonData.analysis,
        
        updatedAt: new Date()
      },
      
      // 如果不存在，创建新记录
      create: {
        uuid: jsonData.uuid,
        sourceId: jsonData.source_id,
        version: jsonData.version || 1.0,
        questionType: 'TEXT_COMPLETION',  // 默认类型
        questionText: jsonData.questionText,
        correctAnswer: jsonData.correctAnswer,
        
        // 难度信息
        difficultyLevel: jsonData.difficulty.level.toUpperCase(),
        difficultyScore: jsonData.difficulty.score,
        sentenceComplexity: jsonData.difficulty.factors.sentence_complexity,
        vocabRarity: jsonData.difficulty.factors.vocab_rarity,
        logicSubtlety: jsonData.difficulty.factors.logic_subtlety,
        
        // 完整的 analysis JSON
        analysis: jsonData.analysis
      }
    });

    console.log(`  ✅ 题目处理完成`);

    // ==========================================
    // 第3步: 处理选项
    // ==========================================
    console.log(`  → 处理选项...`);
    
    // 先删除旧选项（如果是更新）
    await prisma.questionOption.deleteMany({
      where: { questionId: question.id }
    });

    // 创建新选项
    const correctAnswers = jsonData.correctAnswer.split(',').map((a: string) => a.trim());
    
    for (const option of jsonData.options) {
      const isCorrect = correctAnswers.includes(option.choice);
      const { analysisText, trapTypes } = getOptionAnalysis(
        jsonData.analysis.optionsAnalysis || [],
        option.choice
      );

      await prisma.questionOption.create({
        data: {
          questionId: question.id,
          choice: option.choice,
          text: option.text,
          isCorrect,
          analysisText,
          trapTypes
        }
      });
    }

    console.log(`  ✅ ${jsonData.options.length} 个选项已创建`);

    // ==========================================
    // 第4步: 建立题目-词汇关联
    // ==========================================
    console.log(`  → 建立词汇关联...`);
    
    // 先删除旧关联
    await prisma.questionVocabulary.deleteMany({
      where: { questionId: question.id }
    });

    // 创建新关联
    for (const vocabId of vocabIds) {
      await prisma.questionVocabulary.create({
        data: {
          questionId: question.id,
          vocabularyId: vocabId
        }
      });
    }

    console.log(`  ✅ ${vocabIds.length} 个词汇已关联`);
    console.log(`✅ 题目导入成功: ${jsonData.uuid}\n`);

    return { 
      success: true, 
      questionId: question.id,
      vocabCount: vocabIds.length 
    };

  } catch (error) {
    console.error(`❌ 导入失败: ${jsonData.uuid}`);
    console.error(`   错误信息:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * 批量导入题目
 * 
 * 功能说明:
 * - 扫描指定目录的所有JSON文件
 * - 逐个导入题目
 * - 显示统计信息
 * 
 * 参数:
 * @param dirPath - 目录路径
 */
export async function importQuestionsFromDirectory(dirPath: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Hajimi GRE 题目导入工具`);
  console.log(`${'='.repeat(60)}\n`);

  // 检查目录是否存在
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ 目录不存在: ${dirPath}`);
    process.exit(1);
  }

  // 读取所有JSON文件
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    console.log(`⚠️  目录中没有JSON文件: ${dirPath}`);
    process.exit(0);
  }

  console.log(`📂 找到 ${files.length} 个JSON文件\n`);

  // 统计信息
  const results = {
    total: files.length,
    success: 0,
    failed: 0,
    totalVocabs: 0,
    errors: [] as any[]
  };

  // 逐个导入
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[${i + 1}/${files.length}] 处理文件: ${file}`);
    
    try {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      
      const result = await importQuestion(jsonData);
      
      if (result.success) {
        results.success++;
        results.totalVocabs += result.vocabCount || 0;
      } else {
        results.failed++;
        results.errors.push({ file, error: result.error });
      }
      
    } catch (error) {
      results.failed++;
      results.errors.push({ 
        file, 
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`❌ 文件处理失败: ${file}`);
    }
  }

  // ==========================================
  // 显示统计信息
  // ==========================================
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 导入完成统计`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`  总文件数: ${results.total}`);
  console.log(`  ✅ 成功: ${results.success}`);
  console.log(`  ❌ 失败: ${results.failed}`);
  console.log(`  📚 处理词汇: ${results.totalVocabs}`);
  
  if (results.errors.length > 0) {
    console.log(`\n❌ 失败详情:`);
    results.errors.forEach(e => {
      console.log(`  - ${e.file}`);
      console.log(`    错误: ${e.error}\n`);
    });
  }

  console.log(`\n${'='.repeat(60)}\n`);

  // 断开数据库连接
  await prisma.$disconnect();
}

/**
 * 命令行执行入口
 */
if (require.main === module) {
  const dirPath = process.argv[2] || './content/unprocessed';
  
  console.log(`\n使用目录: ${dirPath}\n`);
  
  importQuestionsFromDirectory(dirPath)
    .then(() => {
      console.log('✅ 所有操作完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 发生严重错误:', error);
      process.exit(1);
    });
}
