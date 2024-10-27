// @/paegs/Readpage.tsx\
// 笔记的详情页


import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Note } from '@/types/note_model'
import { usePage } from '@/context/PageContext'
import { useNotesContext } from '@/context/NotesContext'
import { ArrowRight, Star, Check, ArrowLeft } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area";
import { renderNote } from '@/lib/render'


const ReadPage: React.FC = () => {
  const { goBack } = usePage()
  const { getNoteById, handleNoteAction, readNoteIdList, updateNotes } = useNotesContext()
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const studyTimeRef = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const currentNoteId = readNoteIdList[currentNoteIndex]
  const currentCard = currentNoteId ? getNoteById(currentNoteId) : undefined
  const [isLastCard, setIsLastCard] = useState(false)
  const [direction, setDirection] = useState(0)




  useEffect(() => {
    setIsLastCard(currentNoteIndex === readNoteIdList.length - 1)
  }, [currentNoteIndex, readNoteIdList.length])

  useEffect(() => {
    if (currentCard) {
      startTimeRef.current = Date.now()
      studyTimeRef.current = 0
      timerRef.current = setInterval(() => {
        studyTimeRef.current = (Date.now() - startTimeRef.current) / 1000
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentCard])

  const handleNoteRead = useCallback(async (note: Note) => {
    const now = new Date().toString();
    const updatedRecall = {
      ...note.recall,
      last_read_at: now
    };
    await updateNotes({ [note.id]: { recall: updatedRecall } });
  }, [updateNotes]);

  const nextNote = useCallback(() => {
    setCurrentNoteIndex(prevIndex => Math.min(prevIndex + 1, readNoteIdList.length - 1))
  }, [readNoteIdList.length])

  const previousNote = useCallback(() => {
    setCurrentNoteIndex(prevIndex => Math.max(prevIndex - 1, 0))
  }, [])


  const handleNext = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (currentCard) {
      try {
        await handleNoteRead(currentCard);
      } catch (error) {
        console.error('Failed to update note schedule:', error)
      }
    }
    if (isLastCard) {
      console.log('返回上一页')
      goBack()
    } else {
      setDirection(1)
      nextNote()
    }
  }, [nextNote, currentCard, handleNoteRead, isLastCard, goBack])


  const handlePrevious = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setDirection(-1)
    previousNote()
  }, [previousNote])


  const toggleFavorite = useCallback(async () => {
    if (currentCard) {
      try {
        await handleNoteAction(currentCard.id, currentCard.starred ? 'unfavorite' : 'favorite')
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }
  }, [currentCard, handleNoteAction])




  if (!currentCard) {
    return <div className="h-full w-full flex items-center justify-center">没有内容了~</div>
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 overflow-hidde flex-col">
      {/* 工具条区域 */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 w-full border-b bg-secondary" tabIndex={-1}>
        <button
          onClick={goBack}
          className="bg-transparent border-none cursor-pointer p-2"
        >
          <ArrowLeft className="h-4 w-4 text-foreground/70" />
        </button>
        <span className="text-sm text-muted-foreground select-none opacity-70">
          {currentNoteIndex + 1} / {readNoteIdList.length}
        </span>
        <button
          onClick={toggleFavorite}
          className="bg-transparent border-none cursor-pointer p-2"
        >
          <Star
            className={`h-4 w-4 ${currentCard.starred
              ? 'fill-primary text-primary'
              : 'text-foreground/70 stroke-[1.5px] fill-none'
              }`}
          />
        </button>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden w-full">
        <ScrollArea className="flex-grow">
          <div className='flex flex-col min-h-full'>
            <div className='flex-grow flex flex-col max-w-xl mx-auto px-6 py-4 w-full'>
              <div className="note-reader flex-grow"
                dangerouslySetInnerHTML={{
                  __html: renderNote(currentCard, {
                    showTags: false,
                    enableHighlight: true // 如果需要代码高亮
                  })
                }}
              />
            </div>


            {/* 按钮区域 */}
            <div className="flex px-4 pb-6 bg-background mt-auto justify-center select-none">
              <div className="button-area flex justify-center gap-4 w-full max-w-3xl mx-auto">
                {/* 向左按钮 */}
                {(!(currentNoteIndex === 0) &&
                  <button
                    onClick={handlePrevious}
                    className="px-6 h-10 rounded-full flex items-center justify-center bg-transparent text-foreground 
                    border border-text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4 flex-shrink-0 mx-2" />
                  </button>
                )}

                {/* 向右按钮 */}
                <button
                  onClick={handleNext}
                  className="px-6 h-10 rounded-full flex items-center justify-center bg-transparent text-foreground 
                  border border-text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  tabIndex={-1}
                >
                  {isLastCard ? (
                    <Check className="h-4 w-4 flex-shrink-0 mx-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 flex-shrink-0 mx-2" />
                  )}
                </button>
              </div>
            </div>


          </div>
        </ScrollArea>
      </div >
    </div >
  )
}
export default ReadPage