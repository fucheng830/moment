import React from 'react';
import { Gift, Share2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card6 = () => {
  return (
    <div className="min-h-screen bg-indigo-50">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-indigo-100 to-purple-200 rounded-none sm:rounded-xl shadow-lg">
        <div className="relative min-h-[480px]">
          {/* Left Top Tab */}
          <div className="absolute left-0 top-0 flex items-center space-x-1 bg-indigo-500 text-white px-4 py-2 rounded-br-xl">
            <Gift size={18} />
            <span className="text-base">惊喜盒子</span>
          </div>

          {/* Right Top Button */}
          <div className="absolute right-2 top-2">
            <button className="flex items-center space-x-1 bg-indigo-500 text-white px-4 py-2 rounded-full transition-all hover:bg-indigo-600 shadow-md">
              <Download size={18} />
              <span className="text-sm">分享保存图片</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="pt-20 px-6 pb-6">
            {/* Achievement Image */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#818cf8', stopOpacity: 0.6}} />
                    <stop offset="100%" style={{stopColor: '#c084fc', stopOpacity: 0.6}} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Background Circle */}
                <circle cx="100" cy="100" r="80" fill="url(#glowGradient)" filter="url(#glow)" />
                
                {/* Staff Symbol */}
                <path
                  d="M100 40 L100 160 M85 55 L115 55 M90 70 L110 70"
                  stroke="#4338ca"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                
                {/* Energy Particles */}
                <circle cx="80" cy="90" r="3" fill="#818cf8" filter="url(#glow)" />
                <circle cx="120" cy="100" r="4" fill="#818cf8" filter="url(#glow)" />
                <circle cx="90" cy="130" r="3" fill="#818cf8" filter="url(#glow)" />
                <circle cx="110" cy="80" r="2" fill="#818cf8" filter="url(#glow)" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-indigo-900 mb-4">
              初入修炼之道！
            </h2>

            {/* Achievement Description */}
            <div className="bg-white bg-opacity-60 rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-indigo-900 text-lg leading-relaxed">
                你已踏上知识修炼之旅，击败了第一只小妖，获得"初级法力棒"！前方还有更多妖怪等你磨炼。
              </p>
              
              {/* Title Achievement */}
              <div className="bg-indigo-100 bg-opacity-70 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                      <span className="text-white text-xl">✧</span>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600">获得新手称号</p>
                      <p className="text-lg font-bold text-indigo-900">修炼小童</p>
                    </div>
                  </div>
                  <div className="text-indigo-600 text-sm">Level 1</div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-6 flex justify-center">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md">
                <Share2 size={20} />
                <span>分享前行增加功力</span>
              </button>
            </div>
          </div>

          {/* Bottom Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-purple-200 to-transparent pointer-events-none" />
        </div>
      </Card>
    </div>
  );
};

export default Card6;