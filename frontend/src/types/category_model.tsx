//  @/types/category_model.tsx
//  知识点的分类模型

import { v4 as uuidv4 } from 'uuid';
import { Note } from './note_model';
import { cn } from '@/lib/utils';  // 确保路径正确
import { BaseModel } from '@/types/base_model';



export interface Category extends BaseModel {
    name: string;//category名称
    private: boolean;//是否私有
    created_at: string;//创建时间
    updated_at: string;//更新时间
    priority: CategoryPriority;//关注度的级别
    notes_stats: NoteStats;//笔记的统计数据
}


export enum CategoryName {
    GUIDE = "指南", 
    AI = "人工智能",
    MATH = "数学",
    PROGRAMMING = "编程",
    SCIENCE = "科学",
    LANGUAGE = "语言",
    ART = "艺术",
    ECONOMICS = "经济学",
    HISTORY = "历史",
    COMPUTER_SCIENCE = "计算机科学",
    PSYCHOLOGY = "心理学",
    WRITING = "写作",
    BUSINESS = "商业"
}


export interface NoteStats {
    total_notes: number;
    new_notes: number;
    due_notes: number;
}


export enum CategoryPriority {
    Gray = 0,
    Green = 1,
    Blue = 2,
    Orange = 3,
    Red = 4,
    Purple = 5
}


export enum CategoryStatus {
    Active = 'active',
    Focused = 'focused',
    Archived = 'archived',
    Shared = 'shared',
    Recent = 'recent',
}


export interface CategoryFilterOptions {
    showArchived: boolean;
    showTaggedOnly: boolean;
    showWithQuizzesOnly: boolean;
    showWithImagesOnly: boolean;
    showWithLinksOnly: boolean;
    showStarredOnly: boolean,
}


export function createDefaultCategory(): Category {
    const now = Date.now();
    const isoString = new Date(now).toString();
    return {
        id: uuidv4(),
        name: 'untitled',
        private: true,
        created_at: isoString,
        updated_at: isoString,
        priority: CategoryPriority.Gray,
        notes_stats: {
            total_notes: 0,
            new_notes: 0,
            due_notes: 0,
        }
    };
}

export type CategorySortKey = 'created_at' | 'updated_at' | 'name' | 'note_count' | 'last_studied_at' | 'new_notes' | 'due_notes' | 'priority';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
    key: CategorySortKey,
    order: SortOrder
};


export type CategoryViewMode = 'grid' | 'table';


//支持的CategoryAction类型
export type CategoryAction =
    | 'focus' //聚焦/关注
    | 'unfocus' //取消关注
    | 'view'//在新页面打开
    | 'dialog'//弹出对话框
    | 'save' //保存
    | 'delete' //删除
    | 'share' //分享
    | 'clearHistory'//清空历史 
    | 'archive' //归档
    | 'unarchive' //取消归档
    | 'setBackground'//添加背景图片



export interface CategoryExportData {
    category: Category;
    notes: Note[];
    createInfo: {
        exportDate: string;
        version: string;
    };
}


export enum CategoryExportFormat {
    JSON = '.json',
    TXT = '.txt',
    MD = '.md'
}


export enum CategoryImportFormat {
    NOO = 'NOO',
    APKG = 'APKG',
}



export function renderPriorityIcon(priority: CategoryPriority, className?: string) {
    const baseClassName = "w-4 h-4 opacity-80 "; // 这个可以作为默认大小
    const iconProps = {
        className: cn(baseClassName, className), // 使用 cn 函数合并类名
        viewBox: "0 0 24 24",
    };
    const renderCircle = (colorClass: string, filled: boolean = true) => (
        <svg {...iconProps}>
            <circle
                cx="12"
                cy="12"
                r="9"
                strokeWidth="2"
                className={`${colorClass} ${filled ? 'fill-current' : 'fill-transparent'} ${filled ? 'stroke-current' : 'stroke-foreground/60 dark:stroke-foreground/60'}`}
            />
        </svg>
    );
    switch (priority) {
        case CategoryPriority.Gray:
            return renderCircle("text-foreground/60 opacity-80", false);
        case CategoryPriority.Green:
            return renderCircle("text-green-500 dark:text-green-400");
        case CategoryPriority.Blue:
            return renderCircle("text-blue-500 dark:text-blue-400");
        case CategoryPriority.Orange:
            return renderCircle("text-orange-500 dark:text-orange-400");
        case CategoryPriority.Red:
            return renderCircle("text-red-500 dark:text-red-400");
        case CategoryPriority.Purple:
            return renderCircle("text-purple-500 dark:text-purple-400");
    }
}