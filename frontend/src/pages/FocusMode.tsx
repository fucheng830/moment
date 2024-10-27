import React, { useState, useCallback, useEffect } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { usePage } from '@/context/PageContext';
import { X, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { NormalCard } from '@/components/card/NormalCard';

function FocusMode() {
  const { 
    notesMap, 
    getNoteById, 
    handleNoteAction,
    selectedCategoryId 
  } = useNotesContext();
  const { navigateTo } = usePage();
  const [cardHistory, setCardHistory] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [categoryNoteIds, setCategoryNoteIds] = useState<string[]>([]);

  // 获取当前分类下的所有笔记
  useEffect(() => {
    if (!selectedCategoryId) {
      navigateTo('category');
      return;
    }

    // 只过滤当前分类的笔记
    const filtered = Array.from(notesMap.values())
      .filter(note => note.category_id === selectedCategoryId)
      .map(note => note.id);

    setCategoryNoteIds(filtered);
    
    // 如果有笔记，设置第一个作为当前笔记
    if (filtered.length > 0 && !currentNoteId) {
      setCurrentNoteId(filtered[0]);
    } else if (filtered.length === 0) {
      navigateTo('category');
    }
  }, [selectedCategoryId, notesMap]);

  const handleButtonAction = useCallback(async (action: 'skip' | 'favorite') => {
    if (!currentNoteId) return;

    if (action === 'favorite') {
      setIsLiked(true);
      setTimeout(() => setIsLiked(false), 1000);
      await handleNoteAction(currentNoteId, 'favorite');
    }

    setCardHistory(prev => [...prev, currentNoteId]);
    
    // 在当前分类的笔记中找下一个
    const currentIndex = categoryNoteIds.indexOf(currentNoteId);
    const nextId = categoryNoteIds[(currentIndex + 1) % categoryNoteIds.length];

    if (nextId) {
      setCurrentNoteId(nextId);
    } else {
      navigateTo('category');
    }
  }, [currentNoteId, categoryNoteIds, handleNoteAction, navigateTo]);

  const currentNote = currentNoteId ? getNoteById(currentNoteId) : null;

  if (!currentNote) return null;

  return (
    <>
      <ScrollArea className="flex-1 p-4 flex-grow">
        <div className="aspect-video w-full h-full">
          <NormalCard note={currentNote} />
        </div>
      </ScrollArea>

      <div className="flex justify-center gap-8 pb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 md:w-16 md:h-16"
          onClick={() => handleButtonAction('skip')}
        >
          <X className="w-6 h-6 md:w-8 md:h-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 md:w-16 md:h-16"
          onClick={() => handleButtonAction('favorite')}
        >
          <Heart 
            className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${
              isLiked ? 'text-red-500 scale-125' : ''
            }`}
          />
        </Button>
      </div>
    </>
  );
}

export default FocusMode;