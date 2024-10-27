'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { Note, createDefaultNote } from "@/types/note_model";
import Masonry from 'react-masonry-css';
import NoteCard from '@/components/card/NoteCard';
import { Spinner } from "@/components/ui/spinner";
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import NoteEditDialog from '@/components/dialog/NoteEditDialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INITIAL_LOAD_COUNT = 48;
const LOAD_MORE_COUNT = 24;

type TabValue = "all" | "learned" | "starred";

interface BreakpointCols {
    default: number;
    [key: number]: number;
}

function ReviewPage() {
    const { getAllNoteIds, getNoteById, isLoading, addNotes, selectedCategoryId, handleSelectCategory } = useNotesContext();
    const [loadedNotes, setLoadedNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<Note>(createDefaultNote(selectedCategoryId || ''));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<TabValue>("all");
    const invisibleFocusRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const currentOffsetRef = useRef(0);

    // Get filtered note IDs based on selected tab
    const filteredNoteIds = useMemo(() => {
        const allIds = getAllNoteIds();
        return allIds.filter(id => {
            const note = getNoteById(id);
            if (!note) return false;

            switch (selectedTab) {
                case "learned":
                    return note.recall.reps > 0;
                case "starred":
                    return note.starred === true;
                default:
                    return true;
            }
        });
    }, [getAllNoteIds, getNoteById, selectedTab]);

    // Reset and load initial notes when tab changes
    useEffect(() => {
        currentOffsetRef.current = 0;
        if (filteredNoteIds.length > 0) {
            const initialNotes = filteredNoteIds
                .slice(0, INITIAL_LOAD_COUNT)
                .map(id => getNoteById(id))
                .filter(Boolean) as Note[];
            setLoadedNotes(initialNotes);
            currentOffsetRef.current = initialNotes.length;
            setHasMore(currentOffsetRef.current < filteredNoteIds.length);
        } else {
            setLoadedNotes([]);
            setHasMore(false);
        }
    }, [filteredNoteIds, getNoteById]);

    useEffect(() => {
        if (selectedCategoryId) {
            handleSelectCategory(selectedCategoryId);
        }
    }, [selectedCategoryId, handleSelectCategory]);

    const loadMoreNotes = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            const nextBatch = filteredNoteIds
                .slice(currentOffsetRef.current, currentOffsetRef.current + LOAD_MORE_COUNT)
                .map(id => getNoteById(id))
                .filter(Boolean) as Note[];

            setLoadedNotes(prev => [...prev, ...nextBatch]);
            currentOffsetRef.current += nextBatch.length;
            setHasMore(currentOffsetRef.current < filteredNoteIds.length);
        } finally {
            setIsLoadingMore(false);
        }
    }, [filteredNoteIds, getNoteById, isLoadingMore, hasMore]);

    const handleScrollEndReached = useCallback(() => {
        if (hasMore) {
            loadMoreNotes();
        }
    }, [loadMoreNotes, hasMore]);

    const breakpointCols: BreakpointCols = {
        default: 4,
        900: 3,
        600: 2,
        300: 1
    };

    const handleCancel = () => {
        setCurrentNote(createDefaultNote(selectedCategoryId || ''));
        setIsDialogOpen(false);
    };

    const handleAddNote = async (newNote: Note) => {
        if (!selectedCategoryId) return;
        try {
            const addedNotes = await addNotes(selectedCategoryId, [newNote]);
            if (addedNotes.length > 0) {
                setIsDialogOpen(false);
            } else {
                throw new Error('添加笔记失败');
            }
        } catch (error) {
            console.error('添加笔记时出错', error);
        }
    };

    const getEmptyStateMessage = () => {
        switch (selectedTab) {
            case "learned":
                return {
                    title: "暂无学习记录",
                    description: "开始学习你的第一条笔记吧"
                };
            case "starred":
                return {
                    title: "暂无收藏笔记",
                    description: "收藏你感兴趣的笔记吧"
                };
            default:
                return {
                    title: "暂无笔记",
                    description: "开始添加你的第一条笔记吧"
                };
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <Spinner className="w-20 h-20 text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden relative" tabIndex={-1}>
            <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                <Tabs
                    defaultValue="all"
                    value={selectedTab}
                    onValueChange={(value) => setSelectedTab(value as TabValue)}
                    className="w-full"
                >
                    <TabsList className="w-full grid grid-cols-3 mt-6">
                        <TabsTrigger value="all" className="text-sm">全部</TabsTrigger>
                        <TabsTrigger value="starred" className="text-sm">收藏</TabsTrigger>
                        <TabsTrigger value="learned" className="text-sm">已学习</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div
                ref={invisibleFocusRef}
                tabIndex={-1}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                aria-hidden="true"
            />
            {loadedNotes.length === 0 ? (
                <div className="flex flex-grow h-full px-2 outline-none focus:outline-none">
                    <div className="w-full flex h-full justify-center items-center">
                        <div className="flex flex-col whitespace-pre-line break-words break-all items-center justify-center hyphens-auto">
                            <p className="text-lg font-semibold mb-2">{getEmptyStateMessage().title}</p>
                            <p className="text-sm text-muted-foreground mb-4">{getEmptyStateMessage().description}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <ScrollArea
                    className="flex-grow h-full px-2 mt-4 outline-none focus:outline-none"
                    tabIndex={-1}
                    hideScrollbar
                    onScrollEndReached={handleScrollEndReached}
                >
                    <div className="w-full mt-4 mb-32 outline-none focus:outline-none">
                        <Masonry
                            breakpointCols={breakpointCols}
                            className="flex -ml-3 w-auto"
                            columnClassName="pl-3 space-y-3"
                        >
                            {loadedNotes.map((note) => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </Masonry>
                        {isLoadingMore && (
                            <div className="flex justify-center mt-4">
                                <Spinner className="w-6 h-6 text-primary" />
                            </div>
                        )}
                        {!hasMore && filteredNoteIds.length > INITIAL_LOAD_COUNT && (
                            <span className="block text-center text-muted-foreground mt-4 mb-8">
                                已到底部~
                            </span>
                        )}
                    </div>
                </ScrollArea>
            )}

            {/* Add Note Button */}
            <div className="absolute bottom-4 left-0 right-0 px-2 overflow-hidden justify-center select-none bg-transparent">
                <div className="flex-grow flex items-center justify-end px-0 mb-4 background-transparent pr-4 p-2">
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className={cn(
                            "cursor-pointer relative overflow-hidden",
                            "h-14 w-14 rounded-full",
                            "flex items-center justify-center",
                            "border-2 border-primary",
                            "bg-background text-primary/80 hover:text-primary"
                        )}
                    >
                        <Send className="h-6 w-6 relative z-10" />
                    </button>
                </div>
            </div>

            <NoteEditDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                note={currentNote}
                onSave={handleAddNote}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default ReviewPage;