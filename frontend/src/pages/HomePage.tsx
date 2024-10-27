import React from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { usePage } from '@/context/PageContext';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FocusMode from './FocusMode';
import ExploreMode from './ExploreMode';

function HomePage() {
  const { mode, setMode } = useNotesContext();
  const { navigateTo } = usePage();

  console.log('主页加载中',mode);
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div className='flex-1'></div>

        <div className="flex justify-center flex-[3]">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "focus" | "explore")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="focus">专注模式</TabsTrigger>
              <TabsTrigger value="explore">探索模式</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex-1 flex justify-end'>
          <Button
            variant="ghost"
            onClick={() => navigateTo('review')}
            className="flex items-center gap-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      {mode === "focus" ? <FocusMode /> : <ExploreMode />}
    </div>
  );
}

export default HomePage;