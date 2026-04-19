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