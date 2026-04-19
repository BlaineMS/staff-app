import { Notice, StaffMember, NoticeCategory } from '@/types/notice';

export const staffMembers: StaffMember[] = [
  { id: '1', name: 'Jake' },
  { id: '2', name: 'Sarah' },
  { id: '3', name: 'Tom' },
  { id: '4', name: 'Chloe' },
  { id: '5', name: 'Dan' },
  { id: '6', name: 'Emma' },
  { id: '7', name: 'Blaine' },
];

export const sampleNotices: Notice[] = [
  {
    id: '1',
    title: 'Cellar Temperature Check',
    message: 'Please check cellar temp at start of each shift and log in the book.',
    category: 'Health & Safety',
    postedBy: 'Blaine',
    postedAt: new Date(),
  },
  {
    id: '2',
    title: 'Friday Night Rota Change',
    message: 'Jake and Sarah swapped shifts this Friday. Jake now on 6pm-close.',
    category: 'Rota',
    postedBy: 'Blaine',
    postedAt: new Date(),
  },
  {
    id: '3',
    title: 'New Cocktail Menu',
    message: 'New summer cocktail menu goes live Saturday. Please review before your shift.',
    category: 'General',
    postedBy: 'Blaine',
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
  },
  {
    id: '4',
    title: 'Gas Safety Inspection',
    message: 'Gas safety inspection Monday 9am. Engineer will need access to cellar.',
    category: 'Urgent',
    postedBy: 'Blaine',
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
  },
  {
    id: '5',
    title: 'Staff Meeting',
    message: 'Monthly staff meeting Tuesday 3pm before opening. Attendance required.',
    category: 'General',
    postedBy: 'Blaine',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

export const categories: (NoticeCategory | 'All')[] = ['All', 'Urgent', 'General', 'Rota', 'Health & Safety'];