export type EventType = 'own-event' | 'private-hire' | 'aunt-sally' | 'darts' | 'pool';

export interface Event {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  startTime: string;
  endTime: string;
  notes: string;
  setupConditions: string;
  staffNotes: string;
  location?: string;
  organizer?: string;
  attendees?: number;
}

export interface EventTypeConfig {
  type: EventType;
  label: string;
  color: {
    bg: string;
    border: string;
    text: string;
  };
}