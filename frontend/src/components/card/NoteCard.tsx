// @/components/card/NoteCard.tsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NoteAction, Note } from "@/types/note_model";
import { useNotesContext } from '@/context/NotesContext';
import { usePage } from '@/context/PageContext';
import { renderNote } from '@/lib/render';
import {
  Star, Clock, Circle, Flag, MoreHorizontal, Trash2,
  Copy, RotateCcw, Edit, Info, BookOpen, ArrowUpRight, CalendarPlus, CalendarClock, AlarmClock
} from 'lucide-react';
import NoteEditDialog from '@/components/dialog/NoteEditDialog';
import ImageDetailDialog from '@/components/dialog/ImageDetailDialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {

  const { skipTo } = usePage()
  const { setReadNoteIdList } = useNotesContext();
  const { handleNoteAction, updateNotes, } = useNotesContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [content, setContent] = useState<string>('');
  const [isContentTruncated, setIsContentTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 使用 skipTo 跳转到阅读页面
  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReadNoteIdList([note.id]);
    skipTo('queue-read');
  };

  //监听内容变化，判断是否需要显示“阅读全文”按钮
  useEffect(() => {
    if (contentRef.current) {
      setIsContentTruncated(contentRef.current.scrollHeight > 500);
    }
  }, [content]);


  const handleAction = (action: NoteAction) => {
    handleNoteAction(note.id, action);
  };

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedNote: Note) => {
    await updateNotes({ [note.id]: updatedNote });
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };


  // 编辑状态下返回编辑器
  if (isEditing || isDialogOpen) {
    return (
      <NoteEditDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        note={note}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }


  if (!note) {
    return null;
  }


  return (
    <div className="note-card flex flex-col rounded-md w-full bg-card overflow-hidden border">

      {/* 笔记内容区域 */}
      <div className="flex-grow flex flex-col px-4 pt-4">
        <div
          className="note-card overflow-hidden whitespace-pre-line break-words break-all flex flex-col "
          dangerouslySetInnerHTML={{
            __html: renderNote(note, {
              enableHighlight: true
            })
          }}
        />
        {isContentTruncated && (
          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 text-center pt-16">
              <span
                className="opacity-50 text-xs cursor-pointer hover:text-primary transition-colors duration-200 flex items-center justify-center select-none"
                onClick={handleReadMore}
              >
                查看详情
                <ArrowUpRight className="m-1 w-4 h-4" />
              </span>
            </div>
          </div>
        )}
      </div>


      {/* 笔记插图区域 */}
      {note.images && note.images.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex space-x-2">
            {note.images.slice(0, 2).map((image, index) => (
              <div
                key={`image-${index}`}
                className="flex w-16 h-16 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                  setIsImageDialogOpen(true);
                }}
              >
                <img
                  src={image}
                  alt={`Note image ${index + 1}`}
                  className="w-full h-full rounded group-hover:border-primary"
                />
              </div>
            ))}
            {note.images.length > 2 && (
              <div
                key="more-images"
                className="flex-shrink-0 w-16 h-16 bg-secondary flex flex-col items-center justify-center rounded text-secondary-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(2);
                  setIsImageDialogOpen(true);
                }}
              >
                <span className="text-lg font-semibold">+{note.images.length - 2}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部信息区域 */}
      <div className="flex pl-4 pr-2 pb-2 mt-0 w-full justify-between items-center">
        <div className="flex items-center space-x-2 text-muted-foreground/50">
          <span className="text-xs font-['Roboto_Mono'] select-none">
            {note.updated_at}
          </span>
        </div>

        {/* 右侧按钮区域 */}
        <div className="flex flex-col justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={cn(
                "w-5 h-5 p-0 rounded-sm opacity-50 transition-all duration-200",
                "cursor-pointer hover:opacity-70",
              )}>
                <MoreHorizontal className="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="animate-in fade-in-80 slide-in-from-top-1 rounded-sm overflow-hidden"
            >
              <DropdownMenuItem
                onClick={() => handleEdit()}
                className="transition-colors duration-200 rounded-sm opacity-70"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>编辑</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleAction('read')}
                className="transition-colors duration-200 rounded-sm opacity-70"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span>阅读</span>
              </DropdownMenuItem>
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleAction('info')}
                  className="transition-colors duration-200 rounded-sm opacity-70"
                >
                  <Info className="h-4 w-4 mr-2" />
                  <span>信息</span>
                </DropdownMenuItem>
              </>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAction('copyToClipboard')}
                className="transition-colors duration-200 rounded-sm opacity-70"
              >
                <Copy className="h-4 w-4 mr-2" />
                <span>复制到剪贴板</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction('clearHistory')}
                className="transition-colors duration-200 rounded-sm opacity-70"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                <span>清除历史</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAction('delete')}
                className="transition-colors duration-200 rounded-sm opacity-70"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>删除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ImageDetailDialog
        isOpen={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        images={note.images}
        initialIndex={selectedImageIndex}
      />
    </div >
  );
};

export default NoteCard;