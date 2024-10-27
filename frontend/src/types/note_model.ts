//@/types/note_model.ts


import { v4 as uuidv4 } from 'uuid';
import { BaseModel } from '@/types/base_model';
import { CategoryName } from "@/types/category_model";
export enum NoteLayout { default = "default", single = "single" }


export enum NoteType {
  NORMAL = "normal",
}


export interface Note extends BaseModel {
  //创建信息
  category_id: string | null;//所属知识集id
  category_name: CategoryName | null; // 修改为使用枚举类型
  created_at: string;
  updated_at: string;
  note_type: NoteType;  //笔记的类型标识符,用于区分不同类型的笔记
  title: string | null;   // 笔记标题
  unit: string | null;//所属单元，用于实现章节
  html_text: string | null; // 用于富文本编辑器的文本
  tags: string[];//笔记的标签，用于筛选
  starred: boolean; // 表示用户是否收藏了该笔记
  images: string[];  // 图片附件。base64编码
  recall: Recall;  //笔记的掌握程度和复习数据，详见recall_model.ts
  original_content: string;// 用于实现检索优化的纯文本
  vector: string[]; // 向量化的笔记内容，用于向量搜索
  links: {
    to: string[];   // 指向其他笔记的链接
    from: string[]; // 来自其他笔记的链接
  };
}




// 创建默认笔记
export const createDefaultNote = (categoryId: string | null = null, partialNote: Partial<Note> = {}): Note => {
  const now = Date.now();
  const isoString = new Date(now).toISOString();
  const baseNote: Note = {
    id: uuidv4(),
    category_id: categoryId ?? null,
    category_name: null,  // 添加默认值为null
    note_type: NoteType.NORMAL, // 设置默认值
    created_at: isoString,
    updated_at: isoString,
    title: null,
    unit: null,
    html_text: '',
    images: [],
    tags: [],
    starred: false,
    vector: [],
    original_content: '',
    recall: defaultRecall(),
    links: {
      to: [],
      from: []
    },
    ...partialNote
  };
  return baseNote;
};




//NoteAction类型,处理Category中的笔记操作
export type NoteAction =
  | 'edit'          // 编辑笔记
  | 'delete'        // 删除笔记
  | 'read'        // 阅读笔记
  | 'update'        // 更新笔记
  | 'copyToClipboard' // 复制到剪贴板
  | 'clearHistory'  // 清空学习记录
  | 'favorite'      // 收藏/取消收藏
  | 'unfavorite'      //  收藏/取消收藏
  //用于调试的
  | 'info'    // 查看笔记调试信息


//下面是关于fsrs算法的部分

export interface ReviewLog {
  date: string;
  rating: number;
}


// CardRating 枚举
export enum CardRating {
  AGAIN = 1,
  HARD = 2,
  GOOD = 3,
  EASY = 4,
  MASTER = 5,
}


export enum CardState {
  NEW = 0,  // 新卡片
  LEARNING = 1, // 学习中
  REVIEW = 2,   // 复习中
  RELEARNING = 3,   // 再学习中
  MASTERED = 4,  // 熟知状态
}


export interface Recall {
  due: string | null;//算法预估的到期时间的ISO字符串
  last_read_at: string | null;//上次阅读时间的ISO字符串
  last_match_at: string | null;//上次匹配时间的ISO字符串
  schedule: string | null;//计划复习时间的ISO字符串
  state: number;//卡片状态
  retrievability: number | null;
  difficulty: number;
  stability: number;
  reps: number;
  lapses: number;//历史遗忘次数
  last_review: string;//上次复习时间
  review_logs: ReviewLog[];
}


export function defaultRecall(): Recall {
  const now = new Date();
  const due = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 设置为24小时前,保证新建的卡片都是待学的
  return {
    due: due.toISOString(),
    schedule: due.toISOString(),
    last_read_at: due.toISOString(),
    last_match_at: due.toISOString(),
    state: CardState.NEW,
    retrievability: 0.0,
    difficulty: 1,
    stability: 0.1,
    reps: 0,
    lapses: 0,
    last_review: due.toISOString(),
    review_logs: []
  };
}


// 辅助方法，过滤无效的笔记数据
export const filterValidNotes = (notesData: Partial<Note>[]): Partial<Note>[] => {
  return notesData.filter(noteData => {
    const hasContent = noteData.html_text?.trim() !== '<p></p>';
    const hasImages = noteData.images && noteData.images?.length > 0;
    const hasTitle = noteData.title?.trim() !== '';
    return hasTitle || hasContent || hasImages;
  });
};