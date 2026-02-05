import { ALL_SHELVES, OWNER_ID, sortByShelfCode } from '@/constants/library-taxonomy';
import { MOCK_BOOKS } from '@/services/books/mock-data';
import { BookItem, EntryItem, Shelf } from '@/types/library';

const now = new Date('2026-02-05T18:00:00.000Z').toISOString();

export const MOCK_ENTRIES: EntryItem[] = [
  {
    kind: 'entry',
    id: 'entry-001',
    title: 'Moonlit Solitude',
    body: 'A quiet night, the world asleep. I sit beneath the silvered sky.',
    shelfCode: '820.20',
    shelfLabel: 'Grief Poetry',
    visibility: 'public',
    authorId: OWNER_ID,
    authorName: 'You',
    mood: 'Quiet',
    tags: ['night', 'grief'],
    createdAt: now,
    updatedAt: now,
  },
  {
    kind: 'entry',
    id: 'entry-002',
    title: 'Letters to the Morning',
    body: 'Every day arrives softly, asking to be named.',
    shelfCode: '820.10',
    shelfLabel: 'Love Poetry',
    visibility: 'private',
    authorId: OWNER_ID,
    authorName: 'You',
    mood: 'Tender',
    tags: ['hope'],
    createdAt: now,
    updatedAt: now,
  },
  {
    kind: 'entry',
    id: 'entry-003',
    title: 'City of Small Echoes',
    body: 'The stairwell remembers every argument and every apology.',
    shelfCode: '830.20',
    shelfLabel: 'Thriller Fiction',
    visibility: 'public',
    authorId: OWNER_ID,
    authorName: 'You',
    mood: 'Suspense',
    tags: ['city'],
    createdAt: now,
    updatedAt: now,
  },
];

export const MOCK_BOOK_ITEMS: BookItem[] = [
  {
    kind: 'book',
    id: 'book-item-001',
    bookRef: MOCK_BOOKS[0],
    shelfCode: '830.20',
    shelfLabel: 'Thriller Fiction',
    readingStatus: 'reading',
    notes: 'The tone feels like rain and memory.',
    createdAt: now,
    updatedAt: now,
  },
  {
    kind: 'book',
    id: 'book-item-002',
    bookRef: MOCK_BOOKS[1],
    shelfCode: '100.20',
    shelfLabel: 'Quiet Growth',
    readingStatus: 'read',
    review: 'Lean and sharp. I keep returning to chapter one.',
    rating: 4,
    quotes: ['Trust thyself: every heart vibrates to that iron string.'],
    createdAt: now,
    updatedAt: now,
  },
];

export const MOCK_SHELVES: Shelf[] = [...ALL_SHELVES].sort(sortByShelfCode);
