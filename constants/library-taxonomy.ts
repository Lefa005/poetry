import { Aisle, Shelf } from '@/types/library';

export const OWNER_ID = 'user-1';

export const AISLES: Aisle[] = [
  { code: '000', label: 'Library & Meta', description: 'Journals, prompts, reading goals.' },
  { code: '100', label: 'Mind & Philosophy', description: 'Identity, meaning, self-growth.' },
  { code: '200', label: 'Faith & Myth', description: 'Religion, spirituality, folklore.' },
  { code: '300', label: 'Society', description: 'Politics, relationships, culture.' },
  { code: '400', label: 'Language', description: 'Linguistics, writing craft, grammar.' },
  { code: '500', label: 'Science', description: 'Nature, space, math, psychology.' },
  { code: '600', label: 'Life & Skills', description: 'Business, tech, health, cooking.' },
  { code: '700', label: 'Arts', description: 'Music, film, visual art.' },
  { code: '800', label: 'Literature', description: 'Poetry, fiction, essays, plays.' },
  { code: '900', label: 'History & Worlds', description: 'History, biography, geography.' },
];

export const OFFICIAL_SHELVES: Shelf[] = [
  { id: 's-810-00', code: '810.00', label: 'Writing Craft', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-820-00', code: '820.00', label: 'Poetry', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-830-00', code: '830.00', label: 'Fiction', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-840-00', code: '840.00', label: 'Essays / Nonfiction Lit', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-850-00', code: '850.00', label: 'Plays / Scripts', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-860-00', code: '860.00', label: 'Short Stories', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-870-00', code: '870.00', label: 'Classics', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
  { id: 's-890-00', code: '890.00', label: 'World Literature', aisleCode: '800', isOfficial: true, ownerUserId: OWNER_ID },
];

export const USER_SHELVES: Shelf[] = [
  { id: 's-820-10', code: '820.10', label: 'Love Poetry', aisleCode: '800', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-820-20', code: '820.20', label: 'Grief Poetry', aisleCode: '800', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-820-30', code: '820.30', label: 'Motivational Poetry', aisleCode: '800', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-830-10', code: '830.10', label: 'Romance Fiction', aisleCode: '800', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-830-20', code: '830.20', label: 'Thriller Fiction', aisleCode: '800', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-830-30', code: '830.30', label: 'Fantasy Fiction', aisleCode: '800', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-100-20', code: '100.20', label: 'Quiet Growth', aisleCode: '100', isOfficial: false, ownerUserId: OWNER_ID },
  { id: 's-900-30', code: '900.30', label: 'Life Stories', aisleCode: '900', isOfficial: false, ownerUserId: OWNER_ID },
];

export const ALL_SHELVES: Shelf[] = [...OFFICIAL_SHELVES, ...USER_SHELVES];

export function isValidShelfCode(code: string) {
  return /^\d{3}\.\d{2}$/.test(code);
}

export function isOfficialShelfCode(code: string) {
  if (!isValidShelfCode(code)) {
    return false;
  }

  const suffix = Number(code.split('.')[1]);
  return suffix >= 0 && suffix <= 9;
}

export function isUserShelfCode(code: string) {
  if (!isValidShelfCode(code)) {
    return false;
  }

  const suffix = Number(code.split('.')[1]);
  return suffix >= 10 && suffix <= 99;
}

export function sortByShelfCode(a: { code: string }, b: { code: string }) {
  const [aHead, aTail] = a.code.split('.').map(Number);
  const [bHead, bTail] = b.code.split('.').map(Number);

  if (aHead !== bHead) {
    return aHead - bHead;
  }

  return aTail - bTail;
}
