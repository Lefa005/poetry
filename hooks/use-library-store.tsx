import { MOCK_BOOK_ITEMS, MOCK_ENTRIES, MOCK_SHELVES } from '@/constants/library-mocks';
import { isValidShelfCode, sortByShelfCode } from '@/constants/library-taxonomy';
import { MockGoogleBooksClient } from '@/services/books/client';
import { BookSearchRequest } from '@/services/books/types';
import { BookItem, BookRef, EntryItem, EntryVisibility, LibraryItem, ReadingStatus, Shelf } from '@/types/library';
import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

interface CreateEntryInput {
  title: string;
  body: string;
  shelfCode: string;
  visibility: EntryVisibility;
  mood?: string;
  tags?: string[];
}

interface LogBookInput {
  bookRef: BookRef;
  shelfCode: string;
  readingStatus: ReadingStatus;
  notes?: string;
  review?: string;
  rating?: number;
  quotes?: string[];
}

interface LibraryStore {
  shelves: Shelf[];
  entries: EntryItem[];
  bookItems: BookItem[];
  libraryByShelf: Array<{ shelf: Shelf; items: LibraryItem[] }>;
  publicEntries: EntryItem[];
  createEntry: (input: CreateEntryInput) => void;
  logBook: (input: LogBookInput) => void;
  searchBooks: (request: BookSearchRequest) => ReturnType<typeof MockGoogleBooksClient.searchBooks>;
}

const LibraryStoreContext = createContext<LibraryStore | null>(null);

const OWNER_ID = 'user-1';

export function LibraryStoreProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState<EntryItem[]>(MOCK_ENTRIES);
  const [bookItems, setBookItems] = useState<BookItem[]>(MOCK_BOOK_ITEMS);
  const [shelves] = useState<Shelf[]>(MOCK_SHELVES);

  const shelfByCode = useMemo(
    () =>
      new Map(
        shelves.map((shelf) => {
          return [shelf.code, shelf];
        })
      ),
    [shelves]
  );

  const libraryByShelf = useMemo(() => {
    const grouped = new Map<string, LibraryItem[]>();

    for (const entry of entries) {
      grouped.set(entry.shelfCode, [...(grouped.get(entry.shelfCode) ?? []), entry]);
    }

    for (const book of bookItems) {
      grouped.set(book.shelfCode, [...(grouped.get(book.shelfCode) ?? []), book]);
    }

    return Array.from(grouped.entries())
      .map(([shelfCode, items]) => {
        const shelf =
          shelfByCode.get(shelfCode) ??
          ({
            id: `dynamic-${shelfCode}`,
            code: shelfCode,
            label: 'Custom Shelf',
            aisleCode: shelfCode.slice(0, 3),
            isOfficial: false,
            ownerUserId: OWNER_ID,
          } satisfies Shelf);

        return {
          shelf,
          items: [...items].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }),
        };
      })
      .sort((a, b) => sortByShelfCode(a.shelf, b.shelf));
  }, [bookItems, entries, shelfByCode]);

  const publicEntries = useMemo(() => {
    return entries
      .filter((entry) => entry.visibility === 'public')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [entries]);

  const createEntry = (input: CreateEntryInput) => {
    if (!isValidShelfCode(input.shelfCode)) {
      return;
    }

    const shelf = shelfByCode.get(input.shelfCode);
    const timestamp = new Date().toISOString();

    const nextEntry: EntryItem = {
      kind: 'entry',
      id: `entry-${timestamp}`,
      title: input.title.trim(),
      body: input.body.trim(),
      shelfCode: input.shelfCode,
      shelfLabel: shelf?.label ?? 'Custom Shelf',
      visibility: input.visibility,
      authorId: OWNER_ID,
      authorName: 'You',
      mood: input.mood?.trim() || undefined,
      tags: input.tags,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setEntries((current) => [nextEntry, ...current]);
  };

  const logBook = (input: LogBookInput) => {
    if (!isValidShelfCode(input.shelfCode)) {
      return;
    }

    const shelf = shelfByCode.get(input.shelfCode);
    const timestamp = new Date().toISOString();

    const nextBook: BookItem = {
      kind: 'book',
      id: `book-${timestamp}`,
      bookRef: input.bookRef,
      shelfCode: input.shelfCode,
      shelfLabel: shelf?.label ?? 'Custom Shelf',
      readingStatus: input.readingStatus,
      notes: input.notes?.trim() || undefined,
      review: input.review?.trim() || undefined,
      rating: input.rating,
      quotes: input.quotes,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setBookItems((current) => [nextBook, ...current]);
  };

  const searchBooks = (request: BookSearchRequest) => {
    return MockGoogleBooksClient.searchBooks(request);
  };

  const store = useMemo<LibraryStore>(
    () => ({
      shelves,
      entries,
      bookItems,
      libraryByShelf,
      publicEntries,
      createEntry,
      logBook,
      searchBooks,
    }),
    [bookItems, entries, libraryByShelf, publicEntries, shelves]
  );

  return <LibraryStoreContext.Provider value={store}>{children}</LibraryStoreContext.Provider>;
}

export function useLibraryStore() {
  const store = useContext(LibraryStoreContext);

  if (!store) {
    throw new Error('useLibraryStore must be used inside LibraryStoreProvider');
  }

  return store;
}
