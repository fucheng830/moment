'use client';

import React from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePage } from '@/context/PageContext';
import { Button } from "@/components/ui/button";
import { ArrowLeft, GalleryVerticalEnd } from 'lucide-react';

const CategorysPage: React.FC = () => {
  const {
    categorys,
    selectedCategoryId,
    handleSelectCategory,
  } = useNotesContext();

  const { goBack, navigateTo } = usePage();

  const handleBack = () => {
    goBack();
  };

  const handleCategoryClick = (categoryId: string) => {
    handleSelectCategory(categoryId);
    navigateTo('home');
  };

  return (
    <div className="flex w-full flex-col h-full select-none z-50">
      <div className="flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="rounded-sm hover:bg-muted hover:text-accent-foreground transition-all duration-200 select-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2 opacity-70" />
          <span className="opacity-70">返回</span>
        </Button>
      </div>
      <div className="flex flex-grow overflow-hidden py-6">
        <ScrollArea className="flex flex-grow px-4">
          <div className="grid grid-cols-2 gap-4">
            {categorys.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              
              return (
                <div 
                  key={category.id} 
                  className={`flex flex-col p-4 ${
                    isSelected ? 'bg-accent/50' : 'bg-background hover:bg-accent/50'
                  } select-none rounded-xl border transition-all duration-300 ease-out`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-semibold truncate ${
                      isSelected ? 'text-primary/70' : 'opacity-70'
                    }`}>
                      {category.name}
                    </h3>
                    <span className="text-sm text-muted-foreground flex items-center ml-2">
                      <GalleryVerticalEnd className="w-4 h-4 mr-1" />
                      {category.notes_stats.total_notes}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategorysPage;