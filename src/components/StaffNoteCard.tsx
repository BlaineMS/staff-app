'use client';

import { StaffNote } from '@/types/notice';
import { formatDistanceToNow } from 'date-fns';

interface StaffNoteCardProps {
  note: StaffNote;
}

export default function StaffNoteCard({ note }: StaffNoteCardProps) {
  const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
    'Kitchen': { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' },
    'Bar': { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b' },
    'Maintenance': { bg: 'rgba(14, 165, 233, 0.2)', border: 'rgba(14, 165, 233, 0.4)', text: '#0ea5e9' },
    'Health & Safety': { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' },
    'General': { bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af' },
  };

  const colors = note.category ? categoryColors[note.category] || categoryColors.General : categoryColors.General;

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{note.author}</span>
          {note.category && (
            <span 
              className="px-2 py-0.5 text-xs font-medium rounded"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              {note.category}
            </span>
          )}
        </div>
        <p className="text-white/60 text-sm">
          {formatDistanceToNow(note.createdAt, { addSuffix: true })}
        </p>
      </div>
      <p className="text-white/90">{note.content}</p>
    </div>
  );
}