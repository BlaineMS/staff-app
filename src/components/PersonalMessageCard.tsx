'use client';

import { PersonalMessage } from '@/types/notice';
import { formatDistanceToNow } from 'date-fns';

interface PersonalMessageCardProps {
  message: PersonalMessage;
  onToggle?: (id: string) => void;
}

export default function PersonalMessageCard({ message, onToggle }: PersonalMessageCardProps) {
  const handleCheckboxClick = () => {
    if (onToggle) {
      onToggle(message.id);
    }
  };

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${message.read ? 'bg-white/5 border-white/10' : 'bg-primary/10 border-primary/30'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{message.from}</span>
            <span className="text-white/40">→</span>
            <span className="font-medium text-white">{message.to}</span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            {formatDistanceToNow(message.sentAt, { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={handleCheckboxClick}
          className="flex-shrink-0 w-6 h-6 rounded-full border border-white/40 flex items-center justify-center transition-all hover:border-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={message.read ? "Mark as unread" : "Mark as read"}
        >
          {message.read && (
            <svg 
              className="w-3.5 h-3.5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </button>
      </div>
      <p className="text-white/90">{message.content}</p>
    </div>
  );
}