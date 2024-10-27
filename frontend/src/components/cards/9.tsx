import React from 'react';
import { 
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  GraduationCap,
  Clock,
  Users,
  BookOpen,
  Star,
  PlayCircle,
  Trophy
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card9 = () => {
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
        {/* Card Header */}
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
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">王教授</h3>
                <div className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  认证讲师
                </div>
              </div>
              <p className="text-sm text-gray-500">统计学系副教授</p>
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

        {/* Main Course Content */}
        <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
          {/* Course Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">系统课程</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-600">12课时</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-600">2.8k人已购</span>
              </div>
            </div>
          </div>

          {/* Course Title */}
          <div className="bg-white bg-opacity-60 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              统计学入门到精通
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              从零基础到实战应用，带你掌握统计学精髓
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.9分)</span>
            </div>
          </div>

          {/* Course Features */}
          <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
            <div className="bg-white bg-opacity-60 rounded-xl p-4 flex items-start space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">系统课程</h3>
                <p className="text-sm text-gray-600">12节精品课程</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-60 rounded-xl p-4 flex items-start space-x-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <PlayCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">随时学习</h3>
                <p className="text-sm text-gray-600">永久观看回放</p>
              </div>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-600">¥299</span>
              <span className="text-base sm:text-lg text-gray-400 line-through">¥599</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                限时5折
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>立即购买</span>
            </button>
          </div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Like Button */}
              <button className="flex items-center space-x-2 group">
                <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-pink-500 transition-colors">
                  826
                </span>
              </button>

              {/* Comment Button */}
              <button className="flex items-center space-x-2 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                  243
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
              8.6k 次浏览
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Card9;