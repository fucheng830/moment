import React from 'react';
import { Gift, Volume2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card5 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-indigo-100 to-purple-200 rounded-none sm:rounded-xl shadow-lg">
        <div className="relative min-h-[480px] p-6">
          {/* Left Top Tab */}
          <div className="absolute left-0 top-0 flex items-center space-x-1 bg-indigo-500 text-white px-4 py-2 rounded-br-xl">
            <Gift size={18} />
            <span className="text-base">惊喜盒子</span>
          </div>

          {/* Right Top Icons */}
          <div className="absolute right-2 top-2 flex space-x-2">
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Volume2 size={20} className="text-indigo-600" />
            </button>
            <button className="flex items-center space-x-1 bg-indigo-500 text-white px-3 py-1.5 rounded-full text-sm hover:bg-indigo-600 transition-colors">
              <Download size={16} />
              <span>保存图片</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="mt-14">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-900">知识回顾</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-indigo-300 to-purple-400 mx-auto mt-2 rounded-full" />
            </div>

            {/* Content */}
            <div className="mt-8 space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-sm">
                <div className="space-y-4">
                  {/* Knowledge Point 1 */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-indigo-400"></div>
                    <p className="text-indigo-900 leading-relaxed">
                      在美国大选中，<span className="font-medium">经济人假设</span>让我们理解为什么候选人会根据选民的理性判断来调整政策主张，选民也会基于自身利益来做出投票决策。
                    </p>
                  </div>

                  {/* Knowledge Point 2 */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-indigo-400"></div>
                    <p className="text-indigo-900 leading-relaxed">
                      而当我们观察各州的投票倾向时，有趣的<span className="font-medium">辛普森悖论</span>可能出现：虽然每个群体都支持A候选人，但合计后却可能是B候选人获胜。
                    </p>
                  </div>

                  {/* Knowledge Point 3 */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-indigo-400"></div>
                    <p className="text-indigo-900 leading-relaxed">
                      这时，候选人就面临一个典型的<span className="font-medium">博弈论</span>困境：是坚持理想政策还是调整立场？如何在维护核心支持者和争取摇摆选民之间取得平衡？
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 bg-indigo-50/60 rounded-lg p-4">
                  <p className="text-indigo-900 leading-relaxed">
                    这些经济学原理完美展现了美国大选中的理性决策、数据陷阱与策略权衡，帮助我们更深入地理解这场民主盛会的复杂性。✨
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between text-sm text-indigo-600">
                <div className="flex items-center space-x-2">
                  <span className="block w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>知识串联</span>
                </div>
                <span>已掌握 3/3</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Card5;