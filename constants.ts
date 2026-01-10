
import { Event, EventCategory } from './types';

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Universal Book Fair 2024',
    category: EventCategory.BOOK,
    date: '25',
    month: 'MAR',
    location: 'Grand Convention Center',
    price: 'Free Entry',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    description: 'The largest literary festival of the year with exclusive author signings!',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Future Tech Summit: AI & Beyond',
    category: EventCategory.TECH,
    date: '12',
    month: 'APR',
    location: 'Apex Tower, Sky Hall',
    price: 'Rp 150.000',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    description: 'Explore the future of artificial intelligence with industry pioneers.'
  },
  {
    id: '3',
    title: 'Echo Music Festival',
    category: EventCategory.MUSIC,
    date: '05',
    month: 'MAY',
    location: 'International Stadium',
    price: 'Rp 350.000',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800',
    description: 'A multi-genre concert featuring top-tier international performers.'
  },
  {
    id: '4',
    title: 'Creative Masterclass: Storytelling',
    category: EventCategory.WORKSHOP,
    date: '18',
    month: 'JUN',
    location: 'Central Plaza Hub',
    price: 'Rp 200.000',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    description: 'Master the art of narrative writing with best-selling authors.'
  },
  {
    id: '5',
    title: 'Digital Arts Expo',
    category: EventCategory.TECH,
    date: '30',
    month: 'JUL',
    location: 'Nexus Exhibition Center',
    price: 'Rp 75.000',
    image: 'https://images.unsplash.com/photo-1547891299-063999901764?auto=format&fit=crop&q=80&w=800',
    description: 'A showcase of cutting-edge digital illustrations and VR art.'
  },
  {
    id: '6',
    title: 'Midnight Jazz Sessions',
    category: EventCategory.MUSIC,
    date: '14',
    month: 'AUG',
    location: 'The Blue Lounge',
    price: 'Rp 100.000',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800',
    description: 'Soulful jazz performances under the city lights.'
  }
];
