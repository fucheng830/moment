// @/lib/fsrs.ts
// 核心，Fsrs算法,用于memorization的算法

import { Recall,CardRating,CardState} from '@/types/note_model';

/*
从类型定义导入，这里供参考

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
*/


interface SchedulingCards {
  again: Recall;
  hard: Recall;
  good: Recall;
  easy: Recall;
}


class FSRS {
  // FSRS算法的参数组
  private static readonly w: number[] = [
    0.4,    // w[0] - AGAIN评分的初始稳定性
    0.6,    // w[1] - HARD评分的初始稳定性
    2.4,    // w[2] - GOOD评分的初始稳定性
    5.8,    // w[3] - EASY评分的初始稳定性
    4.93,   // w[4] - 初始难度基准值
    0.94,   // w[5] - 难度修正系数
    0.86,   // w[6] - 难度变化率
    0.01,   // w[7] - 难度均值回归权重
    1.49,   // w[8] - 稳定性增长系数
    0.14,   // w[9] - 稳定性衰减指数
    0.94,   // w[10] - 可提取性影响系数
    2.18,   // w[11] - 遗忘后稳定性基准值
    0.05,   // w[12] - 难度对遗忘稳定性的影响指数
    0.34,   // w[13] - 先前稳定性对遗忘稳定性的影响指数
    1.26,   // w[14] - 遗忘时可提取性的影响系数
    0.29,   // w[15] - HARD评分的稳定性惩罚系数
    2.61,    // w[16] - EASY评分的稳定性奖励系数
    0.5034,  // w[17] - 短期稳定性系数
    0.6567   // w[18] - 短期稳定性基准值
  ];
  private static readonly targetRetention: number = 0.9;
  private static readonly DECAY: number = -0.5;
  private static readonly FACTOR: number = Math.pow(0.9, 1 / FSRS.DECAY) - 1;

  
  // 评估并更新记忆状态
  public static evaluate(recall: Recall, rating: CardRating, now: Date = new Date()): Recall {
    const nowUTC = new Date(now.toUTCString());
    // 处理 MASTER 评级
    if (rating === CardRating.MASTER) {
      return FSRS.masterCard(recall, nowUTC);
    }
    // 获取当前状态
    const state = recall.state || CardState.NEW;
    const difficulty = recall.difficulty || 5;
    const stability = recall.stability || 0;
    const retrievability = FSRS.retrievability(recall, nowUTC);
    // 计算新的状态
    const newStates = FSRS.computeNewStates(state, rating, difficulty, stability, retrievability);
    // 计算新的到期时间
    const currentDue = recall.due ? new Date(recall.due) : nowUTC;
    const newDue = FSRS.computeNewDue(
      newStates.state,
      rating,
      newStates.stability,
      nowUTC,
      currentDue
    );
    // 返回更新后的记忆对象
    return FSRS.createUpdatedRecall(
      recall,
      newStates,
      newDue,
      retrievability,
      rating,
      nowUTC
    );
  }

  // 计算新的状态
  private static computeNewStates(
    state: CardState,
    rating: CardRating,
    difficulty: number,
    stability: number,
    retrievability: number
  ): { state: CardState; difficulty: number; stability: number } {
    if (state === CardState.NEW) {
      return FSRS.handleNewCard(rating);
    } else if (state === CardState.LEARNING || state === CardState.RELEARNING) {
      return FSRS.handleLearningCard(state, rating, difficulty, stability, retrievability);
    } else {
      return FSRS.handleReviewCard(rating, difficulty, stability, retrievability);
    }
  }

  // 处理新卡片
  private static handleNewCard(rating: CardRating): { state: CardState; difficulty: number; stability: number } {
    return {
      state: rating === CardRating.AGAIN ? CardState.LEARNING : CardState.REVIEW,
      difficulty: FSRS.initDifficulty(rating),
      stability: rating === CardRating.AGAIN ? 0.1 : FSRS.initStability(rating)
    };
  }

