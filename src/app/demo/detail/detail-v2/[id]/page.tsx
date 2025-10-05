/**
 * 题目详情页面 V2 - 优化排版
 * 文件路径: src/app/demo/detail-v2/[id]/page.tsx
 * 创建时间: 2025-10-05
 */

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

async function getQuestionDetail(uuid: string) {
  const question = await prisma.question.findUnique({
    where: { uuid },
    include: {
      options: true,
      vocabularies: { include: { vocabulary: true } }
    }
  });
  return question;
}

export default async function QuestionDetailPageV2({ params }: { params: { id: string } }) {
  const question = await getQuestionDetail(params.id);
  if (!question) notFound();
  
  const analysis = question.analysis as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 顶部导航 */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/demo" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:gap-3">
            <span className="text-2xl">←</span>
            <span className="font-semibold">返回列表</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500">{question.uuid}</span>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
              question.difficultyLevel === 'EASY' ? 'bg-emerald-500 text-white' :
              question.difficultyLevel === 'MEDIUM' ? 'bg-amber-500 text-white' :
              'bg-rose-500 text-white'
            }`}>
              {question.difficultyLevel} • {question.difficultyScore}/10
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧主内容区 (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 题目区域 */}
            <section className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📝</span>
                <h2 className="text-2xl font-bold text-gray-900">题目</h2>
              </div>
              <p className="text-xl text-gray-800 leading-relaxed mb-6">
                {question.questionText}
              </p>
              
              {/* 选项 */}
              <div className="space-y-3">
                {question.options.map((opt) => (
                  <div key={opt.id} className={`p-4 rounded-xl border-2 transition-all ${
                    opt.isCorrect 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-md' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="font-bold text-lg text-gray-900">{opt.choice}.</span>{' '}
                        <span className="text-lg text-gray-800">{opt.text}</span>
                      </div>
                      {opt.isCorrect && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          ✓ 正确
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 智识彩蛋 */}
            {analysis?.intellectualEasterEgg && (
              <section className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-xl p-8 border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">💡</span>
                  <h2 className="text-2xl font-bold text-purple-900">
                    {analysis.intellectualEasterEgg.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {analysis.intellectualEasterEgg.content?.map((item: string, idx: number) => (
                    <div key={idx} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-gray-800 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 解题思路 */}
            {analysis?.logicAndWalkthrough && analysis.logicAndWalkthrough.length > 0 && (
              <section className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🔍</span>
                  <h2 className="text-2xl font-bold text-gray-900">解题思路</h2>
                </div>
                <div className="space-y-4">
                  {analysis.logicAndWalkthrough.map((step: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {step.step}
                        </span>
                        <h3 className="font-bold text-green-900 text-lg">{step.step_name_cn}</h3>
                      </div>
                      <div className="space-y-2 ml-11">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-green-800">💼 策略：</span> {step.strategy_expert}
                        </p>
                        <p className="text-sm text-gray-600 bg-white/60 p-3 rounded-lg">
                          <span className="font-semibold text-green-700">💭 实战：</span> {step.thought_process_os}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 翻译与语法 */}
            {analysis?.translation && (
              <section className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-amber-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">📖</span>
                  <h2 className="text-2xl font-bold text-gray-900">翻译与语法</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-amber-800 mb-2">完整句子</p>
                    <p className="text-gray-800">{analysis.sentenceWithAnswer}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-blue-800 mb-2">中文翻译</p>
                    <p className="text-gray-800">{analysis.translation}</p>
                  </div>
                  {analysis.grammaticalAnalysis?.breakdown_hierarchical && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-gray-800 mb-3">语法层级拆解</p>
                      <div className="space-y-2">
                        {analysis.grammaticalAnalysis.breakdown_hierarchical.map((item: string, idx: number) => (
                          <p key={idx} className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-gray-300">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* 右侧边栏 (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 快速信息卡 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">ℹ️</span>
                快速信息
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">来源</p>
                  <p className="font-medium text-gray-900">{question.sourceId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">难度评分</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          question.difficultyScore <= 3 ? 'bg-green-500' :
                          question.difficultyScore <= 6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(question.difficultyScore / 10) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold">{question.difficultyScore}</span>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">复杂度指标</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">句子</span>
                      <span className="text-xs font-semibold">{question.sentenceComplexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">词汇</span>
                      <span className="text-xs font-semibold">{question.vocabRarity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">逻辑</span>
                      <span className="text-xs font-semibold">{question.logicSubtlety}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 逻辑类型卡片 */}
            {analysis?.logicType && (
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  逻辑类型
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                    {analysis.logicType.officialTag}
                  </p>
                  <p className="text-blue-100 text-xs leading-relaxed">
                    {analysis.logicType.oneLiner}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 词汇区域（全宽） */}
        <div className="mt-6">
          <section className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">📚</span>
              <h2 className="text-2xl font-bold text-gray-900">
                核心词汇 ({question.vocabularies.length}个)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.vocabularies.map((qv) => {
                const vocab = qv.vocabulary;
                const etymology = vocab.etymology as any;
                const cognates = vocab.cognates as any;
                
                return (
                  <div key={qv.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200 hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <span className="font-bold text-2xl text-indigo-900">{vocab.word}</span>
                      {vocab.phonetic && (
                        <span className="ml-2 text-indigo-600 text-sm">{vocab.phonetic}</span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium mb-3">{vocab.definitionCn}</p>
                    
                    {etymology && (
                      <details className="mb-2">
                        <summary className="text-xs font-semibold text-indigo-700 cursor-pointer hover:text-indigo-900">
                          📖 词源
                        </summary>
                        <div className="mt-2 bg-white/60 p-3 rounded text-xs space-y-1">
                          <p className="text-gray-600">{etymology.deconstruction}</p>
                          <p className="text-gray-700">{etymology.constructive_essence}</p>
                        </div>
                      </details>
                    )}
                    
                    {cognates && cognates.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {cognates.map((cog: any, idx: number) => (
                          <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                            {cog.word}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {vocab.exampleSentence && (
                      <details>
                        <summary className="text-xs font-semibold text-indigo-700 cursor-pointer hover:text-indigo-900">
                          💬 例句
                        </summary>
                        <div className="mt-2 bg-white/60 p-3 rounded text-xs space-y-1">
                          <p className="text-gray-700 italic">{vocab.exampleSentence}</p>
                          <p className="text-gray-600">{vocab.exampleTranslation}</p>
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
