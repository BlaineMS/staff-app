'use client';

import { Notice } from '@/types/notice';
import { format } from 'date-fns';

interface NoticeCardProps {
  notice: Notice;
}

const categoryColors: Record<Notice['category'], { bg: string; border: string; text: string }> = {
  'Urgent': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' },
  'General': { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)', text: '#8b5cf6' },
  'Rota': { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: '#10b981' },
  'Health & Safety': { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b' },
};

export default function NoticeCard({ notice }: NoticeCardProps) {
  const colors = categoryColors[notice.category];
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div 
      className="relative p-6 rounded-2xl backdrop-blur-sm border animate-fade-in"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: '1px',
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
            {notice.title}
          </h3>
          <p className="text-white/80 mb-4 leading-relaxed">
            {notice.message}
          </p>
        </div>

      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Posted by</span>
            <span className="font-medium text-white">{notice.postedBy}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">•</span>
            <span className="text-white/60 text-sm">{formatTimeAgo(notice.postedAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span 
            className="px-3 py-1 rounded text-sm font-medium"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {notice.category}
          </span>
        </div>
      </div>
    </div>
  );
}