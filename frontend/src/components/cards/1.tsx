import React from 'react';
import { Gift, Volume2, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card1 = () => {
  return (
    <Card className="w-full max-w-2xl bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl shadow-lg flex flex-col">
      <div className="flex-1 flex flex-col relative">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 pb-4 relative">
          {/* Left Top Tab */}
          <div className="absolute left-0 top-0 flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-br-xl">
            <Gift size={18} />
            <span className="text-base">惊喜盒子</span>
          </div>

          {/* Right Top Icons */}
          <div className="absolute right-2 top-2 flex space-x-2">
            <button className="p-2 hover:bg-blue-200 rounded-full transition-colors">
              <Volume2 size={20} className="text-blue-600" />
            </button>
            <button className="p-2 hover:bg-blue-200 rounded-full transition-colors">
              <Share2 size={20} className="text-blue-600" />
            </button>
          </div>

          {/* Title Section */}
          <div className="pt-16 px-4">
            <h2 className="text-2xl font-bold text-blue-800 text-center">博弈论</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-300 to-blue-500 mx-auto mt-3" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 pb-6">
          {/* Definition */}
          <div className="bg-white bg-opacity-70 p-5 rounded-xl mt-4 shadow-sm">
            <p className="text-blue-900 font-medium text-lg leading-relaxed">
              <span className="font-bold">博弈论</span>就是研究人们在需要做决策，且每个人的决策会相互影响的情况下，应该如何做出最佳选择。就像你和朋友在自助餐厅，你们都想多吃点好吃的，但如果大家都一窝蜂去抢同一道菜，可能反而谁都吃不好 😅
            </p>
          </div>

          {/* Value */}
          <div className="mt-4 bg-white bg-opacity-60 p-5 rounded-xl shadow-sm">
            <p className="font-medium text-lg text-blue-900 leading-relaxed">
              博弈论帮助我们理解从商业竞争到国际关系的各种复杂互动。它就像是给了我们一个神奇的望远镜 🔭，让我们能看清楚在各种"你争我夺"的情况下，应该怎样做才是最明智的。
            </p>
          </div>

          {/* Case Study */}
          <div className="mt-4 bg-white bg-opacity-60 p-5 rounded-xl shadow-sm space-y-4">
            <p className="font-medium text-lg text-blue-900">
              经典案例：<span className="font-bold">囚徒困境</span>
            </p>

            {/* Matrix Visualization */}
            <div className="bg-white bg-opacity-90 p-4 rounded-lg">
              <div className="flex justify-between mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-blue-800 font-medium">
                  囚徒A
                </div>
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-blue-800 font-medium">
                  囚徒B
                </div>
              </div>
              
              <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-2 bg-blue-50">
                  <div className="p-3 text-center border-r-2 border-blue-200 font-medium text-blue-700">沉默</div>
                  <div className="p-3 text-center font-medium text-blue-700">坦白</div>
                </div>
                
                {/* Data Rows */}
                <div className="grid grid-cols-2 border-t-2 border-blue-200">
                  <div className="p-4 border-r-2 border-blue-200 bg-emerald-50">
                    <div className="font-medium text-gray-800">各判1年</div>
                    <div className="text-sm text-emerald-700 mt-1">(理想结果)</div>
                  </div>
                  <div className="p-4">
                    <div className="text-red-700 font-medium">A判10年</div>
                    <div className="text-blue-700 font-medium">B释放</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 border-t-2 border-blue-200">
                  <div className="p-4 border-r-2 border-blue-200">
                    <div className="text-blue-700 font-medium">A释放</div>
                    <div className="text-red-700 font-medium">B判10年</div>
                  </div>
                  <div className="p-4 bg-amber-50">
                    <div className="font-medium text-gray-800">各判5年</div>
                    <div className="text-sm text-amber-700 mt-1">(纳什均衡)</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 px-2 py-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                  <span className="text-gray-800">理想结果（总体最优但不稳定）</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
                  <span className="text-gray-800">纳什均衡（实际最可能结果）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                  <span className="text-gray-800">极端情况（一方得利一方受害）</span>
                </div>
              </div>
            </div>

            <p className="text-blue-900 leading-relaxed">
              有趣的是，虽然两人都保持沉默是最好的结果，但因为担心被对方出卖，他们往往都会选择坦白！这就是博弈论中经典的"<span className="font-bold">理性个体的选择导致非理想结果</span>"的现象。
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Card1;