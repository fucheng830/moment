import React from 'react';
import { Gift, Volume2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Card4 = () => {
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
              <h2 className="text-2xl font-bold text-indigo-900">知识导图</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-indigo-300 to-purple-400 mx-auto mt-2 rounded-full" />
            </div>

            {/* Mind Map */}
            <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-5 shadow-sm">
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                {/* Central Node */}
                <g transform="translate(200, 200)">
                  {/* Main Circle */}
                  <circle r="50" fill="url(#gradient-main)" />
                  <text textAnchor="middle" dy="0" fill="#fff" fontSize="14" fontWeight="bold">
                    <tspan x="0" y="-6">美国大选</tspan>
                    <tspan x="0" y="12">案例分析</tspan>
                  </text>

                  {/* Connection Lines */}
                  <g className="connections">
                    {/* Top Branch */}
                    <path d="M 0,-50 Q 0,-100 -100,-100" stroke="#818cf8" strokeWidth="2" fill="none" />
                    {/* Right Branch */}
                    <path d="M 35,35 Q 100,50 150,0" stroke="#818cf8" strokeWidth="2" fill="none" />
                    {/* Bottom Branch */}
                    <path d="M -35,35 Q -80,80 -100,120" stroke="#818cf8" strokeWidth="2" fill="none" />
                  </g>

                  {/* Sub Nodes */}
                  {/* 经济人假设 Node */}
                  <g transform="translate(-100, -100)">
                    <circle r="40" fill="#c7d2fe" />
                    <text textAnchor="middle" fill="#312e81" fontSize="12" fontWeight="500">
                      <tspan x="0" y="-6">经济人</tspan>
                      <tspan x="0" y="8">假设</tspan>
                    </text>
                    {/* Sub points */}
                    <g transform="translate(-60, -20)" fontSize="10">
                      <text fill="#4338ca">
                        <tspan x="0" y="0">• 理性决策</tspan>
                        <tspan x="0" y="20">• 利益最大化</tspan>
                      </text>
                    </g>
                  </g>

                  {/* 辛普森悖论 Node */}
                  <g transform="translate(150, 0)">
                    <circle r="40" fill="#c7d2fe" />
                    <text textAnchor="middle" fill="#312e81" fontSize="12" fontWeight="500">
                      <tspan x="0" y="-6">辛普森</tspan>
                      <tspan x="0" y="8">悖论</tspan>
                    </text>
                    {/* Sub points */}
                    <g transform="translate(20, -40)" fontSize="10">
                      <text fill="#4338ca">
                        <tspan x="0" y="0">• 数据分组</tspan>
                        <tspan x="0" y="20">• 统计陷阱</tspan>
                      </text>
                    </g>
                  </g>

                  {/* 博弈论 Node */}
                  <g transform="translate(-100, 120)">
                    <circle r="40" fill="#c7d2fe" />
                    <text textAnchor="middle" fill="#312e81" fontSize="12" fontWeight="500">
                      <tspan x="0" y="-6">博弈论</tspan>
                      <tspan x="0" y="8">策略</tspan>
                    </text>
                    {/* Sub points */}
                    <g transform="translate(-60, 20)" fontSize="10">
                      <text fill="#4338ca">
                        <tspan x="0" y="0">• 策略选择</tspan>
                        <tspan x="0" y="20">• 利益权衡</tspan>
                      </text>
                    </g>
                  </g>
                </g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Bottom Notes */}
            <div className="mt-4 bg-indigo-50/60 rounded-lg p-4">
              <p className="text-sm text-indigo-900 leading-relaxed">
                这张思维导图展示了美国大选中的三个核心经济学概念如何相互关联、共同影响选举的进程和结果。每个概念都提供了独特的分析视角，帮助我们更全面地理解选举的复杂性。
              </p>
            </div>

            {/* Progress */}
            <div className="mt-4 flex items-center justify-between text-sm text-indigo-600">
              <div className="flex items-center space-x-2">
                <span className="block w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>知识图谱</span>
              </div>
              <span>概念关联 3/3</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Card4;