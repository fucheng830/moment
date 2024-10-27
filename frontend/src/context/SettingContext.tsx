// @/context/SettingContext.tsx
// 和设置选项有关的上下文



import React, { createContext, useState, useContext, useEffect } from 'react';


interface SettingContextType {
  IsGuideActive: boolean;
  theme: 'light' | 'dark';//控制主题色
  setIsGuideActive: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
}


const SettingContext = createContext<SettingContextType | undefined>(undefined);


export const SettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [IsGuideActive, setIsGuideActive] = useState(false);



  useEffect(() => {
    const initTheme = () => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    };
    initTheme();
    console.log('初始化主题设置');
  }, []);



  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  //切换主题
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');


  const value = {
    theme,
    IsGuideActive,
    setIsGuideActive,
    toggleTheme,
  };

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>;
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context;
};