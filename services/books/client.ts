import { MOCK_BOOKS } from '@/services/books/mock-data';
import { BookSearchRequest, BookSearchResponse, BooksClient } from '@/services/books/types';
import { BookRef } from '@/types/library';

class MockGoogleBooksClientImpl implements BooksClient {
  async searchBooks(request: BookSearchRequest): Promise<BookSearchResponse> {
    const limit = request.limit ?? 8;
    const query = request.query.trim().toLowerCase();

    if (!query) {
      return { items: MOCK_BOOKS.slice(0, limit), total: MOCK_BOOKS.length };
    }

    const items = MOCK_BOOKS.filter((book) => {
      const haystack = `${book.title} ${book.authors.join(' ')} ${book.isbn10 ?? ''} ${book.isbn13 ?? ''}`;
      return haystack.toLowerCase().includes(query);
    }).slice(0, limit);

    return { items, total: items.length };
  }

  async getBookById(providerId: string): Promise<BookRef | null> {
    return MOCK_BOOKS.find((item) => item.providerId === providerId) ?? null;
  }
}

export const MockGoogleBooksClient = new MockGoogleBooksClientImpl();
