import { AISLES } from '@/constants/library-taxonomy';
import { Colors, Fonts, Literary } from '@/constants/theme';
import { useLibraryStore } from '@/hooks/use-library-store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EntryItem } from '@/types/library';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatEntryMeta(entry: EntryItem) {
  return `${entry.shelfCode} - ${entry.shelfLabel}`;
}

export default function ExploreScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { publicEntries } = useLibraryStore();
  const [query, setQuery] = useState('');

  const filteredPublicEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return publicEntries;
    }

    return publicEntries.filter((entry) => {
      const haystack = `${entry.title} ${entry.body} ${entry.shelfCode} ${entry.shelfLabel}`;
      return haystack.toLowerCase().includes(normalized);
    });
  }, [publicEntries, query]);

  const arrivals820 = useMemo(() => {
    return filteredPublicEntries.filter((entry) => entry.shelfCode.startsWith('820')).slice(0, 3);
  }, [filteredPublicEntries]);

  const trendingShelf = useMemo(() => {
    const counts = new Map<string, number>();

    for (const entry of filteredPublicEntries) {
      counts.set(entry.shelfCode, (counts.get(entry.shelfCode) ?? 0) + 1);
    }

    const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    if (ranked.length === 0) {
      return null;
    }

    const [code] = ranked[0];
    return {
      code,
      entries: filteredPublicEntries.filter((entry) => entry.shelfCode === code).slice(0, 3),
    };
  }, [filteredPublicEntries]);

  const aisleRows = useMemo(() => {
    return AISLES.map((aisle) => {
      const count = filteredPublicEntries.filter((entry) => entry.shelfCode.startsWith(aisle.code)).length;
      return { ...aisle, count };
    });
  }, [filteredPublicEntries]);

  const librarianPicks = filteredPublicEntries.slice(0, 3);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Card Catalog</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>Public entries organized by shelf identity.</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search titles, text, or shelf code"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />

        <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>Browse Aisles</Text>
          {aisleRows.map((aisle) => {
            return (
              <View key={aisle.code} style={[styles.row, { borderBottomColor: colors.border }]}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {aisle.code} - {aisle.label}
                </Text>
                <Text style={[styles.rowMeta, { color: colors.mutedText }]}>{aisle.count}</Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>New Arrivals in 820</Text>
          {arrivals820.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>No public arrivals in 820.</Text>
          ) : (
            arrivals820.map((entry) => {
              return (
                <View key={entry.id} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <View style={styles.rowMain}>
                    <Text style={[styles.rowTitle, { color: colors.text }]}>{entry.title}</Text>
                    <Text numberOfLines={1} style={[styles.rowMeta, { color: colors.mutedText }]}>
                      {entry.authorName} · {formatEntryMeta(entry)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>
            Trending shelf: {trendingShelf?.code ?? 'None'}
          </Text>
          {trendingShelf?.entries.length ? (
            trendingShelf.entries.map((entry) => {
              return (
                <View key={entry.id} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>{entry.title}</Text>
                  <Text numberOfLines={1} style={[styles.rowMeta, { color: colors.mutedText }]}>
                    {formatEntryMeta(entry)}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>No trending entries yet.</Text>
          )}
        </View>

        <View style={[styles.block, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.blockTitle, { color: colors.text }]}>Librarian Picks</Text>
          {librarianPicks.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>No picks yet.</Text>
          ) : (
            librarianPicks.map((entry) => {
              return (
                <View key={entry.id} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>{entry.title}</Text>
                  <Text numberOfLines={1} style={[styles.rowMeta, { color: colors.mutedText }]}>
                    {entry.authorName} · {formatEntryMeta(entry)}
                  </Text>
                </View>
              );
            })
          )}
        </View>
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
  searchInput: {
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    paddingHorizontal: Literary.spacing.md,
    paddingVertical: Literary.spacing.sm,
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  block: {
    borderWidth: 1,
    borderRadius: Literary.radius.lg,
    padding: Literary.spacing.md,
    gap: Literary.spacing.sm,
  },
  blockTitle: {
    fontFamily: Fonts.serif,
    fontSize: 23,
    lineHeight: 28,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Literary.spacing.sm,
  },
  rowMain: {
    gap: 2,
  },
  rowTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    lineHeight: 24,
  },
  rowMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
