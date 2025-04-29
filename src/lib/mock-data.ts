
import { User, Event, Registration } from '@/types';

// Mock Users
export const users: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@sjsu.edu',
    role: 'organizer',
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@sjsu.edu',
    role: 'participant',
  },
];

// Mock Events
export const events: Event[] = [
  {
    id: 'event1',
    title: 'Tech Career Fair',
    description: 'Connect with tech companies hiring interns and full-time employees.',
    location: 'Student Union Ballroom',
    dateTime: '2025-05-15T13:00:00',
    createdBy: 'user1',
    category: 'Career',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'event2',
    title: 'Basketball Tournament',
    description: 'Join us for a friendly basketball tournament between different departments.',
    location: 'SJSU Rec Center',
    dateTime: '2025-05-20T15:00:00',
    createdBy: 'user1',
    category: 'Sports',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'event3',
    title: 'Art Exhibition',
    description: 'Explore beautiful artwork created by SJSU students and faculty.',
    location: 'Art Building Gallery',
    dateTime: '2025-05-25T10:00:00',
    createdBy: 'user1',
    category: 'Arts',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'event4',
    title: 'Hackathon 2025',
    description: 'A 48-hour coding marathon to build innovative solutions.',
    location: 'Engineering Building',
    dateTime: '2025-06-01T09:00:00',
    createdBy: 'user1',
    category: 'Technology',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'event5',
    title: 'Business Networking Mixer',
    description: 'Connect with alumni and business leaders from Silicon Valley.',
    location: 'Business Complex',
    dateTime: '2025-06-05T18:00:00',
    createdBy: 'user1',
    category: 'Networking',
    imageUrl: '/placeholder.svg',
  },
];

// Mock Registrations
export const registrations: Registration[] = [
  {
    id: 'reg1',
    userId: 'user2',
    eventId: 'event1',
    registrationTime: '2025-05-01T10:30:00',
  },
  {
    id: 'reg2',
    userId: 'user2',
    eventId: 'event3',
    registrationTime: '2025-05-02T14:20:00',
  },
];

// Categories
export const categories = [
  'All',
  'Career',
  'Sports',
  'Arts',
  'Technology',
  'Networking',
  'Academic',
  'Social',
  'Workshop',
  'Other',
];
