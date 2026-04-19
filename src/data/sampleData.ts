import { Notice, StaffMember, NoticeCategory, PersonalMessage, StaffNote } from '@/types/notice';

export const staffMembers: StaffMember[] = [
  { id: '1', name: 'Tracy' },
  { id: '2', name: 'Sacha' },
  { id: '3', name: 'Kylie' },
  { id: '4', name: 'Ella' },
  { id: '5', name: 'Nick' },
  { id: '6', name: 'Tom' },
  { id: '7', name: 'Becca' },
  { id: '8', name: 'Kim' },
  { id: '9', name: 'Col' },
  { id: '10', name: 'Blaine' },
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

export const samplePersonalMessages: PersonalMessage[] = [
  {
    id: 'pm1',
    content: 'Tracy, can you open 30 minutes early tomorrow? We have a private booking arriving at 11:30am.',
    from: 'Blaine',
    to: 'Tracy',
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
  },
  {
    id: 'pm2',
    content: 'Sacha, please remember to check the cellar temperature at the start of your shift and log it.',
    from: 'Blaine',
    to: 'Sacha',
    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
  },
  {
    id: 'pm3',
    content: 'Kylie, the new cocktail menu training is at 2pm today. Please arrive 15 minutes early.',
    from: 'Blaine',
    to: 'Kylie',
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: 'pm4',
    content: 'Reminder: staff meeting tomorrow at 3pm. Attendance is required.',
    from: 'Blaine',
    to: 'All Staff',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
  },
  {
    id: 'pm5',
    content: 'Ella, can you take over the stock count this week? The sheets are in the office.',
    from: 'Blaine',
    to: 'Ella',
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false,
  },
  {
    id: 'pm6',
    content: 'Nick, the gas safety inspection is Monday at 9am. Please ensure the cellar is accessible.',
    from: 'Blaine',
    to: 'Nick',
    sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
  },
  {
    id: 'pm7',
    content: 'Tom, your shift on Friday has been extended by 1 hour. Please confirm if this works for you.',
    from: 'Blaine',
    to: 'Tom',
    sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: false,
  },
  {
    id: 'pm8',
    content: 'Becca, the health inspector will be here Thursday. Please review the food safety checklist.',
    from: 'Blaine',
    to: 'Becca',
    sentAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    read: true,
  },
  {
    id: 'pm9',
    content: 'Kim, we need to order more IPA glasses. Can you check with the supplier and get a quote?',
    from: 'Blaine',
    to: 'Kim',
    sentAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
    read: false,
  },
  {
    id: 'pm10',
    content: 'Col, the beer lines need cleaning before the weekend rush. Please schedule this for Friday morning.',
    from: 'Blaine',
    to: 'Col',
    sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    read: true,
  },
];

export const sampleStaffNotes: StaffNote[] = [
  {
    id: 'sn1',
    content: 'The coffee machine needs descaling. Order more descaler.',
    author: 'Kim',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    category: 'Kitchen',
  },
  {
    id: 'sn2',
    content: 'Front door lock is sticking. Needs WD-40.',
    author: 'Tracy',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    category: 'Maintenance',
  },
  {
    id: 'sn3',
    content: 'Running low on IPA glasses. Check with supplier.',
    author: 'Sacha',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    category: 'Bar',
  },
  {
    id: 'sn4',
    content: 'New cocktail recipes printed and in the folder.',
    author: 'Kylie',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: 'Bar',
  },
  {
    id: 'sn5',
    content: 'Fire extinguisher inspection due next week.',
    author: 'Blaine',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    category: 'Health & Safety',
  },
];

export const categories: (NoticeCategory | 'All')[] = ['All', 'Urgent', 'General', 'Rota', 'Health & Safety'];