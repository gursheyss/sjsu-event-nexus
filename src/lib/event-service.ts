
import { Event, Registration, User } from '@/types';
import { events, registrations, users } from './mock-data';

export const getEvents = (): Event[] => {
  // Add organizer information to each event
  return events.map(event => {
    const organizer = users.find(user => user.id === event.createdBy);
    return { ...event, organizer };
  });
};

export const getEventById = (id: string): Event | undefined => {
  const event = events.find(e => e.id === id);
  if (event) {
    const organizer = users.find(user => user.id === event.createdBy);
    return { ...event, organizer };
  }
  return undefined;
};

export const getEventsByCategory = (category: string): Event[] => {
  if (category === 'All') return getEvents();
  return getEvents().filter(event => event.category === category);
};

export const getEventsByOrganizer = (organizerId: string): Event[] => {
  return getEvents().filter(event => event.createdBy === organizerId);
};

export const createEvent = (event: Omit<Event, 'id'>): Event => {
  const newEvent: Event = {
    ...event,
    id: `event${events.length + 1}`,
  };
  events.push(newEvent);
  return newEvent;
};

export const updateEvent = (event: Event): Event => {
  const index = events.findIndex(e => e.id === event.id);
  if (index !== -1) {
    events[index] = event;
  }
  return event;
};

export const deleteEvent = (id: string): boolean => {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    // Also remove all registrations for this event
    const regIndices = registrations
      .map((reg, idx) => (reg.eventId === id ? idx : -1))
      .filter(idx => idx !== -1)
      .reverse();
    
    regIndices.forEach(idx => {
      registrations.splice(idx, 1);
    });
    return true;
  }
  return false;
};

export const registerForEvent = (userId: string, eventId: string): Registration | null => {
  // Check if already registered
  const existingReg = registrations.find(
    reg => reg.userId === userId && reg.eventId === eventId
  );
  
  if (existingReg) {
    return null;
  }

  const newReg: Registration = {
    id: `reg${registrations.length + 1}`,
    userId,
    eventId,
    registrationTime: new Date().toISOString(),
  };
  
  registrations.push(newReg);
  return newReg;
};

export const cancelRegistration = (userId: string, eventId: string): boolean => {
  const index = registrations.findIndex(
    reg => reg.userId === userId && reg.eventId === eventId
  );
  
  if (index !== -1) {
    registrations.splice(index, 1);
    return true;
  }
  return false;
};

export const getUserRegistrations = (userId: string): Registration[] => {
  return registrations
    .filter(reg => reg.userId === userId)
    .map(reg => {
      const event = events.find(e => e.id === reg.eventId);
      return { ...reg, event };
    });
};

export const getEventRegistrations = (eventId: string): Registration[] => {
  return registrations
    .filter(reg => reg.eventId === eventId)
    .map(reg => {
      const user = users.find(u => u.id === reg.userId);
      return { ...reg, user };
    });
};

export const isUserRegistered = (userId: string, eventId: string): boolean => {
  return registrations.some(reg => reg.userId === userId && reg.eventId === eventId);
};
