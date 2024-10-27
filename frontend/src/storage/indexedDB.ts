// indexedDB.ts
// 执行本地数据操作的数据库


import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note } from '@/types/note_model';
import { Category } from '@/types/category_model';

type StoreWithDeletedAt = 'localCategorys' | 'localNotes';

interface NoolingoTestDB extends DBSchema {
    localCategorys: { key: string; value: Category; indexes: { "_deleted_at": number }; };
    localNotes: { key: string; value: Note; indexes: { "_deleted_at": number; "category_id": string }; };
}


// 常量，indexedDB的数据库名称
type StoreNames =  'localCategorys' | 'localNotes'


class IndexedDatabase {
    private db: IDBPDatabase<NoolingoTestDB> | null = null;
    private onDataChange: ((version: number) => void) | null = null;
    private dataVersion: number = 0;//最近一次修改本地数据的时间戳

    constructor() {
        this.init().catch(error => console.error('Failed to initialize database:', error));
    }

    setOnDataChange(callback: (version: number) => void) {
        this.onDataChange = callback;
    }

    private triggerDataChange() {
        this.dataVersion++;
        if (this.onDataChange) {
            this.onDataChange(this.dataVersion);
        }
    }

    getDataVersion(): number {
        return this.dataVersion;
    }


    async init() {
        if (this.db) return;
        this.db = await openDB<NoolingoTestDB>('momentDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('localCategorys')) {
                    const categoryStore = db.createObjectStore('localCategorys', { keyPath: 'id' });
                    if (!categoryStore.indexNames.contains('_deleted_at')) {
                        categoryStore.createIndex('_deleted_at', '_deleted_at');
                    }
                }
                if (!db.objectStoreNames.contains('localNotes')) {
                    const noteStore = db.createObjectStore('localNotes', { keyPath: 'id' });
                    if (!noteStore.indexNames.contains('_deleted_at')) {
                        noteStore.createIndex('_deleted_at', '_deleted_at');
                    }
                    if (!noteStore.indexNames.contains('category_id')) {
                        noteStore.createIndex('category_id', 'category_id');
                    }
                }
            },
        });
    }

    //更新数据的版本
    private updateMetadata<T extends { id: string }>(item: T): T & { _ver: number, updated_at: string, syncStatus: 'pending' | 'synced' } {
        const now = Date.now();
        return {
            ...item,
            _ver: now,
            updated_at: new Date(now).toISOString(),
            syncStatus: 'pending'
        };
    }

    // 创建数据
    async create<T extends StoreNames>(storeName: T, item: NoolingoTestDB[T]['value']): Promise<string> {
        if (!this.db) await this.init();
        const itemWithMeta = this.updateMetadata(item);
        const id = await this.db!.add(storeName, itemWithMeta);
        this.triggerDataChange();
        return id.toString();
    }

    // 批量创建
    async createBulk<T extends StoreNames>(storeName: T, items: NoolingoTestDB[T]['value'][]): Promise<string[]> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const itemsWithMeta = items.map(item => this.updateMetadata(item));
        const ids = await Promise.all(itemsWithMeta.map(item => store.add(item)));
        await tx.done;
        this.triggerDataChange();
        return ids.map(id => id.toString());
    }

    // 读取数据
    async read<T extends StoreNames>(storeName: T, id: string): Promise<NoolingoTestDB[T]['value'] | undefined> {
        if (!this.db) await this.init();
        const item = await this.db!.get(storeName, id);
        if (item && '_deleted_at' in item && item._deleted_at) {
            return undefined;
        }
        return item;
    }


    // 读取集合的所有数据
    async readAll<T extends StoreNames>(storeName: T, withDeleted: boolean = false): Promise<NoolingoTestDB[T]['value'][]> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const allItems = await store.getAll();
        let filteredItems;
        if (withDeleted) {
            filteredItems = allItems;
        } else {
            filteredItems = allItems.filter(item => !item._deleted_at);
        }
        return filteredItems;
    }

    // 读取已删除的数据
    async readDeleted<T extends StoreWithDeletedAt>(storeName: T): Promise<NoolingoTestDB[T]['value'][]> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const index = store.index('_deleted_at');
        return index.getAll(IDBKeyRange.lowerBound(1));
    }

    // 更新数据
    async update<T extends StoreNames>(storeName: T, id: string, updates: Partial<NoolingoTestDB[T]['value']>): Promise<void> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const item = await store.get(id);
        if (!item) throw new Error(`Item with id ${id} not found in ${storeName}`);
        if ('_deleted_at' in item && item._deleted_at) throw new Error(`Item with id ${id} has been deleted`);
        const updatedItem = this.updateMetadata({ ...item, ...updates });
        await store.put(updatedItem);
        await tx.done;
        this.triggerDataChange();
    }

    // 批量更新
    async updateBulk<T extends StoreNames>(storeName: T, items: NoolingoTestDB[T]['value'][]): Promise<void> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const updatedItems = items.map(item => this.updateMetadata(item));
        await Promise.all(updatedItems.map(item => store.put(item)));
        await tx.done;
        this.triggerDataChange();
    }

    // 写入数据（直接覆盖）
    async put<T extends StoreNames>(storeName: T, item: NoolingoTestDB[T]['value']): Promise<void> {
        if (!this.db) await this.init();
        const itemWithMeta = this.updateMetadata(item);
        await this.db!.put(storeName, itemWithMeta);
        this.triggerDataChange();
    }

    // 删除（软删除）
    async delete<T extends StoreNames>(storeName: T, id: string): Promise<void> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const item = await store.get(id);
        if (!item) throw new Error(`Item with id ${id} not found in ${storeName}`);
        const deletedItem = this.updateMetadata({ ...item, _deleted_at: Date.now() });
        await store.put(deletedItem);
        await tx.done;
        this.triggerDataChange();
    }

    // 批量删除
    async deleteBulk<T extends StoreNames>(storeName: T, ids: string[]): Promise<void> {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const now = Date.now();
        await Promise.all(ids.map(async (id) => {
            const item = await store.get(id);
            if (item) {
                const deletedItem = this.updateMetadata({ ...item, _deleted_at: now });
                await store.put(deletedItem);
            }
        }));
        await tx.done;
        this.triggerDataChange();
    }


    // 清除所有的本地存储
    async clearStore<T extends StoreNames>(storeName: T): Promise<void> {
        if (!this.db) await this.init();
        await this.db!.clear(storeName);
        this.triggerDataChange();
    }



}

export const localDatabase = new IndexedDatabase();