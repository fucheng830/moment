// @/repo/NoteRepository.tsx
// 负责处理笔记相关的数据库操作

"use client";

import { localDatabase } from '@/storage/indexedDB';
import { Note, CardState, createDefaultNote,NoteType } from '@/types/note_model';
import { Category, CategoryPriority } from '@/types/category_model';


export class NoteRepository {


    //创建笔记
    async createNote(noteData: Partial<Note>, categoryId?: string): Promise<{ created_note_id: string, category_id: string }> {
        const newNote = createDefaultNote(categoryId, noteData);
        const id = await localDatabase.create('localNotes', newNote);
        return { created_note_id: id, category_id: categoryId || '' };
    }


    //创建多条笔记
    async createNotes(notesData: Partial<Note>[], categoryId?: string): Promise<{ created_note_ids: string[], category_id: string }> {
        const newNotes = notesData.map(noteData => createDefaultNote(categoryId, noteData));
        const created_note_ids = await localDatabase.createBulk('localNotes', newNotes);
        return { created_note_ids, category_id: categoryId || '' };
    }


    //删除笔记
    async deleteNote(noteId: string): Promise<void> {
        await localDatabase.delete('localNotes', noteId);
    }


    //获取所有笔记
    async listNotes(): Promise<Note[]> {
        return localDatabase.readAll('localNotes');
    }


    //获取所有可学习的笔记
    async getAllLearningNotes(): Promise<Note[]> {
        const allNotes = await this.listNotes();
        const now = new Date();
        return allNotes.filter(note =>
            (note.html_text?.trim() !== '') &&  // 只要求内容不为空或有图片
            (
                (note.recall.state === CardState.NEW) || //所有新笔记
                (note.recall.state === CardState.LEARNING) || //所有学习和重学的笔记
                (note.recall.state === CardState.RELEARNING) ||
                (note.recall.state === CardState.REVIEW &&  // 所有复习到期的笔记
                    note.recall.due &&
                    new Date(note.recall.due) <= now)
            )
        )
    }


