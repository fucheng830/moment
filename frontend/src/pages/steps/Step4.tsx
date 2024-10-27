import React, { useState } from 'react';
import { useGuide } from '../GuidePage';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProficiencyLevel {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const Step4: React.FC = () => {
    const { setCurrentStepIndex } = useGuide();
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const proficiencyLevels: ProficiencyLevel[] = [
        {
            id: 'beginner',
            title: '完全新手',
            description: '对这个领域完全陌生，需要从基础开始学习',
            icon: '🌱'
        },
        {
            id: 'elementary',
            title: '入门水平',
            description: '了解一些基本概念，但需要系统学习',
            icon: '🌿'
        },
        {
            id: 'intermediate',
            title: '中级水平',
            description: '掌握基础知识，需要进阶学习',
            icon: '🌲'
        },
        {
            id: 'advanced',
            title: '高级水平',
            description: '已有扎实基础，想要更深入学习',
            icon: '🎯'
        }
    ];

    const handleLevelSelect = (id: string) => {
        setSelectedLevel(id);
    };

    const handleContinue = () => {
        if (selectedLevel) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-full  mx-auto gap-6 w-full">
            {/* 头部标题区域 */}
            <div className="flex flex-col items-center space-y-2">
                <h1 className="text-2xl font-bold">
                    你目前的水平如何？
                </h1>
                <p className="text-gray-600">
                    选择最符合你当前状况的级别
                </p>
            </div>

            {/* 可滚动的内容区域 */}
            <ScrollArea className="flex-1 min-h-0 max-h-[60vh] p-4">
                <div className="space-y-4 px-4">
                    {proficiencyLevels.map((level) => (
                        <div
                            key={level.id}
                            className={`p-4 rounded-lg cursor-pointer 
                            transition-all duration-200 ease-out 
                            ${selectedLevel === level.id
                                ? 'border-2 border-blue-500 bg-blue-50'
                                : 'border border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => handleLevelSelect(level.id)}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{level.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-lg">{level.title}</h3>
                                    <p className="text-gray-600">{level.description}</p>
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
                    ${selectedLevel
                        ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400 hover:scale-100'
                    }`}
                    onClick={handleContinue}
                    disabled={!selectedLevel}
                >
                    继续
                </button>
            </div>
        </div>
    );
};

export default Step4;