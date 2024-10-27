// @/components/bar/NavBar.tsx

import React, { useCallback, useState, useMemo, useLayoutEffect } from 'react';
import { Home, Layout, UserCircle, Users } from 'lucide-react';
import { usePage } from '@/context/PageContext';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { page: 'home', icon: Home, labelKey: '首页' },
    { page: 'review', icon: Layout, labelKey: '学习工作区' },
    { page: 'profile', icon: UserCircle, labelKey: '个人资料' },
    { page: 'social', icon: Users, labelKey: '社交广场' },
];

const SideBarContent: React.FC = React.memo(() => {
    const { currentPage, navigateTo } = usePage();
    const handleNavItemClick = useCallback((page: string) => {
        navigateTo(page);
    }, [navigateTo]);

    return (
        <div className="flex flex-col h-full p-2 overflow-hidden select-none">
            <div className="flex flex-col space-y-1 mb-4">
                {navItems.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                        <div
                            key={item.page}
                            onClick={() => handleNavItemClick(item.page)}
                            className="flex items-center justify-between cursor-pointer relative group p-2"
                            title={item.labelKey}
                        >
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 bg-muted rounded-md select-none"
                                    layoutId="activeBackground"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                />
                            )}
                            <div className="flex items-center flex-1 relative z-10">
                                <item.icon className={cn(
                                    "h-4 w-4 transition-colors mr-3",
                                    isActive ? "text-primary" : "text-muted-foreground",
                                    "group-hover:text-primary"
                                )} />
                                <span className={cn(
                                    "text-sm",
                                    isActive ? "text-primary" : "text-muted-foreground",
                                    "group-hover:text-primary"
                                )}>
                                    {item.labelKey}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

const MobileNavBar: React.FC = () => {
    const { currentPage, navigateTo } = usePage();
    const [localActivePage, setLocalActivePage] = useState(currentPage);
    const [isNavigating, setIsNavigating] = useState(false);

    useLayoutEffect(() => {
        setLocalActivePage(currentPage);
    }, [currentPage]);

    const handleNavItemClick = useCallback((page: string) => {
        if (page !== localActivePage && !isNavigating) {
            setIsNavigating(true);
            setLocalActivePage(page);
            navigateTo(page);
            setTimeout(() => setIsNavigating(false), 300);
        }
    }, [localActivePage, navigateTo, isNavigating]);

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-secondary flex items-center justify-between border-t z-50 overflow-hidden lg:hidden">
            {navItems.map((item) => (
                <motion.button
                    key={item.page}
                    onClick={() => handleNavItemClick(item.page)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex-1 h-full flex flex-col items-center justify-center relative",
                        "focus:outline-none active:outline-none transition-colors duration-200 ease-in-out",
                        "touch-none",
                        localActivePage === item.page ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <AnimatePresence>
                        {localActivePage === item.page && (
                            <motion.div
                                className="absolute inset-0 bg-muted rounded-md select-none"
                                layoutId="activeBackgroundMobile"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    duration: 0.2
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <div className="relative">
                        <item.icon className={cn(
                            "h-6 w-6 relative z-10 mb-1 transition-colors duration-200 ease-in-out",
                            localActivePage === item.page ? "text-primary" : "text-muted-foreground"
                        )} />
                    </div>
                    <span className="text-xs relative z-10 transition-colors duration-200 ease-in-out">
                        {item.labelKey}
                    </span>
                </motion.button>
            ))}
        </nav>
    );
};

export function NavBar() {
    return (
        <>
            <aside className="hidden lg:flex flex-col h-full relative lg:max-w-[190px] lg:min-w-[190px] ">
                <div className="flex flex-col">
                    <SideBarContent />
                </div>
            </aside>
            <MobileNavBar />
        </>
    );
}