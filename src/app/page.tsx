'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NoticeCard from '@/components/NoticeCard';
import PersonalMessageCard from '@/components/PersonalMessageCard';
import Tasks from '@/components/Tasks';
import Stock from '@/components/Stock';
import Events from '@/components/Events';
import { sampleNotices, categories, samplePersonalMessages, staffMembers } from '@/data/sampleData';
import { Notice, NoticeCategory, PersonalMessage } from '@/types/notice';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'notice-board' | 'tasks' | 'stock' | 'events'>('notice-board');
  const [viewMode, setViewMode] = useState<'all-staff' | 'personal'>('all-staff');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [notices, setNotices] = useState(sampleNotices);
  const [personalMessages, setPersonalMessages] = useState<PersonalMessage[]>(samplePersonalMessages);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    message: '',
    category: 'General' as NoticeCategory,
    postedBy: 'Blaine',
  });
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const handleToggleMessageRead = (messageId: string) => {
    setPersonalMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, read: !message.read } : message
    ));
  };

  const filteredNotices = selectedCategory === 'All' 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory);



  const handleOpenNoticeForm = () => {
    setShowNoticeForm(true);
  };

  const handleCloseNoticeForm = () => {
    setShowNoticeForm(false);
    setNewNotice({
      title: '',
      message: '',
      category: 'General',
      postedBy: 'Blaine',
    });
  };

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.message.trim()) {
      return; // Don't add empty notices
    }

    const noticeToAdd: Notice = {
      id: Date.now().toString(),
      title: newNotice.title,
      message: newNotice.message,
      category: newNotice.category,
      postedBy: newNotice.postedBy,
      postedAt: new Date(),
    };
    
    setNotices(prev => [noticeToAdd, ...prev]);
    handleCloseNoticeForm();
  };

  const handleFormChange = (field: keyof typeof newNotice, value: string) => {
    setNewNotice(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as 'notice-board' | 'tasks' | 'stock' | 'events')} />
      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">


          {activeTab === 'notice-board' ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Notice Board</h1>
                <p className="text-white/60">The Catherine Wheel • Stay updated with important announcements</p>
              </div>

              {/* Category Key */}
              <div className="mb-6 flex flex-nowrap items-center gap-2 overflow-x-auto pb-2">
                <span className="text-white/70 text-sm mr-2">Category Key:</span>
                <div className="flex flex-nowrap gap-2">
                  <span 
                    className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    Urgent
                  </span>
                  <span 
                    className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                    }}
                  >
                    General
                  </span>
                  <span 
                    className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    Rota
                  </span>
                  <span 
                    className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                    }}
                  >
                    Health & Safety
                  </span>
                </div>
              </div>

              <div className="flex border-b border-white/10 mb-8">
                <button
                  onClick={() => setViewMode('all-staff')}
                  className={`px-6 py-3 font-medium transition-all ${
                    viewMode === 'all-staff' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white'
                  }`}
                >
                  All Staff
                </button>
                <button
                  onClick={() => setViewMode('personal')}
                  className={`px-6 py-3 font-medium transition-all ${
                    viewMode === 'personal' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Personal
                </button>
              </div>

          <div className="mb-12">
            {viewMode === 'all-staff' ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground border border-primary/50'
                            : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleOpenNoticeForm}
                    className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                    }}
                  >
                    + New Notice
                  </button>
                </div>

                {showNoticeForm && (
                  <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Create New Notice</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Title</label>
                        <input
                          type="text"
                          value={newNotice.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter notice title"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">Message</label>
                        <textarea
                          value={newNotice.message}
                          onChange={(e) => handleFormChange('message', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                          placeholder="Enter notice message"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Category</label>
                          <select
                            value={newNotice.category}
                            onChange={(e) => handleFormChange('category', e.target.value as NoticeCategory)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {categories.filter(cat => cat !== 'All').map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-white/70 text-sm mb-2">Posted By</label>
                          <select
                            value={newNotice.postedBy}
                            onChange={(e) => handleFormChange('postedBy', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {staffMembers.map((staff) => (
                              <option key={staff.id} value={staff.name}>
                                {staff.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleAddNotice}
                          disabled={!newNotice.title.trim() || !newNotice.message.trim()}
                          className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                          }}
                        >
                          Post Notice
                        </button>
                        
                        <button
                          onClick={handleCloseNoticeForm}
                          className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95"
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {filteredNotices.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredNotices.map((notice) => (
                      <NoticeCard key={notice.id} notice={notice} />
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
              <>
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Messages from Blaine</h2>
                      <p className="text-white/60">Select your name to view messages from Blaine</p>
                    </div>
                  </div>

                  {/* Staff selection pills */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {staffMembers
                      .filter(staff => staff.name !== 'Blaine') // Exclude Blaine from selection
                      .map((staff) => {
                        // Assign unique colors for each staff member
                        const colorMap: Record<string, { bg: string, border: string, text: string }> = {
                          'Tracy': { bg: 'rgba(147, 51, 234, 0.2)', border: 'rgba(147, 51, 234, 0.6)', text: '#a855f7' }, // purple
                          'Sacha': { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.6)', text: '#ef4444' }, // red
                          'Kylie': { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.6)', text: '#22c55e' }, // green
                          'Ella': { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.6)', text: '#3b82f6' }, // blue
                          'Nick': { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.6)', text: '#ec4899' }, // pink
                          'Tom': { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.6)', text: '#f97316' }, // orange (keep existing)
                          'Becca': { bg: 'rgba(20, 184, 166, 0.2)', border: 'rgba(20, 184, 166, 0.6)', text: '#14b8a6' }, // teal
                          'Kim': { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.6)', text: '#f59e0b' }, // amber
                          'Col': { bg: 'rgba(99, 102, 241, 0.2)', border: 'rgba(99, 102, 241, 0.6)', text: '#6366f1' }, // indigo
                        };
                        
                        const colors = colorMap[staff.name] || { bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.3)', text: '#ffffff' };
                        
                        return (
                          <button
                            key={staff.id}
                            onClick={() => setSelectedStaff(staff.name === selectedStaff ? null : staff.name)}
                            className={`px-5 py-2.5 rounded text-base font-medium transition-all ${
                              selectedStaff === staff.name ? 'scale-105 shadow-md' : 'hover:scale-102 hover:shadow-sm'
                            }`}
                            style={{
                              background: colors.bg,
                              border: `1.5px solid ${colors.border}`,
                              color: colors.text,
                            }}
                          >
                            {staff.name}
                          </button>
                        );
                      })}
                  </div>

                  {!selectedStaff ? (
                    <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">Select Your Name</h3>
                      <p className="text-white/60 max-w-md mx-auto text-lg">
                        Click on your name pill above to view messages from Blaine
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Personal Messages Section */}
                      <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Messages from Blaine to {selectedStaff}</h2>
                            <p className="text-white/60">Messages from Blaine to {selectedStaff}</p>
                          </div>
                          <div className="px-4 py-2 rounded bg-white/5 border border-white/10">
                            <span className="text-white font-medium">
                              {personalMessages.filter(m => m.from === 'Blaine' && (m.to === selectedStaff || m.to === 'All Staff') && !m.read).length} unread
                            </span>
                          </div>
                        </div>

                        {personalMessages.filter(m => m.from === 'Blaine' && (m.to === selectedStaff || m.to === 'All Staff')).length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {personalMessages
                              .filter(m => m.from === 'Blaine' && (m.to === selectedStaff || m.to === 'All Staff'))
                              .map((message) => (
                                <PersonalMessageCard 
                                  key={message.id} 
                                  message={message} 
                                  onToggle={handleToggleMessageRead}
                                />
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                              <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No messages from Blaine</h3>
                            <p className="text-white/60 max-w-md mx-auto">
                              {selectedStaff} doesn't have any messages from Blaine yet.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-white/40 text-sm">
                          Click the checkbox in the top-right corner to mark messages as read/unread.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>



              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white/40 text-sm">
                  Staff Notice Board • The Catherine Wheel • {new Date().getFullYear()}
                </p>
                <p className="text-white/30 text-xs mt-2">
                  View: {viewMode} • Notices: {filteredNotices.length}
                </p>
              </div>
            </>
          ) : activeTab === 'tasks' ? (
            <Tasks />
          ) : activeTab === 'stock' ? (
            <Stock />
          ) : (
            <Events />
          )}
        </div>
      </main>
    </div>
  );
}