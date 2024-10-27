import React from 'react';
import { 
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  BookOpen,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card7 = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-100 via-purple-100 to-indigo-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-20 h-20 rounded-full bg-blue-200 opacity-40 blur-xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-32 h-32 rounded-full bg-purple-200 opacity-40 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-indigo-200 opacity-40 blur-xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col">
        {/* Card Header - User Info & Actions */}
        <div className="flex justify-between items-center mb-6">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500">
              <img
                src="/api/placeholder/48/48"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">知识分享官</h3>
              <p className="text-sm text-gray-500">统计学爱好者</p>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Volume2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Knowledge Card Content */}
        <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
          {/* Knowledge Type & Reading Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-600 font-medium">统计学知识</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600">阅读时间 3 分钟</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            辛普森悖论：统计数据中的有趣现象
          </h1>

          {/* Main Content */}
          <div className="space-y-4 overflow-auto">
            <div className="bg-white bg-opacity-60 rounded-xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                什么是辛普森悖论？
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                辛普森悖论是一种统计学现象，在分组数据中，每个子组都显示一种趋势，
                但当数据合并后却呈现相反的趋势。这种现象最早由英国统计学家辛普森在1951年提出。
              </p>
            </div>

            <div className="bg-white bg-opacity-60 rounded-xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                经典案例解析
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                以篮球比赛为例：A队在每个小节的投篮命中率都高于B队，
                但全场统计下来，B队的总命中率反而更高。这是因为各节投篮次数的差异导致的。
              </p>
            </div>

            <div className="bg-white bg-opacity-60 rounded-xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                启示与应用
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                这个悖论告诉我们，在分析数据时要特别注意数据的分组情况，
                避免简单地对数据进行合并而忽略了潜在的统计陷阱。
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer - Social Actions */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Like Button */}
              <button className="flex items-center space-x-2 group">
                <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-pink-500 transition-colors">
                  1.2k
                </span>
              </button>

              {/* Comment Button */}
              <button className="flex items-center space-x-2 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                  56
                </span>
              </button>

              {/* Save Button */}
              <button className="flex items-center space-x-2 group">
                <div className="p-2 rounded-full group-hover:bg-purple-50 transition-colors">
                  <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors">
                  收藏
                </span>
              </button>
            </div>

            {/* View Count */}
            <div className="text-sm text-gray-500">
              2.8k 次学习
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Card7;