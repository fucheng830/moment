import React from 'react';
import { Brain, Stars, Heart, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card3 = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-100 via-purple-100 to-indigo-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-20 h-20 rounded-full bg-blue-200 opacity-40 blur-xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-32 h-32 rounded-full bg-purple-200 opacity-40 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-indigo-200 opacity-40 blur-xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center">
            <Brain size={48} className="text-indigo-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 leading-tight">
            面对背叛的诱惑，你会怎么选？
            <br />
            <span className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              一道让世界顶尖智者困惑的难题
            </span>
          </h1>
        </div>

        {/* Challenge Preview */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle size={24} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-base sm:text-lg text-indigo-900 leading-relaxed">
                假如你和搭档被分别关押审讯，每个人都面临一个选择：坦白出卖对方，还是保持沉默？在利益与信任的博弈中，你会如何抉择？
                <br />
                <span className="font-bold">
                  快来体验这个困扰了无数经济学家的终极难题！
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">95%</div>
            <div className="text-sm text-blue-700">选择背叛</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">2倍</div>
            <div className="text-sm text-purple-700">收益差距</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600 mb-1">
              <Heart size={24} className="inline-block" />
            </div>
            <div className="text-sm text-indigo-700">信任的考验</div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center">
          <div className="relative">
            {/* QR Code Container with Decorative Border */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
              {/* Fancy Border */}
              <div className="absolute -inset-3">
                <div className="w-full h-full rotate-45 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-lg opacity-50"></div>
              </div>
              
              {/* White Background for QR Code */}
              <div className="absolute inset-0 bg-white rounded-lg p-2">
              </div>

              {/* Corner Decorations */}
              <div className="absolute -top-1 -left-1">
                <Stars size={20} className="text-indigo-500" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Stars size={20} className="text-purple-500" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Stars size={20} className="text-blue-500" />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <Stars size={20} className="text-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Scan Text */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            扫码解锁终极抉择
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Card3;