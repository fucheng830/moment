// @/services/content.service.ts
// 核心代码
// 管理学习内容的服务层


import { NoteRepository } from '@/repo/NoteRepository';
import { CategoryRepository} from '@/repo/CategoryRepository';
import { Note, defaultRecall, CardState, createDefaultNote, filterValidNotes } from '@/types/note_model';
import { Category, CategoryPriority,CategoryName } from '@/types/category_model';
import { getGuideData } from '@/lib/guide';

export class ContentService {
  private static instance: ContentService;
  private noteRepo: NoteRepository;
  private categoryRepo: CategoryRepository;
  constructor() {
    this.noteRepo = new NoteRepository();
    this.categoryRepo = new CategoryRepository();
  }

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // 获取单个笔记
  async getNote(noteId: string): Promise<Note | undefined> {
    return this.noteRepo.getNote(noteId);
  }


  // 获取所有笔记
  async getNotes(): Promise<Note[]> {
    return this.noteRepo.listNotes();
  }


  //加载并且检查全部内容
  async loadAndVerifyContent(): Promise<void> {
    try {
      await this.initializeBaseData(); // 初始化引导数据
      console.log('开始加载并检查全部内容,生成引导数据');
      const allCategorys = await this.categoryRepo.listCategorys();
      let allNotes = await this.noteRepo.listNotes();
      // 使用determineNoteType检查笔记类型
      const updatedNotes = allNotes.map(note => ({
        ...note,
      }));
      // 检查是否有任何笔记的类型发生了变化
      const notesToUpdate = updatedNotes.filter((updatedNote, index) =>
        updatedNote.note_type !== allNotes[index].note_type
      );
      // 如果有笔记类型发生变化，批量更新这些笔记
      if (notesToUpdate.length > 0) {
        await this.noteRepo.updateNotesBatch(notesToUpdate);
        allNotes = updatedNotes; // 使用更新后的笔记列表
      }
      for (const category of allCategorys) {
        const categoryNotes = allNotes.filter(note => note.category_id === category.id);
        const now = new Date().toISOString(); // 使用 ISO 格式的字符串
        const actualStats = {
          total_notes: categoryNotes.length,
          new_notes: categoryNotes.filter(note => note.recall.state === CardState.NEW).length,
          due_notes: categoryNotes.filter(note => note.recall.due && note.recall.due <= now).length,
        };
        if (
          !category.notes_stats ||
          category.notes_stats.total_notes !== actualStats.total_notes ||
          category.notes_stats.new_notes !== actualStats.new_notes ||
          category.notes_stats.due_notes !== actualStats.due_notes
        ) {
          await this.categoryRepo.updateCategory(category.id!, {
            notes_stats: actualStats,
            updated_at: now
          });
        }
      }
    } catch (error) {
      console.error('Error during content verification:', error);
      throw new Error('Failed to verify content and update note types');
    }
  }


  //添加笔记
  async addNotes(
    categoryId: string,
    notesData: Partial<Note>[],
    onProgress: (progress: number) => void,
    signal: AbortSignal
  ): Promise<{ newNotes: Note[], affectedNoteIds: Set<string> }> {
    // 过滤有效的笔记并确定笔记类型,使用createDefaultNote创建完整的临时笔记对象
    const validNotesData = filterValidNotes(notesData).map(noteData => {
      const { id, ...rest } = noteData;
      const tempNote = createDefaultNote(categoryId, rest);
      return {
        ...tempNote, // 使用新创建的笔记对象（包含新的 id）
      };
    });
    const newNotes: Note[] = [];
    const affectedNoteIds = new Set<string>();
    const batchSize = 100;
    for (let i = 0; i < validNotesData.length; i += batchSize) {
      const batch = validNotesData.slice(i, i + batchSize);
      const batchResults = await this.noteRepo.createNotes(batch, categoryId);
      for (const noteId of batchResults.created_note_ids) {
        const newNote = await this.getNote(noteId);
        if (newNote) {
          newNotes.push(newNote);
          if (newNote.links && newNote.links.to) {
            newNote.links.to.forEach(linkedNoteId => affectedNoteIds.add(linkedNoteId));
          }
        }
      }
      const progress = ((i + batch.length) / validNotesData.length) * 100;
      onProgress(progress);
    }
    if (affectedNoteIds.size > 0) {
      await this.updateAffectedNotesBatch(Array.from(affectedNoteIds), newNotes);
    }
    await this.categoryRepo.modifyCategoryNoteStats(categoryId, {
      totalDelta: newNotes.length,
      newDelta: newNotes.length
    });
    onProgress(100);
    return { newNotes, affectedNoteIds };
  }


