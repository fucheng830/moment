// @/hooks/useMediaQuery.ts

"use client";

import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand' // 如果你想用 zustand 存储全局状态


interface EditorState {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
}))


export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);


  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      const updateMatches = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };
      media.addEventListener('change', updateMatches);
      return () => {
        media.removeEventListener('change', updateMatches);
      };
    }
  }, [query]);

  return matches;
}



export function useShowNavbar() {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [showNavbar, setShowNavbar] = useState(true);
  const isEditing = useEditorStore((state) => state.isEditing);
  useEffect(() => {
    // 如果是大屏幕，永远不显示导航栏
    if (isLargeScreen) {
      setShowNavbar(false);
    } 
    // 如果是小屏幕且编辑器激活，隐藏导航栏
    else if (isEditing) {
      setShowNavbar(false);
    }
    // 如果是小屏幕且编辑器未激活，显示导航栏
    else {
      setShowNavbar(true);
    }
  }, [isLargeScreen, isEditing]);

  return showNavbar;
}