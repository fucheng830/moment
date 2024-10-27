// @/App.tsx


import '@/styles/globals.css';
import '@/styles/animation.css';
import '@/styles/note.css';
import '@/styles/code-highlight.css';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingProvider } from '@/context/SettingContext';
import { NotesProvider } from '@/context/NotesContext';
import { StudyProvider } from '@/context/StudyContext';
import { PageProvider } from '@/context/PageContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from '@/components/bar/NavBar';
import { PageContent } from "@/PageContent";

// Ionic React setup
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

function App() {

  return (
    <ThemeProvider>
      <PageProvider>
        <SettingProvider>
          <NotesProvider>
            <StudyProvider>
                <TooltipProvider>
                  <div className="flex w-full min-h-screen overflow-hidden" tabIndex={-1}>
                    <main className="flex-grow h-full overflow-hidden" tabIndex={-1}>
                      <div className="h-full flex justify-center" tabIndex={-1}>
                        <NavBar />
                        <div className='w-full flex-col overflow-auto justify-between min-h-screen max-w-4xl mx-auto' tabIndex={-1}>
                          <PageContent />
                        </div>
                      </div>
                    </main>
                  </div>
                  <Toaster />
                </TooltipProvider>
            </StudyProvider>
          </NotesProvider>
        </SettingProvider>
      </PageProvider >
    </ThemeProvider >
  );
}

// 注册了复制代码的事件
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('copy-button')) {
    const index = target.getAttribute('data-code-index');
    const codeBlock = document.querySelectorAll('pre')[Number(index)];
    if (codeBlock) {
      const code = codeBlock.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        target.textContent = 'Copied!';
        setTimeout(() => {
          target.textContent = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }
});

export default App;