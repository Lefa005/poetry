import { BookRef } from '@/types/library';

export interface BookSearchRequest {
  query: string;
  limit?: number;
}

export interface BookSearchResponse {
  items: BookRef[];
  total: number;
}

export interface BooksClient {
  searchBooks(request: BookSearchRequest): Promise<BookSearchResponse>;
  getBookById(providerId: string): Promise<BookRef | null>;
}
