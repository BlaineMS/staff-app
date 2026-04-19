'use client';

import { useState, useEffect } from 'react';
import { Event, EventType } from '@/types/event';
import { sampleEvents, eventTypes, getEventTypeConfig } from '@/data/sampleEvents';

interface DayEvents {
  date: Date;
  events: Event[];
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  date: Date;
}

const EventDetailsModal = ({ isOpen, onClose, events, date }: EventDetailsModalProps) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Events for {formatDate(date)}</h2>
              <p className="text-white/60 mt-1">{events.length} event{events.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {events.map((event) => {
              const typeConfig = getEventTypeConfig(event.type);
              return (
                <div key={event.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap"
                          style={{
                            backgroundColor: typeConfig.color.bg,
                            color: typeConfig.color.text,
                            border: `1px solid ${typeConfig.color.border}`,
                          }}
                        >
                          {typeConfig.label}
                        </span>
                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      </div>
                      <p className="text-white/70 text-sm">
                        {event.startTime} - {event.endTime} • {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {event.notes && (
                      <div>
                        <p className="text-white/50 text-sm mb-1">Notes</p>
                        <p className="text-white/80">{event.notes}</p>
                      </div>
                    )}

                    {event.setupConditions && (
                      <div>
                        <p className="text-white/50 text-sm mb-1">Setup Conditions</p>
                        <p className="text-white/80">{event.setupConditions}</p>
                      </div>
                    )}

                    {event.staffNotes && (
                      <div>
                        <p className="text-white/50 text-sm mb-1">Staff Notes</p>
                        <p className="text-white/80">{event.staffNotes}</p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-2 text-sm">
                      {event.organizer && (
                        <span className="text-white/60">Organizer: {event.organizer}</span>
                      )}
                      {event.attendees && (
                        <span className="text-white/60">Attendees: {event.attendees}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: '1px solid rgba(139, 92, 246, 0.4)',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [eventsByDay, setEventsByDay] = useState<DayEvents[]>([]);
  const [monthEvents, setMonthEvents] = useState<Event[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    type: 'own-event' as EventType,
    startTime: '19:00',
    endTime: '22:00',
    notes: '',
    setupConditions: '',
    staffNotes: '',
    location: '',
    organizer: 'Blaine',
    attendees: 0,
  });

  // Get month name and year
  const monthName = currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Get days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      return new Date(year, month - 1, day);
    });
    
    // Get days in current month
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1);
    });
    
    // Get days from next month
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDaysCount = totalCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => {
      return new Date(year, month + 1, i + 1);
    });
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Filter events for current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthEvents = events.filter(event => {
      const eventDate = event.date;
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
    
    setMonthEvents(monthEvents);
    
    // Group events by day
    const days = getDaysInMonth(currentDate);
    const eventsByDay = days.map(day => {
      const dayEvents = events.filter(event => {
        const eventDate = event.date;
        return eventDate.getDate() === day.getDate() &&
               eventDate.getMonth() === day.getMonth() &&
               eventDate.getFullYear() === day.getFullYear();
      });
      return { date: day, events: dayEvents };
    });
    
    setEventsByDay(eventsByDay);
  }, [currentDate, events]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day: Date) => {
    const dayEvents = eventsByDay.find(d => 
      d.date.getDate() === day.getDate() &&
      d.date.getMonth() === day.getMonth() &&
      d.date.getFullYear() === day.getFullYear()
    )?.events || [];
    
    if (dayEvents.length > 0) {
      setSelectedDate(day);
      setModalOpen(true);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };

  // Add new event handlers
  const handleFormChange = (field: string, value: string | number | EventType) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.startTime || !newEvent.endTime) return;
    
    // Create a new event object
    const newEventObj: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: new Date(newEvent.date),
      type: newEvent.type,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      notes: newEvent.notes,
      setupConditions: newEvent.setupConditions,
      staffNotes: newEvent.staffNotes,
      location: newEvent.location || undefined,
      organizer: newEvent.organizer || undefined,
      attendees: newEvent.attendees || undefined,
    };
    
    // Add to events state
    setEvents(prev => [...prev, newEventObj]);
    
    // Reset form and close
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'own-event',
      startTime: '19:00',
      endTime: '22:00',
      notes: '',
      setupConditions: '',
      staffNotes: '',
      location: '',
      organizer: 'Blaine',
      attendees: 0,
    });
    setShowAddForm(false);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'own-event',
      startTime: '19:00',
      endTime: '22:00',
      notes: '',
      setupConditions: '',
      staffNotes: '',
      location: '',
      organizer: 'Blaine',
      attendees: 0,
    });
  };

  // Get event pills for a day
  const getEventPills = (events: Event[]) => {
    // Show up to 2 events as pills
    const eventsToShow = events.slice(0, 2);
    return eventsToShow.map(event => {
      const typeConfig = getEventTypeConfig(event.type);
      return {
        event,
        typeConfig,
        // Truncate title if too long for small space
        displayText: event.title.length > 10 ? event.title.substring(0, 8) + '...' : event.title
      };
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Events Calendar</h1>
        <p className="text-white/60">The Catherine Wheel • View pub events and fixtures</p>
      </div>

      {/* Event Type Key */}
      <div className="mb-6 flex flex-nowrap items-center gap-2 overflow-x-auto">
        <span className="text-white/70 text-sm mr-2 shrink-0">Event Types:</span>
        <div className="flex flex-nowrap gap-2">
          {eventTypes.map((type) => (
            <span
              key={type.type}
              className="px-2 py-1 rounded text-sm font-medium whitespace-nowrap"
              style={{
                backgroundColor: type.color.bg,
                color: type.color.text,
                border: `1px solid ${type.color.border}`,
              }}
            >
              {type.label}
            </span>
          ))}
        </div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-white">{monthName}</h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-3">
              <span className="text-white/70 text-sm font-medium">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {eventsByDay.map((dayData, index) => {
            const day = dayData.date;
            const isCurrent = isCurrentMonth(day);
            const today = isToday(day);
            const hasEvents = dayData.events.length > 0;
            const eventPills = getEventPills(dayData.events);

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={!hasEvents}
                className={`aspect-square p-2 rounded-xl transition-all relative
                  ${!isCurrent ? 'opacity-40' : ''}
                  ${today ? 'ring-2 ring-primary ring-offset-1 ring-offset-gray-900' : ''}
                  ${hasEvents ? 'hover:bg-white/10 cursor-pointer' : 'cursor-default'}
                  ${isCurrent ? 'bg-white/5' : 'bg-transparent'}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`text-lg font-medium ${isCurrent ? 'text-white' : 'text-white/50'}`}>
                    {day.getDate()}
                  </span>
                  
                  {/* Event Pills */}
                  {hasEvents && (
                    <div className="w-full mt-1 space-y-0.5 max-h-14 overflow-hidden">
                      {eventPills.map(({ event, typeConfig, displayText }) => (
                        <div
                          key={event.id}
                          className="px-1 py-0.5 rounded text-[10px] font-medium truncate text-center w-full leading-tight"
                          style={{
                            backgroundColor: typeConfig.color.bg,
                            color: typeConfig.color.text,
                            border: `1px solid ${typeConfig.color.border}`,
                          }}
                          title={`${event.title} (${typeConfig.label})`}
                        >
                          {displayText}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Event Count Badge (show only if more than 2 events) */}
                  {hasEvents && dayData.events.length > 2 && (
                    <div className="absolute top-1 right-1">
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                        +{dayData.events.length - 2}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List for Current Month */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6">Events in {monthName}</h3>
        
        {monthEvents.length > 0 ? (
          <div className="space-y-4">
            {monthEvents.map((event) => {
              const typeConfig = getEventTypeConfig(event.type);
              return (
                <div key={event.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap"
                          style={{
                            backgroundColor: typeConfig.color.bg,
                            color: typeConfig.color.text,
                            border: `1px solid ${typeConfig.color.border}`,
                          }}
                        >
                          {typeConfig.label}
                        </span>
                        <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-white/50 text-sm mb-1">Date & Time</p>
                          <p className="text-white">
                            {event.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} • {event.startTime} - {event.endTime}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-white/50 text-sm mb-1">Location</p>
                          <p className="text-white">{event.location}</p>
                        </div>
                        
                        <div>
                          <p className="text-white/50 text-sm mb-1">Notes</p>
                          <p className="text-white/80 line-clamp-1">{event.notes}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedDate(event.date);
                        setModalOpen(true);
                      }}
                      className="ml-4 px-4 py-2 rounded text-sm font-medium transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No events scheduled</h3>
            <p className="text-white/60 max-w-md mx-auto">
              There are no events scheduled for {monthName}. Check next month or add new events.
            </p>
          </div>
        )}
      </div>

      {/* Add New Event Button */}
      <div className="mb-12">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: '1px solid rgba(139, 92, 246, 0.4)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Event
        </button>
      </div>

      {/* Add New Event Form */}
      {showAddForm && (
        <div className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">Add New Event</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Title *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Type *</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => handleFormChange('type', e.target.value as EventType)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {eventTypes.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Start Time *</label>
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">End Time *</label>
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => handleFormChange('endTime', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Location</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter event location"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Organizer</label>
              <input
                type="text"
                value={newEvent.organizer}
                onChange={(e) => handleFormChange('organizer', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter organizer name"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Attendees</label>
              <input
                type="number"
                value={newEvent.attendees}
                onChange={(e) => handleFormChange('attendees', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter expected number of attendees"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Notes</label>
              <textarea
                value={newEvent.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter event notes"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Setup Conditions</label>
              <textarea
                value={newEvent.setupConditions}
                onChange={(e) => handleFormChange('setupConditions', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter setup conditions"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Staff Notes</label>
              <textarea
                value={newEvent.staffNotes}
                onChange={(e) => handleFormChange('staffNotes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter staff notes"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title.trim() || !newEvent.date || !newEvent.startTime || !newEvent.endTime}
                className="px-6 py-3 rounded font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                Add Event
              </button>
              
              <button
                onClick={handleCloseAddForm}
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

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDate(null);
        }}
        events={selectedDate ? eventsByDay.find(d => 
          d.date.getDate() === selectedDate.getDate() &&
          d.date.getMonth() === selectedDate.getMonth() &&
          d.date.getFullYear() === selectedDate.getFullYear()
        )?.events || [] : []}
        date={selectedDate || new Date()}
      />
    </>
  );
}