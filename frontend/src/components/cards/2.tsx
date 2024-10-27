import React from 'react';
import { Play, Stars, Clock, Zap, TrendingUp, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card2 = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-violet-100 via-indigo-100 to-blue-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-20 h-20 rounded-full bg-violet-200 opacity-40 blur-xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-32 h-32 rounded-full bg-indigo-200 opacity-40 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-blue-200 opacity-40 blur-xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            经济人假设：
            <br />
            <span className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-600">
              为什么人人都是理性的"自私者"？
            </span>
          </h1>
        </div>

        {/* Video Preview Section */}
        <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-90"></div>
          
          {/* Video Thumbnail */}
          <div className="relative h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <Play size={32} className="text-white ml-1" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-center text-white">
                <span className="text-sm font-medium flex items-center">
                  <Clock size={16} className="mr-1" /> 2.5分钟速懂
                </span>
                <span className="text-sm font-medium flex items-center">
                  <Eye size={16} className="mr-1" /> 25万+已学
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Highlights */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-violet-100 rounded-lg shrink-0">
                <TrendingUp size={24} className="text-violet-600" />
              </div>
              <div>
                <h3 className="font-medium text-violet-900 mb-1">追求利益最大化</h3>
                <p className="text-sm text-violet-700">
                  从早餐选择到职业规划，我们每天都在理性计算，寻求最优解。这种本能追求，构成了经济学的基础假设。
                </p>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={16} className="text-violet-500" />
                <span className="font-medium text-violet-900">完全理性</span>
              </div>
              <p className="text-sm text-violet-700">信息充分的情况下，总能做出最优决策</p>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={16} className="text-indigo-500" />
                <span className="font-medium text-indigo-900">自利本性</span>
              </div>
              <p className="text-sm text-indigo-700">人们的行为总是以自身利益为导向</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-violet-50 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-violet-600 mb-1">25万+</div>
            <div className="text-sm text-violet-700">学习人数</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-indigo-600 mb-1">98%</div>
            <div className="text-sm text-indigo-700">好评率</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">2.5min</div>
            <div className="text-sm text-blue-700">精讲时长</div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Fancy Border */}
            <div className="absolute -inset-3">
              <div className="w-full h-full rotate-45 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 rounded-lg opacity-50"></div>
            </div>
            
            {/* White Background for QR Code */}
            <div className="absolute inset-0 bg-white rounded-lg p-2">
            </div>

            {/* Corner Decorations */}
            <div className="absolute -top-1 -left-1">
              <Stars size={20} className="text-violet-500" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Stars size={20} className="text-indigo-500" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Stars size={20} className="text-blue-500" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Stars size={20} className="text-violet-500" />
            </div>
          </div>
        </div>

        {/* Scan Text */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            扫码深入理解经济人假设
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Card2;