  // 新增的辅助方法，用于批量更新受影响的笔记
  private async updateAffectedNotesBatch(affectedNoteIds: string[], newNotes: Note[]): Promise<void> {
    const affectedNotes = await Promise.all(affectedNoteIds.map(id => this.noteRepo.getNote(id)));
    const updatedNotes = affectedNotes.map(note => {
      if (note) {
        const updatedLinks = {
          ...note.links,
          from: [...new Set([...note.links.from, ...newNotes.filter(n => n.links.to.includes(note.id)).map(n => n.id)])]
        };
        return { ...note, links: updatedLinks };
      }
      return null;
    }).filter((note): note is Note => note !== null);
    await this.noteRepo.updateNotesBatch(updatedNotes);
  }


  // 更新笔记同时更新双向链接
  async updateNote(noteId: string, noteUpdate: Partial<Note>): Promise<Note> {
    console.log('服务层更新笔记');
    // 1. 获取旧笔记（仍然需要，因为后续操作要用到）
    const oldNote = await this.noteRepo.getNote(noteId);
    if (!oldNote) {
      throw new Error('Note not found');
    }
    // 2. 确定笔记类型并更新
    const updatedNote = await this.noteRepo.updateNote(noteId, {
      ...noteUpdate
    });
    // 3. 处理双向链接
    if (noteUpdate.links) {
      const oldLinks = oldNote.links?.to || [];
      const newLinks = noteUpdate.links.to;
      await this.updateAffectedNotes(noteId, oldLinks, newLinks);
    }
    // 4. 更新卡组统计
    if (updatedNote.category_id) {
      const changes = this.calculateNoteChanges(oldNote, updatedNote);
      await this.categoryRepo.modifyCategoryNoteStats(updatedNote.category_id, changes);
    }
    return updatedNote;
  }


  //批量更新笔记
  async updateNotes(updates: { [noteId: string]: Partial<Note> }): Promise<Note[]> {
    const updatedNotes: Note[] = [];
    for (const [noteId, changes] of Object.entries(updates)) {
      const updatedNote = await this.updateNote(noteId, changes);
      updatedNotes.push(updatedNote);
    }
    return updatedNotes;
  }



  //删除笔记
  async deleteNote(noteId: string): Promise<void> {
    const note = await this.noteRepo.getNote(noteId);
    if (note) {
      if (note.links) {
        await this.updateAffectedNotes(noteId, note.links.to, []);
      }
      await this.noteRepo.deleteNote(noteId);
      if (note.category_id) {
        await this.categoryRepo.modifyCategoryNoteStats(note.category_id, {
          totalDelta: -1,
          newDelta: note.recall.state === CardState.NEW ? -1 : 0,
          dueDelta: this.isNoteDue(note) ? -1 : 0
        });
      }
    }
  }


  // 搜索笔记
  async searchNotes(query: string): Promise<Note[]> {
    try {
      const allNotes = await this.noteRepo.listNotes();
      const matchedNotes = allNotes.filter(note => {
        const titleMatch = note.title?.toLowerCase().includes(query.toLowerCase());
        const contentMatch = note.original_content?.toLowerCase().includes(query.toLowerCase()) ||
          note.html_text?.toLowerCase().includes(query.toLowerCase());
        return titleMatch || contentMatch;
      });
      return matchedNotes;
    } catch (error) {
      throw new Error('Failed to search notes');
    }
  }


  // 矢量化的搜索方法
  async searchNotesVector(query: string): Promise<Note[]> {
    try {
      const allNotes = await this.noteRepo.listNotes();
      const matchedNotes = allNotes.filter(note => {
        const titleMatch = note.title?.toLowerCase().includes(query.toLowerCase());
        const contentMatch = note.original_content?.toLowerCase().includes(query.toLowerCase()) ||
          note.html_text?.toLowerCase().includes(query.toLowerCase());
        return titleMatch || contentMatch;
      });
      return matchedNotes;
    } catch (error) {
      throw new Error('Failed to search notes');
    }
  }




  // Category相关方法
  async createCategory(category: Partial<Category>): Promise<Category> {
    return this.categoryRepo.createCategory(category);
  }


