export type NoticeCategory = 'Urgent' | 'General' | 'Rota' | 'Health & Safety';

export interface Notice {
  id: string;
  title: string;
  message: string;
  category: NoticeCategory;
  postedBy: string;
  postedAt: Date;
}

export interface StaffMember {
  id: string;
  name: string;
  role?: string;
}

export interface PersonalMessage {
  id: string;
  content: string;
  from: string;
  to: string;
  sentAt: Date;
  read: boolean;
}

export interface StaffNote {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  category?: string;
}