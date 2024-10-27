// @/storage/localStorageManager.ts
// 用于快捷管理 localStorage 的类

export enum StorageKey {
  TOKEN = 'token',
  USER_ID = 'userId',
  USER_NICKNAME = 'userNickname',
  APP_LANGUAGE = 'appLanguage',
  NOTE_SORT_KEY = 'noteSortKey',
  NOTE_SORT_ORDER = 'noteSortOrder',
  NOTE_SHUFFLE_SEED = 'noteShuffleSeed',
  NOTE_LAYOUT = 'noteLayout',
  AUDIO_AUTO_PLAY = 'audioAutoPlay',
  AUTO_SYNC_ENABLED = 'autoSyncEnabled',
  DATABASE_SIZE = 'databaseSize',
  LAST_SYNC_DATE = 'lastSyncDate',
  NOTE_TAKER_EXPANDED = 'noteTakerExpanded',
  NOTE_DISPLAY_MODE = 'noteDisplayMode',
  LAST_VIEWED_DECK_ID = 'lastViewedCategoryId',
  DEFAULT_EDITOR_MODE = 'defaultEditorMode',
  APP_THEME = 'app_theme',  // 添加这行
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;

  private constructor() { }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  public saveData(key: StorageKey, value: any): void {
    if (this.isClient()) {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }

  public loadData<T>(key: StorageKey): T | null {
    if (this.isClient()) {
      try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
          return null;
        }
        return JSON.parse(serializedValue) as T;
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  public clearData(key: StorageKey): void {
    if (this.isClient()) {
      localStorage.removeItem(key);
    }
  }

  public clearAllData(): void {
    if (this.isClient()) {
      localStorage.clear();
    }
  }

  // 其他方法保持不变，但需要在方法内部使用 this.isClient() 检查
  public loadToken(): string | null {
    return this.loadData<string>(StorageKey.TOKEN);
  }

  public loadUserId(): string | null {
    return this.loadData<string>(StorageKey.USER_ID);
  }

  public saveToken(token: string): void {
    this.saveData(StorageKey.TOKEN, token);
  }

  public saveUserId(userId: string): void {
    this.saveData(StorageKey.USER_ID, userId);
  }

  public saveNoteLayout(layout: string): void {
    this.saveData(StorageKey.NOTE_LAYOUT, layout);
  }

  public loadNoteLayout(): string | null {
    return this.loadData<string>(StorageKey.NOTE_LAYOUT);
  }
  
  public clearToken(): void {
    this.clearData(StorageKey.TOKEN);
  }

  public clearAllUserData(): void {
    this.clearData(StorageKey.TOKEN);
    this.clearData(StorageKey.USER_ID);
    this.clearData(StorageKey.USER_NICKNAME);
  }
}

export default LocalStorageManager.getInstance();