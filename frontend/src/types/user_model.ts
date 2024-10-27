// @/types/user_model.ts
// 用户模型,和用户资料有关的模型

import { getClientDefaultLanguage } from '@/types/languages';
import { BaseModel } from '@/types/base_model';

// 用于cloudbase的用户信息模型
export interface User {
  avatarUrl?: string;
  location?: {
    country: string;
    province: string;
    city: string;
  };
  username?: string;
  hasPassword?: boolean;
  phone: string; // 添加phone字段，因为我们使用手机号登录
  uid: string;
}


// 用户的个人资料模型，和cloudbase相关联
export interface UserProfile{
  nickname: string; // 用户的昵称
  cloud_note_quota: number;  // 用户的云笔记使用配额，允许云存储的笔记上限
  invite_code: string;  // 用户的邀请码
  invite_by: string | null;  // 邀请者的ID
}


// 创建初始的的用户配置文件
export function createDefaultUserProfile(): UserProfile {
  const now = Date.now(); // 使用时间戳而不是 ISO 字符串
  return {
    nickname: "local",
    cloud_note_quota: 200,
    invite_code: '',
    invite_by: null,
  };
}


export interface StudyPreferences extends BaseModel {
  default_language: string; // 默认语言
  need_guide: boolean, // 是否需要引导
  daily_note_target: number; // 每日学习目标
  note_batch_size: number; // 单次学习卡片数量
  new_note_ratio: number; // 新卡片比例，范围5-100
  spacing_level: number; // 间隔重复的系数，范围1-5
  random_order: boolean; // 是否随机顺序学习
  advanced_mode: false, // 是否开启高级模式,高级模式会显示更多选项
  default_delay_hours: number; // 浏览默认下推迟学习的时间，单位为小时
}

// 定义默认的学习偏好
export const defaultStudyPreferences: StudyPreferences = {
  id: "STUDY_PREFERENCES_ID",
  need_guide: true,
  default_language: getClientDefaultLanguage().code,
  daily_note_target: 20,
  note_batch_size: 20,
  new_note_ratio: 30,
  spacing_level: 3,
  default_delay_hours: 24,
  random_order: false,
  advanced_mode: false,
};





//总体学习数据
export interface OverallStudyStats extends BaseModel {
  total_study_days: number;  // 总学习天数
  current_streak: number; //连续学习
  longest_streak: number;//最长连续学习
  total_cards_studied: number;//总计学习卡片数量
}


//空的总体学习数据
export const defaultOverallStudyStats: OverallStudyStats = {
  id: "OVERALL_STUDY_STATS_ID",
  total_study_days: 0,//累计学习天数
  current_streak: 0,//当前连续学习天数
  longest_streak: 0,//历史最长连续学习天数
  total_cards_studied: 0,//总计学习卡片数量
};


export interface DailyStudyData extends BaseModel {
  date: string; // 
  type: 'stats'; // 数据类型
  card_count: number; // 总学习卡片数量
  new_card_count: number; // 新学的卡片数量
  score: number; // 当日总得分
  accuracy: number; // 当日的平均正确率,等于correct_count除以review_card_count
  correct_count: number; // 当日回忆成功的卡片数量
  review_card_count: number; // 复习的卡片数量
  study_count: number; // 当日累计学习次数
}


// 空的单日学习数据
export function createDefaultDailyStudyData(date: string): DailyStudyData {
  const now = Date.now();
  return {
    id: date, // 使用日期作为 _id,"YYYY-MM-DD" 格式的字符串，作为唯一日期标识
    date,
    type: 'stats',
    card_count: 0,
    new_card_count: 0,
    review_card_count: 0,
    score: 0,
    accuracy: 0,
    study_count: 0,
    correct_count: 0,
  };
}