// @/src/context/ThemeContext.tsx
// 自定义的主题上下文



import React, { createContext, useState, useContext, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import localStorageManager, { StorageKey } from '@/storage/localStorageManager';

export type ThemeType = 'light' | 'dark' | 'system';


interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);



export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    //默认深色主题
    const [theme, setTheme] = useState<ThemeType>(() => {
        // 使用 LocalStorageManager 读取主题
        const savedTheme = localStorageManager.loadData<ThemeType>(StorageKey.APP_THEME);
        return (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') ? savedTheme : 'dark';
    });
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');

    //跟踪主题变化,更新APP状态栏颜色
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            updateStatusBar();
        }
    }, [effectiveTheme]);

    //更新状态栏颜色
    const updateStatusBar = async () => {
        if (effectiveTheme === 'dark') {
            await StatusBar.setBackgroundColor({ color: '#18181a' });
            await StatusBar.setStyle({ style: Style.Dark });
        } else {
            await StatusBar.setBackgroundColor({ color: '#f0ede5' });
            await StatusBar.setStyle({ style: Style.Light });
        }
    };

    //应用主题切换
    const applyTheme = async (newTheme: ThemeType) => {
        let newEffectiveTheme: 'light' | 'dark';
        if (newTheme === 'system') {
            newEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            newEffectiveTheme = newTheme;
        }
        setEffectiveTheme(newEffectiveTheme);
        document.documentElement.classList.toggle('dark', newEffectiveTheme === 'dark');
        localStorageManager.saveData(StorageKey.APP_THEME, newTheme);
        // 更新 PWA theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', newEffectiveTheme === 'dark' ? '#18181a' : '#f0ede5');
        }
        // 更新原生平台状态栏
        if (Capacitor.isNativePlatform()) {
            const statusBarConfig = newEffectiveTheme === 'dark' 
                ? {
                    backgroundColor: '#18181a',
                    style: Style.Dark
                } 
                : {
                    backgroundColor: '#f0ede5',
                    style: Style.Light
                };
    
            await StatusBar.setBackgroundColor({ color: statusBarConfig.backgroundColor });
            await StatusBar.setStyle({ style: statusBarConfig.style });
        }
    };

    // 立即执行的 useEffect 用于首次加载时设置主题
    // 修改首次加载时的主题设置
    useEffect(() => {
        const savedTheme = localStorageManager.loadData<ThemeType>(StorageKey.APP_THEME);
        const initialTheme = (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') ? savedTheme : 'dark';
        applyTheme(initialTheme);
    }, []);


    // 监听系统主题变化
    useEffect(() => {
        applyTheme(theme);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [theme]);


    // 修改存储主题的方法
    const setThemeAndStore = (newTheme: ThemeType) => {
        setTheme(newTheme);
        localStorageManager.saveData(StorageKey.APP_THEME, newTheme);
    };


    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeAndStore, effectiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};