    //获取学习笔记,按照category的优先级排序,筛选掉normal类型的笔记
    async sortLearningNotes(notes: Note[]): Promise<{ newNotes: Note[], reviewNotes: Note[] }> {
        if (!notes || notes.length === 0) {
            return { newNotes: [], reviewNotes: [] };
        }
    
        try {
            // 首先过滤掉 NORMAL 类型的笔记
            const learningEnabledNotes = notes.filter(note => 
                note.note_type === NoteType.FLASHCARD || 
                note.note_type === NoteType.SYNTAX
            );
    
            if (learningEnabledNotes.length === 0) {
                return { newNotes: [], reviewNotes: [] };
            }
    
            // 获取所有category并建立优先级映射
            const categorys = await localDatabase.readAll('localCategorys') as Category[];
            const categoryPriorities = new Map(categorys.map(category => [category.id, category.priority]));
    
            // 优先级排序函数
            const sortByPriority = (a: Note, b: Note) => {
                const priorityA = categoryPriorities.get(a.category_id ?? '') ?? CategoryPriority.Gray;
                const priorityB = categoryPriorities.get(b.category_id ?? '') ?? CategoryPriority.Gray;
                return priorityB - priorityA;
            };
    
            // 分离新笔记和复习笔记
            const newNotes = learningEnabledNotes.filter(note => note.recall.state === CardState.NEW);
            const reviewNotes = learningEnabledNotes.filter(note => 
                note.recall.state === CardState.LEARNING ||
                note.recall.state === CardState.RELEARNING ||
                note.recall.state === CardState.REVIEW
            );
    
            // 对新笔记进行排序：先按优先级，再按创建时间
            newNotes.sort((a, b) => {
                const priorityComparison = sortByPriority(a, b);
                if (priorityComparison !== 0) return priorityComparison;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
    
            // 对复习笔记进行更细致的排序
            reviewNotes.sort((a, b) => {
                // 首先按category优先级排序
                const priorityComparison = sortByPriority(a, b);
                if (priorityComparison !== 0) return priorityComparison;
    
                // 然后按照状态优先级排序
                const getStateOrder = (state: CardState) => {
                    switch (state) {
                        case CardState.LEARNING: return 0;
                        case CardState.RELEARNING: return 1;
                        case CardState.REVIEW: return 2;
                        default: return 3;
                    }
                };
    
                const stateOrderA = getStateOrder(a.recall.state);
                const stateOrderB = getStateOrder(b.recall.state);
                if (stateOrderA !== stateOrderB) return stateOrderA - stateOrderB;
    
                // 学习/重学状态按schedule时间排序
                if (a.recall.state === CardState.LEARNING || a.recall.state === CardState.RELEARNING) {
                    if (!a.recall.schedule || !b.recall.schedule) return 0;
                    return new Date(a.recall.schedule).getTime() - new Date(b.recall.schedule).getTime();
                }
    
                // 复习状态按due时间排序
                if (a.recall.state === CardState.REVIEW) {
                    if (!a.recall.due || !b.recall.due) return 0;
                    return new Date(a.recall.due).getTime() - new Date(b.recall.due).getTime();
                }
    
                return 0;
            });
    
            return { newNotes, reviewNotes };
        } catch (error) {
            console.error('Error sorting learning notes:', error);
            return { newNotes: [], reviewNotes: [] };
        }
    }


    //获取学习队列,优先从关注的category中获取学习队列
    async getFocusedQueue(maxNotesPerList: number = 10000): Promise<{ reviewNotes: Note[], newNotes: Note[] }> {
        const allLearningNotes = await this.getAllLearningNotes();
        const { newNotes, reviewNotes } = await this.sortLearningNotes(allLearningNotes);
        return {
            reviewNotes: reviewNotes.slice(0, maxNotesPerList),
            newNotes: newNotes.slice(0, maxNotesPerList)
        };
    }


    //获取指定category的笔记
    async getNotesFromCategory(categoryId: string): Promise<Note[]> {
        const allNotes = await this.listNotes();
        return allNotes
            .filter(note => note.category_id === categoryId)
            .sort((a, b) => {
                if (a.recall?.state === CardState.REVIEW && b.recall?.state === CardState.REVIEW) {
                    return (new Date(a.recall.due || 0)).getTime() - (new Date(b.recall.due || 0)).getTime();
                }
                if (a.recall?.state === CardState.NEW && b.recall?.state === CardState.NEW) {
                    return (new Date(b.created_at || 0)).getTime() - (new Date(a.created_at || 0)).getTime();
                }
                return (a.recall?.state === CardState.REVIEW) ? -1 : 1;
            });
    }


    //获取待复习笔记
    async getDueNotes(): Promise<Note[]> {
        const allNotes = await this.listNotes();
        const now = new Date();
        return allNotes.filter(note => {
            if (!note.recall || !note.recall.due) return false;
            const dueDate = new Date(note.recall.due);
            return dueDate <= now && note.recall.state === CardState.REVIEW;
        });
    }


    //获取单条笔记
    async getNote(noteId: string): Promise<Note | undefined> {
        return localDatabase.read('localNotes', noteId);
    }


    //更新笔记
    async updateNote(noteId: string, noteUpdate: Partial<Note>): Promise<Note> {
        const existingNote = await this.getNote(noteId);
        if (!existingNote) {
            throw new Error('Note not found');
        }
        const updatedNote = { ...existingNote, ...noteUpdate };
        await localDatabase.update('localNotes', noteId, updatedNote);
        return updatedNote;
    }


    //批量更新笔记学习队列
    async updateNotesBatch(notes: Note[]): Promise<boolean> {
        if (!notes || notes.length === 0) {
            return true;
        }
        try {
            await localDatabase.updateBulk('localNotes', notes);
            return true;
        } catch (error) {
            console.error('Failed to update notes batch:', error);
            return false;
        }
    }


}