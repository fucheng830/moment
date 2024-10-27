// @/components/dialog/NoteEditDialog.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Note } from "@/types/note_model"; 
import { useMediaQuery, useEditorStore } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import TextareaAutosize from 'react-textarea-autosize';

// 简单的HTML转Text函数
const convertHtmlToText = (html: string) => {
 // 创建一个临时div
 const temp = document.createElement('div');
 temp.innerHTML = html;
 // 获取纯文本内容
 return temp.textContent || temp.innerText || '';
};

interface NoteEditDialogProps {
 note: Note;
 isOpen: boolean;
 onOpenChange: (open: boolean) => void;
 onSave: (note: Note) => Promise<void>;
 onCancel: () => void;
}

const NoteEditDialog: React.FC<NoteEditDialogProps> = ({
 isOpen,
 note,
 onSave,
 onCancel,
 onOpenChange,
}) => {
 const isMobile = useMediaQuery('(max-width: 768px)');
 const setIsEditing = useEditorStore((state) => state.setIsEditing);
 const textareaRef = useRef<HTMLTextAreaElement>(null);
 const [title, setTitle] = useState(note.title || '');
 const [content, setContent] = useState('');

 // 初始化编辑器状态
 useEffect(() => {
   if (isOpen) {
     setIsEditing(true);
     setTitle(note.title || '');
     setContent(convertHtmlToText(note.html_text || ''));

     // 自动聚焦
     const rafId = requestAnimationFrame(() => {
       if (textareaRef.current) {
         textareaRef.current.focus();
         const length = textareaRef.current.value.length;
         textareaRef.current.setSelectionRange(length, length);
       }
     });
     return () => cancelAnimationFrame(rafId);
   }
   return () => {
     setIsEditing(false);
   };
 }, [isOpen, setIsEditing, note]);

 // 清空编辑器
 const resetEditorState = useCallback(() => {
   setTitle('');
   setContent('');
 }, []);

 const handleCancel = useCallback(() => {
   resetEditorState();
   onCancel();
   onOpenChange(false);
 }, [resetEditorState, onCancel, onOpenChange]);

 const handleSave = useCallback(async () => {
   const updatedNote = {
     ...note,
     title,
     content: content,
   };

   await onSave(updatedNote);
   resetEditorState();
   onOpenChange(false);
 }, [note, content, title, onSave, resetEditorState, onOpenChange]);

 const handleOpenChange = (open: boolean) => {
   if (!open) {
     onCancel();
   }
   onOpenChange(open);
 };

 return (
   <Dialog open={isOpen} onOpenChange={handleOpenChange}>
     <DialogContent className={cn(
       "flex flex-col bg-card m-0 rounded-xl max-h-[80vh] p-2 gap-0",
       "!duration-0 !transition-none",
       isMobile ? "w-[90%] mx-auto" : "max-w-3xl",
     )}>
       <div className="flex flex-col h-full w-full">
         {/* 标题区域 */}
         <div className="flex-none w-full pb-1">
           <div className='items-center align-middle flex px-2 w-full mt-2'>
             <input
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full text-base font-medium bg-transparent outline-none placeholder:text-muted-foreground/70"
               placeholder="输入标题"
               spellCheck="false"
               type="text"
             />
           </div>
         </div>

         {/* 编辑区域 */}
         <div className="flex-1 min-h-0 select-none" onKeyDown={(e) => e.stopPropagation()}>
           <div className="h-full max-h-[50vh] overflow-auto
                         scrollbar-thin scrollbar-thumb-rounded-md
                         scrollbar-track-transparent
                         scrollbar-thumb-muted-foreground/20 
                         hover:scrollbar-thumb-muted-foreground/40
                         dark:scrollbar-thumb-muted-foreground/10
                         dark:hover:scrollbar-thumb-muted-foreground/20"
             tabIndex={-1}
           >
             <div className="px-2">
               <TextareaAutosize
                 ref={textareaRef}
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 className="w-full text-sm leading-relaxed bg-transparent outline-none resize-none placeholder:text-muted-foreground/70"
                 placeholder="输入内容"
                 spellCheck="false"
                 minRows={3}
               />
             </div>
           </div>
         </div>

         {/* 底部工具栏 */}
         <div className="flex-none w-full">
           <div className="flex items-center pr-2 space-x-1">
             <Button variant="ghost" size="sm" onClick={handleCancel} className="p-1 opacity-70 px-3">
               取消
             </Button>
             <Button variant="ghost" size="sm" onClick={handleSave} className="p-1 opacity-70 px-3">
               保存
             </Button>
           </div>
         </div>
       </div>
     </DialogContent>
   </Dialog>
 );
};

export default NoteEditDialog;