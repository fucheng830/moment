// @/pages/GuidePage.tsx

import React, { useState, useContext, createContext, useEffect, useCallback } from 'react';
import { usePage } from '@/context/PageContext';
import { useNotesContext } from '@/context/NotesContext';
import { motion, AnimatePresence } from 'framer-motion';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSetting } from '@/context/SettingContext';


interface GuideContextType {
    currentStepIndex: number;
    guideCategoryId: string | null;
    guideNoteIds: string[];
    setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
    setNewCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
    setGuideNoteIds: React.Dispatch<React.SetStateAction<string[]>>;
    handleFinish: () => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const useGuide = () => {
    const context = useContext(GuideContext);
    if (!context) {
        throw new Error('useGuide must be used within a GuideProvider');
    }
    return context;
};


const GuidePage: React.FC = () => {
    const { navigateTo } = usePage();
    const { isLoading } = useNotesContext();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentActionIndex, setCurrentActionIndex] = useState(0);
    const [guideCategoryId, setNewCategoryId] = useState<string | null>(null);
    const [guideNoteIds, setGuideNoteIds] = useState<string[]>([]);
    const { setIsGuideActive} = useSetting();


    // 添加 useEffect 钩子来在组件挂载时创建笔记，创建引导需要的数据
    useEffect(() => {
            setCurrentStepIndex(0);
            setIsGuideActive(true);
    }, []);


    const handleFinish = () => {
        navigateTo('home');
        console.log('引导完成，跳转到主页');
        setIsGuideActive(false)
    };


    const handleStepClick = (index: number) => {
        setCurrentStepIndex(index);
        setCurrentActionIndex(0);
    };

    const guideContextValue: GuideContextType = {
        guideCategoryId,
        guideNoteIds,
        currentStepIndex,
        setCurrentStepIndex,
        setNewCategoryId,
        setGuideNoteIds,
        handleFinish,
    };

    const steps = [Step1, Step2, Step3, Step4, Step5,Step6];
    const CurrentStep = steps[currentStepIndex];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <Spinner className="w-20 h-20 text-primary" />
            </div>
        );
    }

    return (
        <GuideContext.Provider value={guideContextValue}>
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50 overflow-hidden px-6">
                <div className="w-full max-w-3xl h-full relative mt-4">
                    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between">
                        <div className="w-1/3"></div> {/* 左侧占位 */}
                        <div className="flex justify-center w-1/3 space-x-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-4 h-4 aspect-square rounded-full cursor-pointer
                                        ${currentStepIndex >= index ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}
                                    `}
                                    onClick={() => handleStepClick(index)}
                                />
                            ))}
                        </div>
                        <div className="w-1/3 flex justify-end">
                            <Button
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => handleFinish()}
                            >
                                跳过引导
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col w-full max-w-3xl h-full pt-12">
                        <div className="flex-grow flex flex-col justify-between select-none">
                            <AnimatePresence mode="wait" key={`${currentStepIndex}-${currentActionIndex}`}>
                                <CurrentStep />
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </GuideContext.Provider>
    );
};

export default GuidePage;