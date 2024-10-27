import React from 'react';
import { 
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  Lock,
  BookOpen,
  Clock,
  Crown
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card8 = () => {
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
        <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 relative overflow-hidden">
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
          <div className="space-y-4">
            <div className="bg-white bg-opacity-60 rounded-xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                什么是辛普森悖论？
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                辛普森悖论是一种统计学现象，在分组数据中，每个子组都显示一种趋势，
                但当数据合并后却呈现相反的趋势。这种现象最早由英国统计学家辛普森在1951年提出。
              </p>
            </div>

            {/* Premium Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/95 backdrop-blur-[2px]">
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="bg-yellow-400 rounded-full p-2 mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg max-w-sm mx-auto">
                  <Lock className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    解锁完整知识内容
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    成为会员，探索更多深度知识
                  </p>
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-colors">
                    立即开通会员
                  </button>
                </div>
              </div>
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

export default Card8;