  // 获取所有category
  async getCategorys(): Promise<Category[]> {
    return this.categoryRepo.listCategorys();
  }


  // 获取单个category
  async getCategory(categoryId: string): Promise<Category | undefined> {
    return this.categoryRepo.getCategory(categoryId);
  }


  //更新category
  async updateCategory(categoryId: string, categoryUpdate: Partial<Category>): Promise<Category> {
    const oldCategory = await this.categoryRepo.getCategory(categoryId);
    // 只有当categoryUpdate中明确包含cover_image_id时,才进行比较和删除操作
    return this.categoryRepo.updateCategory(categoryId, categoryUpdate);
  }



  // 删除category同时删除category中的所有笔记（已经在repo层实现）
  async deleteCategory(categoryId: string): Promise<void> {
    return this.categoryRepo.deleteCategory(categoryId);
  }


  // 获取category中的全部笔记
  async getCategoryNotes(categoryId: string): Promise<Note[]> {
    return this.categoryRepo.getCategoryNotes(categoryId);
  }


  // 更新category的优先级
  async updateCategoryPriority(categoryId: string, priority: CategoryPriority): Promise<Category> {
    try {
      const updatedCategory = await this.categoryRepo.updateCategoryPriority(categoryId, priority);
      return updatedCategory;
    } catch (error) {
      console.error(`Error updating category priority: ${error}`);
      throw error;
    }
  }

  //列出所有处于关注以上优先级的category
  async getFocusedCategorys(): Promise<Category[]> {
    return this.categoryRepo.listFocusedCategorys();
  }


  // 移动笔记到另一个category
  async moveCategoryNote(noteId: string, fromCategoryId: string, toCategoryId: string): Promise<void> {
    const note = await this.noteRepo.getNote(noteId);
    if (note) {
      await this.categoryRepo.modifyCategoryNoteStats(fromCategoryId, {
        totalDelta: -1,
        newDelta: note.recall.state === CardState.NEW ? -1 : 0,
        dueDelta: this.isNoteDue(note) ? -1 : 0
      });
      await this.categoryRepo.modifyCategoryNoteStats(toCategoryId, {
        totalDelta: 1,
        newDelta: note.recall.state === CardState.NEW ? 1 : 0,
        dueDelta: this.isNoteDue(note) ? 1 : 0
      });
      await this.noteRepo.updateNote(noteId, { category_id: toCategoryId });
    }
  }


  // 重命名category
  async renameCategory(categoryId: string, newName: string): Promise<Category> {
    return this.categoryRepo.renameCategory(categoryId, newName);
  }


  // 情空category中所有的笔记的学习历史，同时情况category的最近一次学习记录
  async clearCategoryRecallHistory(categoryId: string): Promise<void> {
    try {
      const notes = await this.categoryRepo.getCategoryNotes(categoryId);
      const updatedNotes = notes.map(note => ({
        ...note,
        recall: defaultRecall()
      }));
      await this.noteRepo.updateNotesBatch(updatedNotes);
      await this.categoryRepo.updateCategoryNotesStats(categoryId);
    } catch (error) {
      console.error(`Error clearing category recall history: ${error}`);
      throw new Error('Failed to clear category recall history');
    }
  }


  // 辅助方法，计算笔记更新对category的影响
  private calculateNoteChanges(oldNote?: Note, newNote?: Note): { totalDelta: number, newDelta: number, dueDelta: number } {
    let totalDelta = 0;
    let newDelta = 0;
    let dueDelta = 0;
    if (!oldNote && newNote) {
      totalDelta = 1;
      newDelta = newNote.recall.state === CardState.NEW ? 1 : 0;
      dueDelta = this.isNoteDue(newNote) ? 1 : 0;
    } else if (oldNote && !newNote) {
      totalDelta = -1;
      newDelta = oldNote.recall.state === CardState.NEW ? -1 : 0;
      dueDelta = this.isNoteDue(oldNote) ? -1 : 0;
    } else if (oldNote && newNote) {
      if (oldNote.recall.state === CardState.NEW && newNote.recall.state !== CardState.NEW) {
        newDelta = -1;
      } else if (oldNote.recall.state !== CardState.NEW && newNote.recall.state === CardState.NEW) {
        newDelta = 1;
      }
      if (this.isNoteDue(oldNote) && !this.isNoteDue(newNote)) {
        dueDelta = -1;
      } else if (!this.isNoteDue(oldNote) && this.isNoteDue(newNote)) {
        dueDelta = 1;
      }
    }
    return { totalDelta, newDelta, dueDelta };
  }


