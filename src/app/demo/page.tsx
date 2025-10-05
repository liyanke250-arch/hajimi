/**
 * 演示页面 - 展示导入的GRE题目
 * 文件路径: src/app/demo/page.tsx
 * 创建时间: 2025-10-05
 * 
 * 功能: 验证数据库数据能否正确显示在前端
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取所有题目
 */
async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: true,
        vocabularies: {
          include: {
            vocabulary: true
          }
        }
      },
      orderBy: {
        sourceId: 'asc'
      }
    });
    return questions;
  } catch (error) {
    console.error('获取题目失败:', error);
    return [];
  }
}

/**
 * 演示页面组件
 */
export default async function DemoPage() {
  const questions = await getQuestions();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Hajimi GRE 题库演示
          </h1>
          <p className="text-gray-600">
            共 {questions.length} 道题目已导入
          </p>
        </div>

        {/* 题目列表 */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {/* 题目头部 */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-600">
                    题目 {index + 1}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {question.sourceId}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    question.difficultyLevel === 'EASY' ? 'bg-green-100 text-green-700' :
                    question.difficultyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {question.difficultyLevel}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    难度: {question.difficultyScore}/10
                  </span>
                </div>
              </div>

              {/* 题目文本 */}
              <div className="mb-4">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {question.questionText}
                </p>
              </div>

              {/* 选项 */}
              <div className="mb-4 space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded border ${
                      option.isCorrect
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className="font-semibold">{option.choice}.</span>{' '}
                    {option.text}
                    {option.isCorrect && (
                      <span className="ml-2 text-green-600 text-sm">✓ 正确答案</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 词汇统计 */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      📚 关联词汇: {question.vocabularies.length} 个
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {question.vocabularies.slice(0, 5).map((qv) => (
                        <span
                          key={qv.id}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {qv.vocabulary.word}
                        </span>
                      ))}
                      {question.vocabularies.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{question.vocabularies.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/demo/detail/${question.uuid}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    查看完整解析 →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            📊 数据统计
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {questions.length}
              </p>
              <p className="text-sm text-gray-600">题目总数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {questions.reduce((sum, q) => sum + q.options.length, 0)}
              </p>
              <p className="text-sm text-gray-600">选项总数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {questions.reduce((sum, q) => sum + q.vocabularies.length, 0)}
              </p>
              <p className="text-sm text-gray-600">词汇关联</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(questions.flatMap(q => 
                  q.vocabularies.map(v => v.vocabulary.word)
                )).size}
              </p>
              <p className="text-sm text-gray-600">独特词汇</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
