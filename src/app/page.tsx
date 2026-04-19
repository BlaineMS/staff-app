'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NoticeCard from '@/components/NoticeCard';
import { sampleNotices, categories, staffMembers } from '@/data/sampleData';
import { Notice, NoticeCategory } from '@/types/notice';

interface PersonalMessage {
  id: string;
  message: string;
  to: string; // staff member name
  from: string;
  postedAt: Date;
}

interface StaffNote {
  id: string;
  note: string;
  staffName: string;
  postedAt: Date;
}

export default function Home() {
  const [viewMode, setViewMode] = useState<'all-staff' | 'personal'>('all-staff');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [notices, setNotices] = useState(sampleNotices);
  
  // Personal Messages state
  const [selectedStaffForMessages, setSelectedStaffForMessages] = useState<string>('Jake');
  const [newMessage, setNewMessage] = useState('');
  const [messageRecipient, setMessageRecipient] = useState<string>('Jake');
  const [personalMessages, setPersonalMessages] = useState<PersonalMessage[]>([
    { id: '1', message: 'Don\'t forget your cellar key tomorrow', to: 'Jake', from: 'Blaine', postedAt: new Date() },
    { id: '2', message: 'Great shift last night, thanks for staying late', to: 'Sarah', from: 'Blaine', postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '3', message: 'Please check the stock list before your shift', to: 'Tom', from: 'Blaine', postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ]);
  
  // Staff Notes state
  const [selectedStaffForNotes, setSelectedStaffForNotes] = useState<string>('Jake');
  const [newNote, setNewNote] = useState('');
  const [staffNotes, setStaffNotes] = useState<StaffNote[]>([
    { id: '1', note: 'Fridge in cellar making noise, may need looking at', staffName: 'Tom', postedAt: new Date() },
    { id: '2', note: 'Had a great shift, Friday was busy!', staffName: 'Chloe', postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '3', note: 'Back door lock is sticking, needs oil', staffName: 'Dan', postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ]);

  const filteredNotices = selectedCategory === 'All' 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory);
    
  const filteredMessages = personalMessages.filter(msg => msg.to === selectedStaffForMessages);
  
  // Get last 3 staff notes for the mini feed
  const recentStaffNotes = staffNotes.slice(0, 3);

  const handleDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(notice => notice.id !== id));
  };

  const handleAddNotice = () => {
    const newNotice: Notice = {
      id: Date.now().toString(),
      title: 'New Notice',
      message: 'This is a new notice added via the button.',
      category: 'General',
      postedBy: 'Blaine',
      postedAt: new Date(),
    };
    setNotices(prev => [newNotice, ...prev]);
  };
  
  const handleAddMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: PersonalMessage = {
      id: Date.now().toString(),
      message: newMessage,
      to: messageRecipient,
      from: 'Blaine',
      postedAt: new Date(),
    };
    
    setPersonalMessages(prev => [newMsg, ...prev]);
    setNewMessage('');
  };
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const newStaffNote: StaffNote = {
      id: Date.now().toString(),
      note: newNote,
      staffName: selectedStaffForNotes,
      postedAt: new Date(),
    };
    
    setStaffNotes(prev => [newStaffNote, ...prev]);
    setNewNote('');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Notice Board</h1>
            <p className="text-white/60">The Catherine Wheel • Stay updated with important announcements</p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border-b border-white/10 mb-8">
            <button
              onClick={() => setViewMode('all-staff')}
              className={`px-6 py-3 font-medium transition-all ${
                viewMode === 'all-staff'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All Staff
            </button>
            <button
              onClick={() => setViewMode('personal')}
              className={`px-6 py-3 font-medium transition-all ${
                viewMode === 'personal'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Personal
            </button>
          </div>

          {/* Main Content Area */}
          <div className="mb-12">
            {viewMode === 'all-staff' ? (
              <>
                {/* Notice Board Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground border border-primary/50'
                            : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* New Notice Button */}
                  <button
                    onClick={handleAddNotice}
                    className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                    }}
                  >
                    + New Notice
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Total Notices</p>
                    <p className="text-2xl font-bold text-white">{notices.length}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Urgent</p>
                    <p className="text-2xl font-bold text-destructive">
                      {notices.filter(n => n.category === 'Urgent').length}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Active Staff</p>
                    <p className="text-2xl font-bold text-secondary">7</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">This Week</p>
                    <p className="text-2xl font-bold text-accent">
                      {notices.filter(n => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return n.postedAt > weekAgo;
                      }).length}
                    </p>
                  </div>
                </div>

                {/* Notices Grid */}
                {filteredNotices.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredNotices.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onDelete={handleDeleteNotice}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">📋</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No notices found</h3>
                    <p className="text-white/60 max-w-md mx-auto">
                      {selectedCategory === 'All' 
                        ? 'No notices have been posted yet. Create the first one!'
                        : `No ${selectedCategory.toLowerCase()} notices found. Try a different category.`}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Personal Messages View */
              <div className="space-y-8">
                {/* View Messages Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white mb-4">Personal Messages</h2>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-white/70 text-sm mb-2">Select your name to view messages:</label>
                      <select
                        value={selectedStaffForMessages}
                        onChange={(e) => setSelectedStaffForMessages(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                      >
                        {staffMembers.filter(m => m.name !== 'Blaine').map((staff) => (
                          <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredMessages.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMessages.map((msg) => (
                        <div key={msg.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-primary font-medium">{msg.from}</span>
                              <span className="text-white/60 mx-2">→</span>
                              <span className="text-secondary font-medium">{msg.to}</span>
                            </div>
                            <span className="text-white/40 text-sm">
                              {msg.postedAt.toLocaleDateString()} {msg.postedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-white">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">💬</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No messages for {selectedStaffForMessages}</h3>
                      <p className="text-white/60">You have no personal messages yet.</p>
                    </div>
                  )}
                </div>

                {/* Send Message Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white mb-4">Send Personal Message</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">To:</label>
                      <select
                        value={messageRecipient}
                        onChange={(e) => setMessageRecipient(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                      >
                        {staffMembers.filter(m => m.name !== 'Blaine').map((staff) => (
                          <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Message:</label>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your personal message here..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary min-h-[120px]"
                      />
                    </div>
                    <button
                      onClick={handleAddMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Bottom Section - Staff Notes */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 p-6 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Recent Notes Feed */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-4">Recent Staff Notes</h2>
                  {recentStaffNotes.length > 0 ? (
                    <div className="space-y-3">
                      {recentStaffNotes.map((note) => (
                        <div key={note.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary text-xs font-bold">{note.staffName.charAt(0)}</span>
                              </div>
                              <span className="text-white text-sm font-medium">{note.staffName}</span>
                            </div>
                            <span className="text-white/40 text-xs">
                              {note.postedAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-white/60 text-sm">No staff notes yet. Be the first to post!</p>
                    </div>
                  )}
                </div>

                {/* Post Note Form */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-4">Post Staff Note</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Your Name:</label>
                      <select
                        value={selectedStaffForNotes}
                        onChange={(e) => setSelectedStaffForNotes(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary text-sm"
                      >
                        {staffMembers.filter(m => m.name !== 'Blaine').map((staff) => (
                          <option key={staff.id} value={staff.name}>{staff.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Note:</label>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Share a quick note about your shift..."
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary min-h-[80px] text-sm"
                      />
                    </div>
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="px-4 py-2 rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        border: '1px solid rgba(139