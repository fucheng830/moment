import React from 'react';
import { useGuide } from '../GuidePage';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotesContext } from '@/context/NotesContext';

interface LearningOption {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const Step1: React.FC = () => {
    const { setCurrentStepIndex } = useGuide();
    const { selectedCategoryId, handleSelectCategory } = useNotesContext();

    const learningOptions: LearningOption[] = [
        {
            id: 'ai',
            title: '人工智能',
            description: '机器学习、深度学习、神经网络',
            icon: '🤖'
        },
        {
            id: 'math',
            title: '数学',
            description: '代数、几何、微积分等基础数学知识',
            icon: '📐'
        },
        {
            id: 'programming',
            title: '编程',
            description: 'Python、JavaScript等编程语言基础',
            icon: '💻'
        },
        {
            id: 'science',
            title: '科学',
            description: '物理、化学、生物等自然科学知识',
            icon: '🔬'
        },
        {
            id: 'language',
            title: '语言',
            description: '英语、日语等语言学习',
            icon: '🗣'
        },
        {
            id: 'art',
            title: '艺术',
            description: '绘画、音乐、设计等艺术课程',
            icon: '🎨'
        },
        {
            id: 'economics',
            title: '经济学',
            description: '微观经济学、宏观经济学、金融基础',
            icon: '📈'
        },
        {
            id: 'history',
            title: '历史',
            description: '世界史、文明发展、重要历史事件',
            icon: '📚'
        },
        {
            id: 'computerScience',
            title: '计算机科学',
            description: '算法、数据结构、操作系统',
            icon: '🖥'
        },
        {
            id: 'psychology',
            title: '心理学',
            description: '认知心理学、社会心理学、心理健康',
            icon: '🧠'
        },
        {
            id: 'writing',
            title: '写作',
            description: '创意写作、论文写作、商务写作',
            icon: '✍️'
        },
        {
            id: 'business',
            title: '商业',
            description: '创业、市场营销、管理学基础',
            icon: '💼'
        }
    ];

    const handleOptionClick = (id: string) => {
        handleSelectCategory(id);
    };

    const handleContinue = () => {
        if (selectedCategoryId) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-68px)] mx-auto gap-6 w-full">
            {/* 固定高度的头部标题区域 */}
            <div className="flex flex-col items-center space-y-2 pt-6 h-[100px]">
                <h1 className="text-2xl font-bold">
                    你想在 moment 学习什么？
                </h1>
                <p className="text-gray-600">
                    (请选择一个领域开始学习)
                </p>
            </div>

            {/* 自动填充剩余空间的内容区域 */}
            <ScrollArea className="flex-1 min-h-0 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {learningOptions.map((option) => (
                        <div key={option.id}>
                            <div
                                className={`h-[120px] p-6 rounded-lg cursor-pointer 
                                    transition-all duration-200 ease-out flex items-center
                                    ${selectedCategoryId === option.id
                                        ? 'border-2 border-blue-500 bg-blue-50'
                                        : 'border border-gray-200 hover:border-blue-300'
                                    }`}
                                onClick={() => handleOptionClick(option.id)}
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <span className="text-4xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{option.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* 固定高度的底部按钮区域 */}
            <div className="flex justify-center h-[80px] items-center">
                <button
                    className={`px-8 py-3 rounded-full font-semibold border-2 
                        transition-all duration-200 ease-out
                        ${selectedCategoryId
                            ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                            : 'border-gray-300 text-gray-400'
                        }`}
                    onClick={handleContinue}
                    disabled={!selectedCategoryId}
                >
                    继续
                </button>
            </div>
        </div>
    );
}

export default Step1;