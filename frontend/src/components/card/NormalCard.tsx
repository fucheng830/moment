import React from 'react';
import { Note } from '@/types/note_model';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Eye, Heart } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface NormalCardProps {
  note: Note;
}

export const NormalCard: React.FC<NormalCardProps> = ({
  note,
}) => {
  // 生成随机数，最大为999
  const getRandomNumber = () => Math.min(Math.floor(Math.random() * 1500), 999);
  
  // 生成随机用户ID (5位字母数字组合)
  const generateUserId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(5)
      .fill(null)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  };
  
  const views = getRandomNumber();
  const likes = getRandomNumber();
  const userId = generateUserId();
  
  // 格式化显示数字
  const formatNumber = (num: number) => num > 999 ? '999+' : num.toString();

  return (
    <div className="flex flex-col h-full bg-card select-none rounded-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {note.category_name && (
              <span className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600">
                {note.category_name}
              </span>
            )}
            {note.unit && (
              <span className="px-2 py-1 text-xs bg-blue-50 rounded-full text-blue-600">
                {note.unit}
              </span>
            )}
          </div>
        </div>

        {note.title && (
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            {note.title}
          </h2>
        )}

        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: note.html_text || '' }}
        />
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">评论</span>
          </button>
          <div className="flex items-center gap-1 text-gray-500">
            <Eye className="h-4 w-4" />
            <span className="text-xs">{formatNumber(views)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{formatNumber(likes)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">
              {userId.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};