
export enum EventCategory {
  ALL = 'All',
  MUSIC = 'Music',
  BOOK = 'Book',
  TECH = 'Tech',
  WORKSHOP = 'Workshop'
}

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  month: string;
  location: string;
  price: string;
  image: string;
  description: string;
  isFeatured?: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  purchaseDate: string;
  qrUrl: string;
}
