
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'participant';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  createdBy: string;
  organizer?: User;
  category: string;
  imageUrl?: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registrationTime: string;
  user?: User;
  event?: Event;
}
