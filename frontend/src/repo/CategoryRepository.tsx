// @/repo/CategoryRepository.tsx
// Category的仓库层

"use client";

import { localDatabase } from '@/storage/indexedDB';
import { Category, CategoryPriority, createDefaultCategory } from '@/types/category_model';
import { Note } from '@/types/note_model';

export class CategoryRepository {


  //更新category的note count,用于数据库检查或云同步
  async updateCategoryNotesStats(categoryId: string): Promise<void> {
    const notes = await this.getCategoryNotes(categoryId);
    const now = new Date().toString();
    const reviewStats = {
      total_notes: notes.length,
      new_notes: notes.filter(note => note.recall.state === 0).length,
      due_notes: notes.filter(note => note.recall.due && note.recall.due <= now).length,
    };
    await localDatabase.update('localCategorys', categoryId, {
      notes_stats: reviewStats,
      updated_at: now,
    });
  }

  //根据category name查找category
  async findCategoryByName(name: string): Promise<Category | undefined> {
    const allCategories = await this.listCategorys();
    return allCategories.find(category => category.name === name);
  }

  //直接修改category的note stats
  async modifyCategoryNoteStats(categoryId: string, changes: {
    totalDelta?: number,
    newDelta?: number,
    dueDelta?: number
  }): Promise<void> {
    const category = await this.getCategory(categoryId);
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }
    const now = new Date().toString();
    const currentStats = category.notes_stats || { total_notes: 0, new_notes: 0, due_notes: 0 };
    const updatedStats = {
      total_notes: Math.max(0, currentStats.total_notes + (changes.totalDelta || 0)),
      new_notes: Math.max(0, currentStats.new_notes + (changes.newDelta || 0)),
      due_notes: Math.max(0, currentStats.due_notes + (changes.dueDelta || 0))
    };
    await localDatabase.update('localCategorys', categoryId, { notes_stats: updatedStats });
    if (changes.totalDelta !== 0 || changes.newDelta !== 0 || changes.dueDelta !== 0) {
      await localDatabase.update('localCategorys', categoryId, { updated_at: now });
    }
  }




  //创建新category
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    if (!categoryData.name) {
      throw new Error("Category name is required");
    }
    const newCategory: Category = {
      ...createDefaultCategory(),
      ...categoryData,
    };
    await localDatabase.create('localCategorys', newCategory);
    return newCategory;
  }


  //获取用户所有category
  async listCategorys(): Promise<Category[]> {
    const categorys = await localDatabase.readAll('localCategorys');
    return categorys;
  }


  //根据categoryID获取category下的所有note
  async getCategoryNotes(categoryId: string): Promise<Note[]> {
    const allNotes = await localDatabase.readAll('localNotes');
    return allNotes.filter(note => note.category_id === categoryId);
  }

  //根据id获取category
  async getCategory(categoryId: string): Promise<Category | undefined> {
    return localDatabase.read('localCategorys', categoryId);
  }

  //更新category的信息
  async updateCategory(categoryId: string, categoryUpdate: Partial<Category>): Promise<Category> {
    await localDatabase.update('localCategorys', categoryId, categoryUpdate);
    await this.updateCategoryNotesStats(categoryId);
    return this.getCategory(categoryId) as Promise<Category>;
  }

  //删除指定的category和指定category中的所有note
  async deleteCategory(categoryId: string): Promise<void> {
    const notes = await this.getCategoryNotes(categoryId);
    // 首先删除 category
    await localDatabase.delete('localCategorys', categoryId);
    localDatabase.deleteBulk('localNotes', notes.map(note => note.id!))
      .catch(error => console.error('Error deleting notes:', error));
  }

  //向category中添加note
  async addNoteToCategory(categoryId: string, noteId: string): Promise<Category> {
    await localDatabase.update('localNotes', noteId, { category_id: categoryId });
    await this.updateCategoryNotesStats(categoryId);
    return this.getCategory(categoryId) as Promise<Category>;
  }


  //从category中移除note
  async removeNoteFromCategory(categoryId: string, noteId: string): Promise<Category> {
    await localDatabase.update('localNotes', noteId, { category_id: null });
    await this.updateCategoryNotesStats(categoryId);
    return this.getCategory(categoryId) as Promise<Category>;
  }


  //更新focused category的优先级
  async updateCategoryPriority(categoryId: string, priority: CategoryPriority): Promise<Category> {
    try {
      const existingCategory = await this.getCategory(categoryId);
      if (!existingCategory) {
        throw new Error(`Category with id ${categoryId} not found`);
      }
      const now = new Date().toString();
      await localDatabase.update('localCategorys', categoryId, {
        priority: priority,
        updated_at: now
      });
      await this.updateCategoryNotesStats(categoryId);
      return this.getCategory(categoryId) as Promise<Category>;
    } catch (error) {
      console.error(`Error updating category priority: ${error}`);
      throw error;
    }
  }

  //列出所有focused category
  async listFocusedCategorys(): Promise<Category[]> {
    const allCategorys = await this.listCategorys();
    return allCategorys.filter(category => category.priority !== CategoryPriority.Gray)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  //重命名category
  async renameCategory(categoryId: string, newName: string): Promise<Category> {
    await localDatabase.update('localCategorys', categoryId, { name: newName });
    return this.getCategory(categoryId) as Promise<Category>;
  }


}