  // 辅助方法，判断笔记是否过期
  private isNoteDue(note: Note): boolean {
    return note.recall.due !== null && new Date(note.recall.due) <= new Date();
  }



  // 更新笔记的双向链接,接受旧的链接和新的链接列表
  async updateAffectedNotes(noteId: string, oldLinks: string[], newLinks: string[]): Promise<string[]> {
    const addedLinks = newLinks.filter(link => !oldLinks.includes(link));
    const removedLinks = oldLinks.filter(link => !newLinks.includes(link));
    const updatePromises: Promise<string | null>[] = [];
    // 处理新增的链接
    for (const addedLinkId of addedLinks) {
      updatePromises.push(
        this.noteRepo.getNote(addedLinkId).then(linkedNote => {
          if (linkedNote) {
            const updatedLinks = {
              ...linkedNote.links,
              from: [...new Set([...linkedNote.links.from, noteId])]
            };
            return this.noteRepo.updateNote(addedLinkId, { links: updatedLinks })
              .then(() => addedLinkId);
          }
          return null;
        }).catch(error => {
          console.error(`Error updating link for note ${addedLinkId}:`, error);
          return null;
        })
      );
    }
    // 处理移除的链接
    for (const removedLinkId of removedLinks) {
      updatePromises.push(
        this.noteRepo.getNote(removedLinkId).then(linkedNote => {
          if (linkedNote) {
            const updatedLinks = {
              ...linkedNote.links,
              from: linkedNote.links.from.filter(id => id !== noteId)
            };
            return this.noteRepo.updateNote(removedLinkId, { links: updatedLinks })
              .then(() => removedLinkId);
          }
          return null;
        }).catch(error => {
          console.error(`Error updating link for note ${removedLinkId}:`, error);
          return null;
        })
      );
    }
    // 等待所有更新完成并收集成功更新的笔记ID
    const results = await Promise.all(updatePromises);
    return results.filter((id): id is string => id !== null);
  }



  private async initializeBaseData(): Promise<void> {
    try {
      // 1. 初始化所有基础分类
      const baseCategories = [
        { name: CategoryName.GUIDE, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.AI, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.MATH, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.PROGRAMMING, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.SCIENCE, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.LANGUAGE, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.ART, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.ECONOMICS, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.HISTORY, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.COMPUTER_SCIENCE, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.PSYCHOLOGY, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.WRITING, private: false, priority: CategoryPriority.Gray },
        { name: CategoryName.BUSINESS, private: false, priority: CategoryPriority.Gray },
      ];
  
      // 2. 遍历并创建/获取每个分类
      for (const categoryData of baseCategories) {
        const existingCategory = await this.categoryRepo.findCategoryByName(categoryData.name);
        if (!existingCategory) {
          await this.categoryRepo.createCategory(categoryData);
        }
      }
  
      // 3. 初始化指南内容
      const guideCategory = await this.categoryRepo.findCategoryByName(CategoryName.GUIDE);
      if (guideCategory) {
        const guideNotesData = getGuideData();
        const categoryNotes = await this.getCategoryNotes(guideCategory.id);
        const notesToCreate: Partial<Note>[] = [];
  
        for (const guideNote of guideNotesData) {
          const existingNote = categoryNotes.find(note => note.title === guideNote.title);
          if (!existingNote) {
            notesToCreate.push({
              title: guideNote.title,
              note_type: guideNote.note_type,
              category_name: CategoryName.GUIDE,
              category_id: guideCategory.id,
              unit: guideNote.unit,
              html_text: guideNote.html_text,
              tags: guideNote.tags || [],
              images: guideNote.images || [],
              starred: false,
              original_content: guideNote.html_text?.replace(/<[^>]*>/g, '') || '',
              vector: [],
              links: {
                to: [],
                from: []
              }
            });
          }
        }
  
        // 4. 创建指南笔记
        if (notesToCreate.length > 0) {
          const controller = new AbortController();
          await this.addNotes(
            guideCategory.id,
            notesToCreate,
            () => { },
            controller.signal
          );
        }
      }
  
    } catch (error) {
      console.error('Error initializing base data:', error);
      throw new Error('Failed to initialize base data');
    }
  }





}

export const contentService = ContentService.getInstance();