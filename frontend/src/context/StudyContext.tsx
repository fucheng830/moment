"use client";

import FSRS from '@/lib/fsrs';
import { NoteRepository } from '@/repo/NoteRepository';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Note, CardRating, defaultRecall } from '@/types/note_model';
import { useNotesContext } from '@/context/NotesContext';

interface StudyContextType {
  activeQueue: Note[];
  isLoading: boolean;
  refreshReviewQueue: () => Promise<void>;
  handleNoteRating: (note: Note, rating: CardRating) => Promise<void>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateNotes } = useNotesContext();
  const [activeQueue, setActiveQueue] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const noteRepo = new NoteRepository();

  // 刷新复习队列
  const refreshReviewQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      const { reviewNotes } = await noteRepo.getFocusedQueue();
      setActiveQueue(reviewNotes);
    } catch (error) {
      console.error('Error refreshing review queue:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 处理笔记评分
  const handleNoteRating = useCallback(async (note: Note, rating: CardRating) => {
    const currentRecall = note.recall || defaultRecall();
    const updatedRecall = FSRS.evaluate(currentRecall, rating);
    const updatedNote = {
      ...note,
      recall: updatedRecall
    };
    try {
      await updateNotes({ [updatedNote.id]: updatedNote });
      // 从队列中移除或重新排序笔记
      setActiveQueue(prevQueue => {
        if (rating >= CardRating.GOOD) {
          return prevQueue.filter(n => n.id !== note.id);
        } else {
          const newQueue = prevQueue.filter(n => n.id !== note.id);
          const newIndex = Math.min(3, newQueue.length);
          newQueue.splice(newIndex, 0, updatedNote);
          return newQueue;
        }
      });
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  }, [updateNotes]);

  const value = {
    activeQueue,
    isLoading,
    refreshReviewQueue,
    handleNoteRating,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};