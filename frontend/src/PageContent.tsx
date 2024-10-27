// @/PageContent.tsx
// 自定义页面路由

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Loader2 } from "lucide-react";
import { usePage } from '@/context/PageContext';

import ReviewPage from '@/pages/ReviewPage';
import ReadPage from '@/pages/ReadPage';
import GuidePage from '@/pages/GuidePage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import SocialPage from './pages/SocialPage';
import CategorysPage from '@/pages/CategorysPage';

import { useShowNavbar } from '@/hooks/useMediaQuery';

const pageComponents: { [key: string]: React.FC } = {
  'categorys': CategorysPage,//选择分类的页面
  'review': ReviewPage,//学习页面
  'guide': GuidePage,//引导页
  'queue-read': ReadPage,//阅读队列页面
  'home': HomePage,//主页，单行的学习页面
  'profile': ProfilePage,//个人中心页面
  'social': SocialPage,//社交页面
};



export const PageContent: React.FC = () => {
  const { currentPage, activePages, setPage, navigateTo } = usePage();
  const initializationStarted = useRef(false);
  const [initState, setInitState] = useState({
    isLoading: true,
    error: null as string | null,
    initializationStage: '',
  });
  const showNavbar = useShowNavbar();
  const heightClass = showNavbar ? 'h-[calc(100vh-68px)]' : 'h-screen';

  // 初始化过程
  const initializeApp = useCallback(async () => {
    try {
      setInitState(prev => ({ ...prev, initializationStage: '检查本地内容' }));
      if (true) {
        console.log('跳转到引导页');
        setPage('guide');
        return;
      } else {
        setInitState(prev => ({ ...prev, initializationStage: '检查学习队列' }));
      }
    } catch (err) {
      console.error('初始化过程出错', err);
      setInitState(prev => ({ ...prev, error: String(err) }));
    } finally {
      setInitState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setPage]);


  useEffect(() => {
    if (!initializationStarted.current) {
      initializationStarted.current = true;
      initializeApp();
    }
  }, []);


  if (initState.isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-24 w-24 animate-spin text-primary opacity-80" />
          <p className="mt-4">{initState.initializationStage}</p>
        </div>
      </div>
    );
  }




  return (
    <div className={`w-full flex-grow ${heightClass}`}>
      {activePages.map((page) => {
        // 修改为添加检查
        const PageComponent = pageComponents[page.type];
        if (!PageComponent) {
          console.error(`No component found for page type: ${page.type}`);
          return null;
        }
        return (
          <div
            key={page.key} // 添加这一行
            className='w-full h-full overflow-hidden'
            style={{ display: page.type === currentPage ? 'block' : 'none', }}
          >
    
            <PageComponent />
          </div>
        );
      })}
    </div>
  );
};

export default PageContent;