import React from 'react';
import { Gift, Share2, Download, Zap, Users, Sparkle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card10 = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-cyan-100 to-blue-200">
      {/* Main Content Container */}
      <div className="relative">
        {/* Left Top Tab */}
        <div className="absolute left-0 top-0 flex items-center space-x-1 bg-cyan-500 text-white px-4 py-2 rounded-br-xl">
          <Gift size={18} />
          <span className="text-base">惊喜盒子</span>
        </div>

        {/* Right Top Button */}
        <div className="absolute right-2 top-2">
          <button className="flex items-center space-x-1 bg-cyan-500 text-white px-4 py-2 rounded-full transition-all hover:bg-cyan-600 shadow-md">
            <Download size={18} />
            <span className="text-sm">分享保存图片</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="pt-16 px-6 pb-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-cyan-900 mb-8">
            匹配好友
          </h2>

          {/* VS Section */}
          <div className="relative flex justify-between items-center mb-8">
            {/* User Avatar */}
            <div className="flex flex-col items-center space-y-3 w-28 sm:w-32">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 flex items-center justify-center shadow-lg">
                  <div className="absolute inset-0 rounded-full bg-white opacity-20"></div>
                  <Sparkle size={32} className="text-cyan-700" />
                </div>
                <div className="absolute -bottom-1 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-md">
                  <Users size={14} className="text-white" />
                </div>
              </div>
              <span className="text-sm sm:text-base text-cyan-900 font-medium">科学探索者</span>
              <div className="px-3 py-1 bg-cyan-100 rounded-full text-xs text-cyan-600 font-medium">
                Lv.5 研究员
              </div>
            </div>

            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
            </div>

            {/* Friend Avatar (Mystery) */}
            <div className="flex flex-col items-center space-y-3 w-28 sm:w-32">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
                  <div className="absolute inset-0 rounded-full bg-black opacity-10"></div>
                  <div className="text-3xl sm:text-4xl text-gray-500 font-bold">?</div>
                </div>
                <div className="absolute -bottom-1 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-400 flex items-center justify-center shadow-md">
                  <div className="text-base sm:text-lg text-white font-bold">?</div>
                </div>
              </div>
              <span className="text-sm sm:text-base text-gray-500 font-medium">神秘对手</span>
              <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600 font-medium">
                未知等级
              </div>
            </div>
          </div>

          {/* Battle Button */}
          <div className="flex flex-col items-center space-y-4">
            <button className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center">
                <Zap size={40} className="text-white mb-2" />
                <span className="text-white text-lg sm:text-xl font-bold">开始 PK</span>
              </div>
            </button>

            {/* Share Button */}
            <button className="flex items-center space-x-2 bg-white bg-opacity-50 text-cyan-700 px-6 py-3 rounded-full hover:bg-opacity-70 transition-all">
              <Share2 size={20} />
              <span className="font-medium">邀请好友来挑战</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Card10;