  //学习中的卡片
  private static handleLearningCard(
    state: CardState,
    rating: CardRating,
    difficulty: number,
    stability: number,
    retrievability: number
  ): { state: CardState; difficulty: number; stability: number } {
    if (rating === CardRating.AGAIN) {
      return {
        state: state,
        difficulty: difficulty,
        stability: 0.1
      };
    }
    // 对于非AGAIN评分，使用短期稳定性计算
    const newDifficulty = FSRS.nextDifficulty(difficulty, rating);
    return {
      state: CardState.REVIEW,
      difficulty: newDifficulty,
      stability: FSRS.shortTermStability(stability, rating) // 使用短期稳定性
    };
  }

  
  //复习卡片
  private static handleReviewCard(
    rating: CardRating,
    difficulty: number,
    stability: number,
    retrievability: number
  ): { state: CardState; difficulty: number; stability: number } {
    const newDifficulty = FSRS.nextDifficulty(difficulty, rating);
    if (rating === CardRating.AGAIN) {
      return {
        state: CardState.RELEARNING,
        difficulty: newDifficulty,
        stability: FSRS.nextForgetStability(newDifficulty, stability, retrievability)
      };
    }
    return {
      state: CardState.REVIEW,
      difficulty: newDifficulty,
      stability: FSRS.nextRecallStability(newDifficulty, stability, retrievability, rating)
    };
  }


  // 计算新的到期时间
  private static computeNewDue(
    state: CardState,
    rating: CardRating,
    stability: number,
    now: Date,
    currentDue: Date
  ): Date {
    const baseDate = new Date(Math.max(now.getTime(), currentDue.getTime()));
    const intervalMinutes = (state === CardState.LEARNING || state === CardState.RELEARNING)
      ? FSRS.learningSteps(rating)
      : FSRS.nextInterval(stability);
    
    return new Date(baseDate.getTime() + intervalMinutes * 60 * 1000);
  }


  //计算新的recall对象
  private static createUpdatedRecall(
    recall: Recall,
    newStates: { state: CardState; difficulty: number; stability: number },
    newDue: Date,
    retrievability: number,
    rating: CardRating,
    now: Date
  ): Recall {
    return {
      ...recall,
      due: newDue.toISOString(),
      schedule: newDue.toISOString(),
      last_match_at: newDue.toISOString(),
      last_read_at: newDue.toISOString(),
      state: newStates.state,
      retrievability: retrievability,
      difficulty: newStates.difficulty,
      stability: newStates.stability,
      reps: (recall.reps || 0) + 1,
      lapses: rating === CardRating.AGAIN ? (recall.lapses || 0) + 1 : recall.lapses || 0,
      last_review: now.toISOString(),
      review_logs: [
        ...(recall.review_logs || []),
        { date: now.toISOString(), rating }
      ]
    };
  }


  // 估算不同评分选项的结果
  public static estimate(recall: Recall, now: Date = new Date()): SchedulingCards {
    const result: SchedulingCards = {
      again: FSRS.evaluate({ ...recall }, CardRating.AGAIN, now),
      hard: FSRS.evaluate({ ...recall }, CardRating.HARD, now),
      good: FSRS.evaluate({ ...recall }, CardRating.GOOD, now),
      easy: FSRS.evaluate({ ...recall }, CardRating.EASY, now)
    };
    return result;
  }


  // 延迟到指定的天数后复习，返回更新后的Recall对象,只更新schedule字段
  public static postpone(recall: Recall, days: number): Recall {
    if (days < 0) {
      throw new Error("Days must be a non-negative number");
    }
    const now = new Date();
    const currentDue = recall.due ? new Date(recall.due) : now;
    const newDue = new Date(currentDue.getTime() + days * 24 * 60 * 60 * 1000);
    const newSchedule = new Date(Math.max(now.getTime(), newDue.getTime()));
    return {
      ...recall,
      schedule: newSchedule.toISOString(),
      last_review: now.toISOString()
    };
  }


