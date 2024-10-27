// @/lib/guide.ts
import guide from '@/locales/guide.json';
import { NoteType, Note } from '@/types/note_model';

// 定义指南数据的接口
interface GuideData {
  guideNotes: Array<Partial<Note>>;
}

// 获取引导笔记数据
export function getGuideData(): Array<Partial<Note>> {
    return (guide as GuideData).guideNotes;
}

// 按标题查找特定的引导笔记
export function findGuideNoteByTitle(title: string): Partial<Note> | undefined {
    return getGuideData().find(note => note.title === title);
}

// 初始化guide数据
export function initializeGuideTranslations(): void {
    const guideNotes = getGuideData();
    
    // 验证guide数据格式是否正确
    if (!Array.isArray(guideNotes)) {
        console.error('Guide data must have a guideNotes array');
    }
    
    // 验证必要字段
    guideNotes.forEach((guide, index) => {
        // 检查必要字段
        const requiredFields = ['title', 'html_text', 'note_type'];
        const missingFields = requiredFields.filter(field => !(field in guide));
        
        if (missingFields.length > 0) {
            console.error(`Guide note at index ${index} is missing required fields: ${missingFields.join(', ')}`);
        }
        
        // 检查note_type是否是有效的枚举值
        if (guide.note_type && !Object.values(NoteType).includes(guide.note_type)) {
            console.error(`Invalid note_type "${guide.note_type}" at index ${index}`);
        }
    });
    
    console.log('Guide data loaded and validated.');
}