// @/pages/ProfilePage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@/context/PageContext';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Share2,
  Crown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";


function ProfilePage() {
  const { navigateTo } = usePage();

  // 模拟用户数据
  const userData = {
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=1234",
    name: "知识探索者",
    bio: "在学习中探索，在探索中成长",
    memberLevel: "黄金会员",
    daysStreak: 42,
    achievements: 12,
  };

  // 模拟知识库数据
  const knowledgeBases = [
    { id: 1, title: "前端开发笔记", count: 156, color: "bg-blue-500" },
    { id: 2, title: "算法练习", count: 89, color: "bg-green-500" },
    { id: 3, title: "设计模式", count: 23, color: "bg-purple-500" },
    { id: 4, title: "产品思维", count: 45, color: "bg-yellow-500" },
    { id: 5, title: "英语学习", count: 234, color: "bg-pink-500" },
    { id: 6, title: "读书笔记", count: 67, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateTo('home')}
        className="mb-4"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      {/* 个人信息区域 */}
      <ScrollArea className='flex flex-col flex-grow max-h-[80vh] px-4' >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full border-4 border-primary/10"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
              <p className="text-muted-foreground text-sm">{userData.bio}</p>
            </div>
          </div>

          {/* 会员等级 */}
          <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-3">
            <Crown className="text-primary w-5 h-5" />
            <span className="text-sm font-medium">{userData.memberLevel}</span>
          </div>
        </motion.div>

        {/* 统计标签页 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Trophy />, label: "达成成就", value: userData.achievements },
            { icon: <Calendar />, label: "学习天数", value: userData.daysStreak },
            { icon: <Share2 />, label: "分享主页", value: "点击查看" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-card rounded-xl p-4",
                "flex flex-col items-center justify-center",
                "cursor-pointer hover:bg-accent transition-colors"
              )}
            >
              <div className="text-primary mb-2">{stat.icon}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="font-medium mt-1">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* 知识库展示 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">我的知识库</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateTo('study')}>
              查看全部 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {knowledgeBases.map((kb, index) => (
              <motion.div
                key={kb.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateTo('study')}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg mb-3 flex items-center justify-center",
                  kb.color
                )}>
                  <span className="text-white font-bold">
                    {kb.title.charAt(0)}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{kb.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {kb.count} 个知识点
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default ProfilePage;