  // 标记卡片为已掌握,把复习时间推迟到一年后
  private static masterCard(recall: Recall, now: Date): Recall {
    const nowUTC = new Date(now.toUTCString());
    const oneYearLater = new Date(nowUTC.getTime() + 365 * 24 * 60 * 60 * 1000);
    return {
      ...recall,
      state: CardState.MASTERED,
      due: oneYearLater.toISOString(),
      retrievability: 1,
      schedule: oneYearLater.toISOString(),
      last_review: nowUTC.toISOString(),
      review_logs: [
        ...(recall.review_logs || []),
        { date: nowUTC.toISOString(), rating: CardRating.MASTER }
      ]
    };
  }


  // 计算可提取性
  public static retrievability(recall: Recall, now: Date = new Date()): number {
    if (recall.state !== CardState.REVIEW) {
      return 0;
    }
    const lastReview = recall.last_review ? new Date(recall.last_review) : now;
    const elapsedDays = (now.getTime() - lastReview.getTime()) / (24 * 60 * 60 * 1000);
    return FSRS.forgettingCurve(elapsedDays, recall.stability || 0.1);
  }

  // 计算短期稳定性
  private static shortTermStability(stability: number, rating: CardRating): number {
    return stability * Math.exp(FSRS.w[17] * (rating - 3 + FSRS.w[18]));
  }


  // 生成记忆衰减曲线数据
  public static memoryDecayCurve(stability: number = 0.1, days: number = 30): { day: number; retention: number }[] {
    const curve: { day: number; retention: number }[] = [];
    const now = new Date();
    const startStability = stability;
    for (let day = 0; day <= days; day++) {
      const elapsedDays = day;
      const retention = day === 0 ? 1 : FSRS.forgettingCurve(elapsedDays, startStability);
      curve.push({ day, retention });
    }
    return curve;
  }


  // 初始化难度
  private static initDifficulty(r: CardRating): number {
    return Math.min(Math.max(FSRS.w[4] - FSRS.w[5] * (r - 3), 1), 10);
  }


  // 初始化稳定性
  private static initStability(r: CardRating): number {
    return Math.max(FSRS.w[r - 1], 0.1);
  }


  // 计算下一个间隔
  private static nextInterval(s: number): number {
    const intervalDays = s / FSRS.FACTOR * (Math.pow(FSRS.targetRetention, 1 / FSRS.DECAY) - 1);
    const boundedDays = Math.min(Math.max(intervalDays, 1), 36500);
    return boundedDays * 24 * 60;  // 转换为分钟返回
  }

  // 遗忘曲线
  private static forgettingCurve(elapsedDays: number, stability: number): number {
    return Math.pow(1 + FSRS.FACTOR * elapsedDays / stability, FSRS.DECAY);
  }


  // 均值回归
  private static meanReversion(init: number, current: number): number {
    return FSRS.w[7] * init + (1 - FSRS.w[7]) * current;
  }


  // 计算下一个难度
  private static nextDifficulty(d: number, r: CardRating): number {
    const nextD = d - FSRS.w[6] * (r - 3);
    return Math.min(Math.max(FSRS.meanReversion(FSRS.w[4], nextD), 1), 10);
  }


  // 计算下一个回忆稳定性
  private static nextRecallStability(d: number, s: number, r: number, rating: CardRating): number {
    const hardPenalty = rating === CardRating.HARD ? FSRS.w[15] : 1;
    const easyBonus = rating === CardRating.EASY ? FSRS.w[16] : 1;
    return s * (1 + Math.exp(FSRS.w[8]) * (11 - d) * Math.pow(s, -FSRS.w[9]) *
      (Math.exp((1 - r) * FSRS.w[10]) - 1) * hardPenalty * easyBonus);
  }


  // 计算下一个遗忘稳定性
  private static nextForgetStability(d: number, s: number, r: number): number {
    return FSRS.w[11] * Math.pow(d, -FSRS.w[12]) * (Math.pow(s + 1, FSRS.w[13]) - 1) * Math.exp((1 - r) * FSRS.w[14]);
  }


  // 学习步骤
  private static learningSteps(rating: CardRating): number {
    switch (rating) {
      case CardRating.AGAIN: return 5;    // 直接返回分钟数
      case CardRating.HARD: return 10;    // 直接返回分钟数
      default: return 24 * 60;            // 一天的分钟数
    }
  }
}

export default FSRS;