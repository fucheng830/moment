// @/pages/SocialPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle, Heart, Bell,X} from 'lucide-react';

// 首先添加一些新的类型定义
interface Topic {
  id: string;
  name: string;
  category: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  obtainedAt: Date;
}

// 扩展 User 接口
interface User {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  color: string;
  topics: Topic[];
  badges: Badge[];
}
// 添加通知类型接口
interface Notification {
  id: string;
  username: string;
  type: 'follow';
  timestamp: Date;
  read: boolean;
}


// 生成随机用户数据
const generateMockUsers = (count: number): User[] => {
  const roles = [
    'AI探索家', '代码艺术家', '跨界创新者',
    '科技哲学家', '文化观察家', '创意设计师',
    '数据诗人', '未来主义者', '认知科学家',
    '全栈工程师', '产品设计师', '数据科学家',
    '游戏开发者', '机器学习专家', '区块链研究员',
    '交互设计师', '云架构师', '安全专家',
    'DevOps工程师', '前端专家', '后端大师',
    '算法工程师', '系统架构师', 'UI设计师',
    '开源贡献者', '技术布道师', '创新思考者',
    '敏捷教练', '产品经理', '创业者',
    '研究学者', '技术作家', '社区运营',
    '知识传播者', '终身学习者', '数字游民'
  ];

  const names = [
    'Alex', 'Sarah', 'Mike', 'Emma', 'Chris',
    'Linda', 'David', 'Sophie', 'James', 'Luna',
    'Thomas', 'Olivia', 'William', 'Ava', 'Henry',
    'Isabella', 'Jack', 'Mia', 'Daniel', 'Grace',
    'Lucas', 'Chloe', 'Max', 'Lily', 'Noah',
    'Sophia', 'Leo', 'Zoe', 'Ethan', 'Harper'
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEEAD', '#D4A5A5',
    '#9B89B3', '#FF9999', '#77DD77',
    '#FFB347', '#87CEEB', '#DDA0DD',
    '#B19CD9', '#FF6B6B', '#98FB98',
    '#DEB887', '#87CEFA', '#FFA07A',
    '#F0E68C', '#E6E6FA', '#90EE90'
  ];
  const mockTopics = [
    { id: 't1', name: '人工智能', category: 'tech' },
    { id: 't2', name: '机器学习', category: 'tech' },
    { id: 't3', name: '深度学习', category: 'tech' },
    { id: 't4', name: 'Web3.0', category: 'tech' },
    { id: 't5', name: '元宇宙', category: 'tech' },
    { id: 't6', name: '区块链', category: 'tech' },
    { id: 't7', name: '数据科学', category: 'tech' },
    { id: 't8', name: '云计算', category: 'tech' },
  ];

  const mockBadges = [
    { id: 'b1', name: '知识探索者', icon: '🎯', description: '关注10个知识领域', obtainedAt: new Date() },
    { id: 'b2', name: '深度学习者', icon: '📚', description: '完成30天连续学习', obtainedAt: new Date() },
    { id: 'b3', name: '社区贡献者', icon: '🌟', description: '发表10篇高质量文章', obtainedAt: new Date() },
    { id: 'b4', name: '创新先锋', icon: '💡', description: '提出3个创新想法', obtainedAt: new Date() },
    { id: 'b5', name: '互动达人', icon: '🤝', description: '与100位用户互动', obtainedAt: new Date() },
  ];


  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const radius = 150 + Math.random() * 100;

    return {
      id: `user-${i}`,
      name: names[Math.floor(Math.random() * names.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      // 添加随机话题和徽章
      topics: [...mockTopics].sort(() => Math.random() - 0.5).slice(0, 3),
      badges: [...mockBadges].sort(() => Math.random() - 0.5).slice(0, 3),
    };
  });
};


const SocialPage: React.FC = () => {
  const [users] = useState(() => generateMockUsers(20));
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * 1000) + 500);
  const [rotation, setRotation] = useState(0);
  // 添加新的状态
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return prev + change;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);

    return () => clearInterval(rotateInterval);
  }, []);

  // 添加模拟通知的 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      const mockUser = users[Math.floor(Math.random() * users.length)];
      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        username: mockUser.name,
        type: 'follow',
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
      setUnreadCount(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [users]);

  // 处理关注的函数
  const handleFollow = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      {/* 顶部按钮 */}
      <div className="absolute top-4 left-0 z-10 w-full px-4 flex justify-end">


        {/* 添加通知按钮 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="bg-background/50 backdrop-blur-sm"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* 通知弹窗 */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 right-0 w-64 bg-card/80 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 p-2 space-y-2"
              >
                {notifications.length === 0 ? (
                  <div className="text-sm text-center py-4 text-muted-foreground">
                    暂无通知
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="p-2 rounded-md bg-background/50 space-y-2"
                    >
                      <div className="text-sm">
                        <span className="font-semibold">{notification.username}</span>
                        {' '}开始关注你啦
                      </div>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleFollow(notification.id)}
                        >
                          回关
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 大脑网络可视化 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[400px] h-[400px]"
          style={{ rotate: rotation }}
        >
          {/* 背景圆环 */}
          <div className="absolute inset-0 border-2 border-muted rounded-full opacity-20" />

          {/* 用户节点 */}
          {users.map((user) => (
            <motion.div
              key={user.id}
              className="absolute w-4 h-4 -translate-x-2 -translate-y-2 cursor-pointer"
              style={{
                left: `${user.x + 200}px`,
                top: `${user.y + 200}px`,
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveUser(user)}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs opacity-70"
                style={{ transform: `rotate(${-rotation}deg)` }}
              >
                {user.role}
              </div>
            </motion.div>
          ))}

          {/* 连接线 */}
          <svg className="absolute inset-0 pointer-events-none">
            {users.map((user1, i) =>
              users.slice(i + 1).map((user2, j) => {
                const distance = Math.sqrt(
                  Math.pow(user1.x - user2.x, 2) +
                  Math.pow(user1.y - user2.y, 2)
                );
                if (distance > 200) return null;

                return (
                  <line
                    key={`${user1.id}-${user2.id}`}
                    x1={user1.x + 200}
                    y1={user1.y + 200}
                    x2={user2.x + 200}
                    y2={user2.y + 200}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="opacity-10"
                  />
                );
              })
            )}
          </svg>
        </motion.div>
      </div>

      {/* 用户卡片 */}
      {/* 用户卡片 */}
      <AnimatePresence>
        {activeUser && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-4 top-4 
                bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg z-20
                border border-border/50 w-[360px]"
          >
            {/* 关闭按钮 */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2"
              onClick={() => setActiveUser(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* 用户基本信息 */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: activeUser.color }}
              />
              <div>
                <h3 className="text-lg font-semibold">{activeUser.name}</h3>
                <p className="text-sm text-muted-foreground">{activeUser.role}</p>
              </div>
            </div>

            {/* 操作按钮组 */}
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                发消息
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* 关注的知识话题 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">关注的知识话题</h4>
              <div className="flex flex-wrap gap-2">
                {activeUser.topics.map(topic => (
                  <div
                    key={topic.id}
                    className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {topic.name}
                  </div>
                ))}
              </div>
            </div>

            {/* 成就徽章 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">获得的成就</h4>
              <div className="space-y-2">
                {activeUser.badges.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <div className="text-xl">{badge.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部在线人数 */}
      <div className="absolute bottom-8 left-0 w-full text-center text-sm text-muted-foreground">
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          当前在线：{onlineCount} 人
        </motion.div>
      </div>
    </div >
  );
};

export default SocialPage;