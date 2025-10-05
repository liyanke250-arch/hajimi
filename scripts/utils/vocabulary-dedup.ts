/**
 * 词汇去重工具
 * 文件路径: scripts/utils/vocabulary-dedup.ts
 * 创建时间: 2025-10-05
 * 
 * 开发思路:
 * 1. 实现智能的词汇去重逻辑
 * 2. 自动检查词汇是否已存在
 * 3. 存在则复用，不存在则创建
 * 4. 维护词汇使用统计
 * 
 * 设计决策:
 * - 使用 word 字段作为唯一标识（不是uuid）
 * - 自动更新 usageCount 统计
 * - 提供清晰的日志输出
 */

import prisma from './prisma-client';

/**
 * 词汇数据接口
 */
interface VocabularyData {
  uuid: string;
  word: string;
  version?: number;
  phonetic?: string;
  definition_cn: string;
  etymology?: any;
  cognates?: any;
  example?: {
    sentence?: string;
    translation_cn?: string;
  };
}

/**
 * 获取或创建词汇
 * 
 * 功能说明:
 * - 先查询词汇是否存在（按 word 字段）
 * - 存在: 返回现有记录，更新使用次数
 * - 不存在: 创建新记录
 * 
 * 参数:
 * @param vocabData - 词汇数据对象
 * 
 * 返回:
 * @returns Vocabulary 记录
 */
export async function getOrCreateVocabulary(vocabData: VocabularyData) {
  try {
    // 1. 先尝试查找（按 word 字段，这是关键！）
    let vocab = await prisma.vocabulary.findUnique({
      where: { word: vocabData.word }
    });

    if (vocab) {
      // 词汇已存在，复用
      console.log(`  ♻️  词汇已存在，复用: ${vocabData.word}`);
      
      // 更新使用次数
      vocab = await prisma.vocabulary.update({
        where: { id: vocab.id },
        data: {
          usage_count: {
            increment: 1  // 使用次数 +1
          }
        }
      });
      
      return vocab;
    }

    // 2. 词汇不存在，创建新记录
    vocab = await prisma.vocabulary.create({
      data: {
        uuid: vocabData.uuid,
        word: vocabData.word,
        version: vocabData.version || 1.0,
        phonetic: vocabData.phonetic,
        definitionCn: vocabData.definition_cn,
        etymology: vocabData.etymology || null,
        cognates: vocabData.cognates || null,
        exampleSentence: vocabData.example?.sentence,
        exampleTranslation: vocabData.example?.translation_cn,
        usage_count: 1  // 初始使用次数为1
      }
    });

    console.log(`  ✅ 创建新词汇: ${vocabData.word}`);
    return vocab;

  } catch (error) {
    console.error(`  ❌ 处理词汇失败 (${vocabData.word}):`, error);
    throw error;
  }
}

/**
 * 批量处理词汇
 * 
 * 功能说明:
 * - 遍历词汇数组
 * - 对每个词汇执行去重逻辑
 * - 返回所有词汇的ID列表
 * 
 * 参数:
 * @param vocabularies - 词汇数组
 * 
 * 返回:
 * @returns 词汇ID数组
 */
export async function processVocabularies(vocabularies: VocabularyData[]) {
  const vocabIds: string[] = [];
  
  console.log(`  → 处理 ${vocabularies.length} 个词汇...`);

  for (const vocab of vocabularies) {
    const processed = await getOrCreateVocabulary(vocab);
    vocabIds.push(processed.id);
  }

  return vocabIds;
}
