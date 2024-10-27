// @/context/NotesContext.tsx
// 核心代码
// 所有笔记笔记数据有关的上下文


import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { Note, NoteAction, defaultRecall, NoteType } from '@/types/note_model';
import { Category, CategoryAction } from '@/types/category_model';
import LocalStorageManager, { StorageKey } from '@/storage/localStorageManager';
import { ContentService } from '@/services/content.service';
import { usePage } from '@/context/PageContext';

const contentService = new ContentService();


interface NotesContextType {
    categorys: Category[];  //store中所有的category列表
    selectedCategoryId: string | null;//当前选中的category
    notesMap: Map<string, Note>;//当前的笔记列表,未渲染和排序
    displayedNoteIds: string[];//当前渲染的笔记ID列表
    searchedNoteIds: string[];//当前搜索结果中的笔记ID列表
    isLoading: boolean;// 是否正在加载笔记
    readNoteIdList: string[];//在阅读的笔记列表
    mode: "focus" | "explore"; // 添加模式状态
    setMode: (mode: "focus" | "explore") => void; // 添加设置模式的方法
    setReadNoteIdList: React.Dispatch<React.SetStateAction<string[]>>;//设置阅读的笔记列表
    getAllNoteIds: () => string[];//获取所有的笔记ID列表
    createNewCategory: (categoryData: Partial<Category>) => Promise<string | null>;//创建新category
    handleSelectCategory: (category: string | null) => void;//设置当前选中的category
    addNotes: (categoryId: string, notesData: Partial<Note>[]) => Promise<Note[]>;//添加笔记到指定categoryId
    searchNotes: (searchTerm: string) => string[];//搜索笔记中的文本，返回符合搜索结果的笔记ID列表
    updateNotes: (updates: { [noteId: string]: Partial<Note> }) => Promise<Note[]>;
    handleNoteAction: (noteId: string, action: NoteAction, params?: any) => Promise<Note | Note[] | void>;//处理笔记的操作
    resetNotesContext: () => void;//清空笔记上下文
    getNoteById: (noteId: string) => Note | undefined;//根据笔记ID获取map中的笔记
    handleCategoryAction: (categoryId: string, action: CategoryAction) => Promise<void>;
    getCategoryById: (categoryId: string) => Promise<Category | undefined>;
}


const NotesContext = createContext<NotesContextType | undefined>(undefined);


