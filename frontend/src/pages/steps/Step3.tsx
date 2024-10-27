import React, { useState } from 'react';
import { useGuide } from '../GuidePage';
import { ScrollArea } from "@/components/ui/scroll-area";
interface ContentFormat {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const Step3: React.FC = () => {
    const { setCurrentStepIndex } = useGuide();
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

    const contentFormats: ContentFormat[] = [
        {
            id: 'textImage',
            title: '图文',
            description: '通过阅读文章和观看图片学习，适合自主学习的你',
            icon: '📝'
        },
        {
            id: 'podcast',
            title: '播客',
            description: '通过音频学习，适合边走边听或忙碌时学习',
            icon: '🎧'
        },
        {
            id: 'video',
            title: '视频',
            description: '通过视频教程学习，直观生动的学习体验',
            icon: '🎥'
        },
        {
            id: 'mixed',
            title: '混合',
            description: '结合多种形式，全方位提升学习效果',
            icon: '🔄'
        }
    ];

    const handleFormatSelect = (id: string) => {
        setSelectedFormat(id);
    };

    const handleContinue = () => {
        if (selectedFormat) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto p-4 w-full">
            <h1 className="text-2xl font-bold mb-8">
                选择你喜欢的学习方式
            </h1>
            <ScrollArea className="flex-1 min-h-0 max-h-[60vh] p-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {contentFormats.map((format) => (
                        <div
                            key={format.id}
                            className={`p-6 rounded-lg cursor-pointer 
    transition-all duration-200 ease-out
    ${selectedFormat === format.id
                                    ? 'border-2 border-blue-500 bg-blue-50'
                                    : 'border border-gray-200 hover:border-blue-300'
                                }`}
                            onClick={() => handleFormatSelect(format.id)}
                        >
                            <div className="flex flex-col items-center text-center gap-3">
                                <span className="text-4xl mb-2">{format.icon}</span>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{format.title}</h3>
                                    <p className="text-sm text-gray-600">{format.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <button
                className={`mt-8 px-8 py-3 rounded-full font-semibold border-2 
                transition-all duration-200 ease-out hover:scale-105
                ${selectedFormat
                        ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400 hover:scale-100'
                    }`}
                onClick={handleContinue}
                disabled={!selectedFormat}
            >
                继续
            </button>
        </div>
    );
};

export default Step3;