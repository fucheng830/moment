// @/context/PageContext.tsx
// 自定义的页面状态管理,路由系统

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

type PageType = string;

interface PageState {
  type: PageType;
  key: string;
}

interface PageContextType {
  currentPage: PageType;
  activePages: PageState[];
  setPage: (page: PageType) => void;
  navigateTo: (page: PageType) => void;
  goBack: () => void;
  skipTo: (page: PageType) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

const MAX_HISTORY_LENGTH = 100;

const PageProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('guide');//当前页面
  const [activePages, setActivePages] = useState<PageState[]>([{ type: 'guide', key: 'guide-0' }]);//要缓存的页面，处于激活状态
  const [navigationHistory, setNavigationHistory] = useState<PageState[]>([{ type: 'guide', key: 'guide-0' }]);//页面历史记录


  //直接设置当前页面，不保存页面历史
  const setPage = useCallback((page: PageType) => {
    setCurrentPage(page);
    setActivePages(prev => {
      const existingIndex = prev.findIndex(p => p.type === page);
      if (existingIndex !== -1) {
        return prev;
      }
      return [...prev, { type: page, key: `${page}-${Date.now()}` }];
    });
  }, []);


  // 跳转到指定页面,不保存当前页面的状态，但是保存历史
  const navigateTo = useCallback((page: PageType) => {
    try {
        if (!page) throw new Error('Invalid page type');
        setCurrentPage(page);
        setActivePages([{ type: page, key: `${page}-${Date.now()}` }]);
        setNavigationHistory(prev => {
            const newHistory = [...prev, { type: page, key: `${page}-${Date.now()}` }];
            return newHistory.slice(-MAX_HISTORY_LENGTH);
        });
    } catch (error) {
        console.error('Navigation failed:', error);
        // 可以添加一个fallback页面
        setCurrentPage('guide'); // 或其他默认页面
    }
}, [currentPage]);



  // 返回上一页面,如果有多个已经加载的页面，移除最后一个页面
  const goBack = useCallback(() => {
    if (activePages.length > 1) {
      console.log('返回上个页面状态');
      const newPages = activePages.slice(0, -1);
      const previousPage = newPages[newPages.length - 1];
      setCurrentPage(previousPage.type);
      setActivePages(newPages);
    } else {
      console.log('回到历史记录中的上个页面');
      setNavigationHistory(prev => {
        if (prev.length > 1) {
          const newHistory = prev.slice(0, -1);
          const previousPage = newHistory[newHistory.length - 1];
          setCurrentPage(previousPage.type);
          setActivePages([previousPage]);
          return newHistory;
        }
        return prev; // 如果历史记录中只有一个页面，不做任何改变
      });
    }
  }, [activePages]);



  // 跳到指定页面并且保存当前页面的状态，用来在不清空当前页面状态的情况下访问新页面
  const skipTo = useCallback((page: PageType) => {
    console.log('当前页面已保留，跳转到新页面', page);
    setCurrentPage(page);
    setActivePages(prev => {
      const existingIndex = prev.findIndex(p => p.type === page);
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }
      return [...prev, { type: page, key: `${page}-${Date.now()}` }];
    });
  }, []);


  const value = {
    currentPage,
    activePages,
    setPage,
    navigateTo,
    goBack,
    skipTo
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
});

PageProvider.displayName = 'PageProvider';

export { PageProvider };

export const usePage = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};