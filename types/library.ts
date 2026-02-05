export type EntryVisibility = 'public' | 'private';
export type ReadingStatus = 'want_to_read' | 'reading' | 'read';
export type BookProvider = 'mock-google-books' | 'google-books';

export interface Aisle {
  code: string;
  label: string;
  description: string;
}

export interface Shelf {
  id: string;
  code: string;
  label: string;
  aisleCode: string;
  isOfficial: boolean;
  ownerUserId: string;
}

export interface BookRef {
  provider: BookProvider;
  providerId: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  isbn10?: string;
  isbn13?: string;
  publishedDate?: string;
}

export interface EntryItem {
  kind: 'entry';
  id: string;
  title: string;
  body: string;
  shelfCode: string;
  shelfLabel: string;
  visibility: EntryVisibility;
  authorId: string;
  authorName: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookItem {
  kind: 'book';
  id: string;
  bookRef: BookRef;
  shelfCode: string;
  shelfLabel: string;
  readingStatus: ReadingStatus;
  review?: string;
  rating?: number;
  quotes?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type LibraryItem = EntryItem | BookItem;
