// @/types/base_model.tsx

export interface BaseModel {
    id: string;//字段从_idx改为id，避免和保留字冲突
    _ver?: number;//rev版本号,最后修改的时间戳
    _deleted_at?: number; //用于标记软删除,删除的时间戳
    syncStatus?: 'synced' | 'pending';//同步状态，synced表示已同步，pending表示未同步，后写入者胜利
  }