import React, { useState } from 'react';
import { useGuide } from '../GuidePage';
import { ScrollArea } from "@/components/ui/scroll-area";

interface GoalLevel {
    id: string;
    title: string;
    description: string;
    icon: string;
    timeEstimate: string;
}

const Step5: React.FC = () => {
    const { setCurrentStepIndex } = useGuide();
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

    const goalLevels: GoalLevel[] = [
        {
            id: 'basic',
            title: '基础掌握',
            description: '掌握核心概念和基本应用',
            icon: '🎯',
            timeEstimate: '约2-3个月'
        },
        {
            id: 'proficient',
            title: '熟练应用',
            description: '能够独立解决常见问题',
            icon: '⭐',
            timeEstimate: '约4-6个月'
        },
        {
            id: 'expert',
            title: '精通',
            description: '深入理解并能处理复杂问题',
            icon: '🏆',
            timeEstimate: '约8-12个月'
        },
        {
            id: 'master',
            title: '大师水平',
            description: '达到专业水准，能够指导他人',
            icon: '👑',
            timeEstimate: '1年以上'
        }
    ];

    const handleGoalSelect = (id: string) => {
        setSelectedGoal(id);
    };

    const handleContinue = () => {
        if (selectedGoal) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-full w-full mx-auto gap-6">
            {/* 头部标题区域 */}
            <div className="flex flex-col items-center space-y-2">
                <h1 className="text-2xl font-bold">
                    你想达到什么水平？
                </h1>
                <p className="text-gray-600">
                    选择你的学习目标
                </p>
            </div>

            {/* 可滚动的内容区域 */}
            <ScrollArea className="flex-1 min-h-0 max-h-[60vh] p-4 w-full">
                <div className="space-y-4 px-4">
                    {goalLevels.map((goal) => (
                        <div
                            key={goal.id}
                            className={`p-4 rounded-lg cursor-pointer 
                            transition-all duration-200 ease-out
                            ${selectedGoal === goal.id
                                ? 'border-2 border-blue-500 bg-blue-50'
                                : 'border border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => handleGoalSelect(goal.id)}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{goal.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                                    <p className="text-gray-600">{goal.description}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {goal.timeEstimate}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* 底部按钮 */}
            <div className="flex justify-center p-4">
                <button
                    className={`px-8 py-3 rounded-full font-semibold border-2 
                    transition-all duration-200 ease-out hover:scale-105
                    ${selectedGoal
                        ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400 hover:scale-100'
                    }`}
                    onClick={handleContinue}
                    disabled={!selectedGoal}
                >
                    开始学习
                </button>
            </div>
        </div>
    );
};

export default Step5;