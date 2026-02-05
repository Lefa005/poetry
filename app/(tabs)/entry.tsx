import { MOCK_SHELVES } from '@/constants/library-mocks';
import { Colors, Fonts, Literary } from '@/constants/theme';
import { useLibraryStore } from '@/hooks/use-library-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookRef, EntryVisibility, ReadingStatus } from '@/types/library';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type EntryMode = 'create-entry' | 'log-book';

const readingStatuses: { value: ReadingStatus; label: string }[] = [
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
];

const visibilityOptions: EntryVisibility[] = ['public', 'private'];

function SegmentButton({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: (typeof Colors)['light'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.segmentButton,
        {
          backgroundColor: selected ? colors.paper : colors.surface,
          borderColor: colors.border,
        },
      ]}>
      <Text style={[styles.segmentLabel, { color: selected ? colors.text : colors.mutedText }]}>{label}</Text>
    </Pressable>
  );
}

export default function EntryScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { createEntry, logBook, searchBooks } = useLibraryStore();

  const [mode, setMode] = useState<EntryMode>('create-entry');
  const [selectedShelfCode, setSelectedShelfCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [entryTitle, setEntryTitle] = useState('');
  const [entryBody, setEntryBody] = useState('');
  const [entryVisibility, setEntryVisibility] = useState<EntryVisibility | null>(null);

  const [query, setQuery] = useState('');
  const [bookResults, setBookResults] = useState<BookRef[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookRef | null>(null);
  const [status, setStatus] = useState<ReadingStatus>('want_to_read');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      const response = await searchBooks({ query, limit: 8 });
      if (!ignore) {
        setBookResults(response.items);
      }
    };

    void run();

    return () => {
      ignore = true;
    };
  }, [query, searchBooks]);

  const selectedShelfLabel = useMemo(() => {
    return MOCK_SHELVES.find((shelf) => shelf.code === selectedShelfCode)?.label ?? '';
  }, [selectedShelfCode]);

  const canSubmitEntry = Boolean(entryTitle.trim() && entryBody.trim() && selectedShelfCode && entryVisibility);
  const canLogBook = Boolean(selectedBook && selectedShelfCode);

  const handleCreateEntry = () => {
    if (!canSubmitEntry || !entryVisibility) {
      return;
    }

    createEntry({
      title: entryTitle,
      body: entryBody,
      shelfCode: selectedShelfCode,
      visibility: entryVisibility,
    });

    setEntryTitle('');
    setEntryBody('');
    setEntryVisibility(null);
    setMessage('Entry saved to your library.');
  };

  const handleLogBook = () => {
    if (!canLogBook || !selectedBook) {
      return;
    }

    logBook({
      bookRef: selectedBook,
      shelfCode: selectedShelfCode,
      readingStatus: status,
      notes,
    });

    setSelectedBook(null);
    setNotes('');
    setStatus('want_to_read');
    setMessage('Book logged to your library.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Entry Desk</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>Create an entry or log a book to your shelves.</Text>

        <View style={styles.segmentRow}>
          <SegmentButton
            label="Create Entry"
            selected={mode === 'create-entry'}
            onPress={() => setMode('create-entry')}
            colors={colors}
          />
          <SegmentButton label="Log a Book" selected={mode === 'log-book'} onPress={() => setMode('log-book')} colors={colors} />
        </View>

        <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Shelf (required)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choicesRow}>
            {MOCK_SHELVES.map((shelf) => {
              const selected = shelf.code === selectedShelfCode;

              return (
                <Pressable
                  key={shelf.id}
                  onPress={() => setSelectedShelfCode(shelf.code)}
                  style={[
                    styles.choice,
                    {
                      backgroundColor: selected ? colors.paper : colors.background,
                      borderColor: selected ? colors.accent : colors.border,
                    },
                  ]}>
                  <Text style={[styles.choiceCode, { color: colors.mutedText }]}>{shelf.code}</Text>
                  <Text style={[styles.choiceLabel, { color: colors.text }]}>{shelf.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {selectedShelfCode ? (
            <Text style={[styles.helper, { color: colors.mutedText }]}>
              Selected: {selectedShelfCode} - {selectedShelfLabel}
            </Text>
          ) : (
            <Text style={[styles.helper, { color: colors.mutedText }]}>Select a shelf before saving.</Text>
          )}
        </View>

        {mode === 'create-entry' ? (
          <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              value={entryTitle}
              onChangeText={setEntryTitle}
              placeholder="Entry title"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            <Text style={[styles.label, { color: colors.text }]}>Content</Text>
            <TextInput
              value={entryBody}
              onChangeText={setEntryBody}
              placeholder="Write your poem, reflection, or note."
              placeholderTextColor={colors.mutedText}
              multiline
              textAlignVertical="top"
              style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
            />
            <Text style={[styles.label, { color: colors.text }]}>Visibility (required)</Text>
            <View style={styles.choicesRow}>
              {visibilityOptions.map((visibility) => {
                const selected = visibility === entryVisibility;
                return (
                  <Pressable
                    key={visibility}
                    onPress={() => setEntryVisibility(visibility)}
                    style={[
                      styles.pill,
                      {
                        borderColor: selected ? colors.accent : colors.border,
                        backgroundColor: selected ? colors.paper : colors.background,
                      },
                    ]}>
                    <Text style={[styles.pillLabel, { color: selected ? colors.text : colors.mutedText }]}>
                      {visibility === 'public' ? 'Public (Explore)' : 'Private (Library only)'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              disabled={!canSubmitEntry}
              onPress={handleCreateEntry}
              style={[
                styles.submitButton,
                { backgroundColor: canSubmitEntry ? colors.accent : colors.border },
              ]}>
              <Text style={[styles.submitText, { color: colors.surface }]}>Save Entry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Book search</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search title or author"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            <View style={styles.resultsList}>
              {bookResults.map((book) => {
                const selected = book.providerId === selectedBook?.providerId;
                return (
                  <Pressable
                    key={book.providerId}
                    onPress={() => setSelectedBook(book)}
                    style={[
                      styles.resultCard,
                      {
                        borderColor: selected ? colors.accent : colors.border,
                        backgroundColor: selected ? colors.paper : colors.background,
                      },
                    ]}>
                    <Text style={[styles.resultTitle, { color: colors.text }]}>{book.title}</Text>
                    <Text style={[styles.resultMeta, { color: colors.mutedText }]}>{book.authors.join(', ')}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Reading status</Text>
            <View style={styles.choicesRow}>
              {readingStatuses.map((option) => {
                const selected = option.value === status;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setStatus(option.value)}
                    style={[
                      styles.pill,
                      {
                        borderColor: selected ? colors.accent : colors.border,
                        backgroundColor: selected ? colors.paper : colors.background,
                      },
                    ]}>
                    <Text style={[styles.pillLabel, { color: selected ? colors.text : colors.mutedText }]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Personal notes or short review"
              placeholderTextColor={colors.mutedText}
              multiline
              textAlignVertical="top"
              style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
            />

            <Pressable
              disabled={!canLogBook}
              onPress={handleLogBook}
              style={[
                styles.submitButton,
                { backgroundColor: canLogBook ? colors.accent : colors.border },
              ]}>
              <Text style={[styles.submitText, { color: colors.surface }]}>Log Book</Text>
            </Pressable>
          </View>
        )}

        {message ? <Text style={[styles.message, { color: colors.accent }]}>{message}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Literary.spacing.lg,
    paddingBottom: 120,
    gap: Literary.spacing.md,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 34,
    lineHeight: 40,
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: Literary.spacing.sm,
  },
  segmentButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    paddingVertical: Literary.spacing.sm,
    alignItems: 'center',
  },
  segmentLabel: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  block: {
    borderWidth: 1,
    borderRadius: Literary.radius.lg,
    padding: Literary.spacing.md,
    gap: Literary.spacing.sm,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  helper: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    paddingHorizontal: Literary.spacing.md,
    paddingVertical: Literary.spacing.sm,
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    paddingHorizontal: Literary.spacing.md,
    paddingVertical: Literary.spacing.sm,
    minHeight: 110,
    fontFamily: Fonts.serif,
    fontSize: 17,
    lineHeight: 24,
  },
  choicesRow: {
    flexDirection: 'row',
    gap: Literary.spacing.sm,
  },
  choice: {
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    paddingVertical: Literary.spacing.sm,
    paddingHorizontal: Literary.spacing.sm,
    minWidth: 140,
    gap: 2,
  },
  choiceCode: {
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  choiceLabel: {
    fontFamily: Fonts.serif,
    fontSize: 17,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  submitButton: {
    marginTop: Literary.spacing.sm,
    borderRadius: Literary.radius.md,
    paddingVertical: Literary.spacing.sm,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: Fonts.sans,
    fontWeight: '600',
    fontSize: 15,
  },
  resultsList: {
    gap: 8,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    padding: Literary.spacing.sm,
    gap: 2,
  },
  resultTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    lineHeight: 24,
  },
  resultMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  message: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
