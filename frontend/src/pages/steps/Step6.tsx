import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@/context/PageContext'; // 假设你有一个 PageContext

const Step6: React.FC = () => {
    const { navigateTo } = usePage();

    const containerVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6 }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 }
        }
    };

    const titleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 0.6 }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const handleFinish = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 阻止事件冒泡

        // 直接导航到 home 页面
        navigateTo('home');
    };


    return (
        <motion.div
            className="flex flex-col h-full w-full mx-auto gap-6"
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <motion.div
                className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center"
                variants={containerVariants}
            >
                <motion.div
                    className="text-8xl mb-6"
                    variants={titleVariants}
                >
                    🎉
                </motion.div>

                <motion.h1
                    className="text-3xl font-bold mb-4"
                    variants={titleVariants}
                >
                    太棒了！
                </motion.h1>

                <motion.p
                    className="text-xl text-muted-foreground mb-8"
                    variants={titleVariants}
                >
                    你已完成所有设置，现在开始你的学习之旅吧！
                </motion.p>

                <motion.button
                    className={`px-8 py-3 rounded-full font-semibold 
                    bg-primary text-primary-foreground
                    hover:bg-primary/90
                    transition-colors duration-200`}
                    onClick={handleFinish}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={titleVariants}
                >
                    开始学习
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Step6;