export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { skipTo } = usePage();
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [notesMap, setNotesMap] = useState<Map<string, Note>>(new Map());
    const [displayedNoteIds, setDisplayedNoteIds] = useState<string[]>([]);
    const [searchedNoteIds, setSearchedNoteIds] = useState<string[]>([]);//当前搜索结果中的笔记ID列表
    const [isLoading, setIsLoading] = useState(true);
    const lastLoadedCategoryIdRef = useRef<string | null>(null);
    const [cancelAddingController, setCancelAddingController] = useState<AbortController | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [readNoteIdList, setReadNoteIdList] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [mode, setMode] = useState<"focus" | "explore">("focus"); // 添加模式状态


    //处理选择category,加载笔记列表

    const handleSelectCategory = useCallback(async (categoryId: string | null) => {
        console.log('加载category中', categoryId)
        setSelectedCategoryId(categoryId);
        if (categoryId) {
            setIsLoading(true);
            try {
                const filteredNotes = Array.from(notesMap.values()).filter(note => {
                    const categoryMatch = note.category_id === categoryId;
                    // 在专注模式下只显示 normal 类型的笔记
                    const typeMatch = mode === "focus" ? note.note_type === NoteType.NORMAL : true;
                    return categoryMatch && typeMatch;
                });
                const filteredNoteIds = filteredNotes.map(note => note.id);
                setDisplayedNoteIds(filteredNoteIds);
                lastLoadedCategoryIdRef.current = categoryId;
            } catch (error) {
                console.error('Error filtering notes for selected category:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            // 处理没有选中 category 的情况
            const allNotes = Array.from(notesMap.values()).filter(note => 
                mode === "focus" ? note.note_type === NoteType.NORMAL : true
            );
            setDisplayedNoteIds(allNotes.map(note => note.id));
        }
        if (categoryId) {
            LocalStorageManager.saveData(StorageKey.LAST_VIEWED_DECK_ID, categoryId);
        } else {
            LocalStorageManager.clearData(StorageKey.LAST_VIEWED_DECK_ID);
        }
    }, [notesMap, mode]); // 添加 mode 依赖

    const getAllNoteIds = useCallback(() => {
        return Array.from(notesMap.keys());
    }, [notesMap]);


    const initializeContext = async () => {
        setIsLoading(true);
        console.log('重新读取所有的本地数据')
        await verifyLocalContent(); // 等待本地数据加载完成
        await loadInitialCategory();
        setIsLoading(false);
    };


    const loadInitialCategory = useCallback(async () => {
        const fetchedCategorys = await contentService.getCategorys();
        console.log('当前的category列表', fetchedCategorys)
        const lastViewedCategoryId = LocalStorageManager.loadData<string>(StorageKey.LAST_VIEWED_DECK_ID);
        console.log('上一次访问的categoryID', lastViewedCategoryId)
        if (lastViewedCategoryId && fetchedCategorys.some(category => category.id === lastViewedCategoryId)) {
            setSelectedCategoryId(lastViewedCategoryId);
            handleSelectCategory(lastViewedCategoryId);
        } else {
            console.log('没有找到上一次访问的categoryID,尝试选取最新category')
            const latestCategory = fetchedCategorys.reduce((latest, current) => {
                return new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest;
            }, fetchedCategorys[0]);
            if (latestCategory) {
                console.log('最新category', latestCategory.id)
                setSelectedCategoryId(latestCategory.id);
                LocalStorageManager.saveData(StorageKey.LAST_VIEWED_DECK_ID, latestCategory.id);
                handleSelectCategory(latestCategory.id);
            }
        }
    }, [handleSelectCategory, contentService])


    //初始化，加载所有的数据
    useEffect(() => {
        initializeContext();
    }, []);


    //验证所有的categorys,以及该category的所有笔记
    const verifyLocalContent = async () => {
        try {
            setIsLoading(true);
            await contentService.loadAndVerifyContent();
            const fetchedCategorys = await contentService.getCategorys();
            const allNotes = await contentService.getNotes();
            const newMap = new Map(allNotes.map(note => [note.id, note]));
            setCategorys(fetchedCategorys);
            setNotesMap(newMap);
            console.log('加载本地数据完成', newMap.size)
            return { categorys: fetchedCategorys, notesMap: newMap };
        } catch (error) {
            console.error('Error verifying local content:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };


    // 更新category
    const updateCategory = useCallback(async (categoryId: string, updateData: Partial<Category>): Promise<Category> => {
        try {
            const updatedCategory = await contentService.updateCategory(categoryId, updateData);
            setCategorys(prevCategorys => prevCategorys.map(category =>
                category.id === categoryId ? { ...category, ...updateData } : category
            ));
            return updatedCategory;
        } catch (error) {
            throw error;
        }
    }, []);


    // 从服务层读取category
    const getCategoryById = useCallback(async (categoryId: string): Promise<Category | undefined> => {
        try {
            return await contentService.getCategory(categoryId);
        } catch (error) {
            return undefined;
        }
    }, []);


    //创建新category
    const createNewCategory = useCallback(async (categoryData: Partial<Category>): Promise<string | null> => {
        console.log('create category', categoryData);
        try {
            const newCategory = await contentService.createCategory(categoryData);
            setCategorys(prevCategorys => [...prevCategorys, newCategory]);
            return newCategory.id || null;
        } catch (error) {
            return null;
        }
    }, []);


    //处理category的操作
    const handleCategoryAction = useCallback(async (categoryId: string, action: CategoryAction) => {
        try {
            switch (action) {
                case 'delete':
                    await contentService.deleteCategory(categoryId);
                    const isCurrentCategory = (selectedCategoryId === categoryId);
                    setCategorys(prevCategorys => prevCategorys.filter(category => category.id !== categoryId));
                    // 更新 notesMap
                    setNotesMap(prevMap => {
                        const newMap = new Map(prevMap);
                        for (const [noteId, note] of newMap) {
                            if (note.category_id === categoryId) {
                                newMap.delete(noteId);
                            }
                        }
                        return newMap;
                    });
                    // 更新 displayedNoteIds
                    if (isCurrentCategory) {
                        setDisplayedNoteIds([]);
                        setSelectedCategoryId(null);
                    } else {
                        setDisplayedNoteIds(prevIds => prevIds.filter(id => notesMap.get(id)?.category_id !== categoryId));
                    }
            }
        } catch (error) {
        }
    }, [updateCategory, selectedCategoryId]);



    //搜索符合搜索结果的笔记ID列表
    const searchNotes = useCallback((searchTerm: string): string[] => {
        const lowercaseTerm = searchTerm.toLowerCase();
        const searchResults = Array.from(notesMap.values()).filter(note =>
            note.title?.toLowerCase().includes(lowercaseTerm) ||
            note.original_content?.toLowerCase().includes(lowercaseTerm)
        );
        const searchedIds = searchResults.map(note => note.id);
        setSearchedNoteIds(searchedIds);
        return searchedIds;
    }, [notesMap]);



    // 添加笔记并且维护category中的notes数量
    const addNotes = useCallback(async (categoryId: string, notesData: Partial<Note>[]) => {
        const controller = new AbortController(); // 创建新的 AbortController

        try {
            // 1. 处理笔记数据,设置为收藏状态
            const processedNotesData = notesData.map(noteData => ({
                ...noteData,
                starred: true
            }));

            // 2. 调用服务层添加笔记，添加必需的 signal 参数
            const { newNotes } = await contentService.addNotes(
                categoryId,
                processedNotesData,
                (progress: number) => {},
                controller.signal  // 添加必需的signal参数
            );

            // 3. 更新 notesMap
            setNotesMap(prevMap => {
                const newMap = new Map(prevMap);
                newNotes.forEach(note => {
                    newMap.set(note.id, note);
                });
                return newMap;
            });

            // 4. 如果当前选中的 category 和添加笔记的 category 相同,则更新显示的笔记列表
            if (selectedCategoryId === categoryId) {
                setDisplayedNoteIds(prevIds => [...newNotes.map(note => note.id), ...prevIds]);
            }
            return newNotes;
        } catch (error) {
            console.error('Error adding notes:', error);
            throw error;
        } finally {
        }
    }, [contentService, selectedCategoryId]);



    const notesMapRef = useRef(notesMap);
    useEffect(() => {
        notesMapRef.current = notesMap;
    }, [notesMap]);


    // 更新笔记
    const updateNotes = useCallback(async (updates: { [noteId: string]: Partial<Note> }) => {
        try {
            // 1. 调用服务层方法更新笔记
            const updatedNotes = await contentService.updateNotes(updates);

            // 2. 更新 notesMap
            setNotesMap(prevMap => {
                const newMap = new Map(prevMap);
                updatedNotes.forEach(note => {
                    newMap.set(note.id, note);
                });
                return newMap;
            });

            return updatedNotes;
        } catch (error) {
            console.error('Error updating notes:', error);
            throw error;
        }
    }, [contentService]);


    // 取消添加笔记
    const cancelAdding = useCallback(() => {
        if (cancelAddingController) {
            cancelAddingController.abort();
            setCancelAddingController(null);
        }
    }, []);


    // 根据笔记ID获取map中的笔记
    const getNoteById = useCallback((noteId: string) => {
        return notesMap.get(noteId);
    }, [notesMap]);


    // 删除笔记,从map和ids中删除笔记, 并重新获取所有受影响的笔记
    const deleteNote = useCallback(async (noteId: string) => {
        try {
            const noteToDelete = notesMap.get(noteId);
            if (!noteToDelete) {
                throw new Error('Note not found');
            }

            // 1. 调用服务层删除笔记
            await contentService.deleteNote(noteId);

            // 2. 从notesMap中移除笔记
            setNotesMap(prevMap => {
                const newMap = new Map(prevMap);
                newMap.delete(noteId);
                return newMap;
            });

            // 3. 从显示列表中移除笔记
            setDisplayedNoteIds(prevIds => prevIds.filter(id => id !== noteId));

        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }, [notesMap]);

    // 处理笔记的操作
    const handleNoteAction = useCallback(async (noteId: string, action: NoteAction, params?: any) => {
        if (!noteId) {
            throw new Error('Missing noteId for action');
        }
        const note = notesMap.get(noteId);
        if (!note) {
            throw new Error('Note not found');
        }
        try {
            switch (action) {
                case 'copyToClipboard':
                    if (note.original_content) {
                        await navigator.clipboard.writeText(note.original_content);
                    }
                    break;
                case 'delete':
                    await deleteNote(noteId);
                    if (note.category_id) {
                        const updatedCategory = await contentService.getCategory(note.category_id);
                        if (updatedCategory) {
                            setCategorys(prevCategorys => prevCategorys.map(category => category.id === note.category_id ? updatedCategory : category));
                        }
                    }
                    break;
                case 'info':
                    console.log('Note info:', note);
                    break;
                case 'read':
                    const noteIndex = displayedNoteIds.indexOf(noteId);
                    console.log('noteIndex', noteIndex, noteId);
                    if (noteIndex !== -1) {
                        const newReadQueue = [
                            noteId,
                            ...displayedNoteIds.slice(0, noteIndex),
                            ...displayedNoteIds.slice(noteIndex + 1)
                        ];
                        setReadNoteIdList(newReadQueue);
                        skipTo('queue-read');
                    }
                    break;
                case 'favorite':
                case 'unfavorite':
                    await updateNotes({ [noteId]: { starred: action === 'favorite' } });
                    break;
                case 'clearHistory':
                    await updateNotes({ [noteId]: { recall: defaultRecall() } });
                    return notesMap.get(noteId);
                default:
                    console.warn(`Unhandled note action: ${action}`);
            }
        } catch (error) {
            console.error(`Error performing ${action} on note:`, error);
            throw error;
        }
    }, [notesMap, deleteNote, updateNotes, skipTo, displayedNoteIds]);



    // 清空笔记上下文
    const resetNotesContext = useCallback(() => {
        setDisplayedNoteIds([]);
        setCategorys([]);
        setSelectedCategoryId(null);
        setIsLoading(false);
    }, []);


    const value = {
        categorys,
        notesMap,
        displayedNoteIds,
        searchedNoteIds,
        selectedCategoryId,
        isLoading,
        isDetailOpen,
        readNoteIdList,
        mode,
        setMode,
        getAllNoteIds,
        setReadNoteIdList,
        searchNotes,
        cancelAdding,
        addNotes,
        updateNotes,
        resetNotesContext,
        handleNoteAction,
        handleSelectCategory,
        getNoteById,
        createNewCategory,
        handleCategoryAction,
        getCategoryById,
    };

    return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (context === undefined) {
        throw new Error('useNotesContext must be used within a NotesProvider');
    }
    return context;
};