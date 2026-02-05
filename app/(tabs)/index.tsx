import { Colors, Fonts, Literary } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLibraryStore } from '@/hooks/use-library-store';
import { LibraryItem } from '@/types/library';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function statusLabel(status: 'want_to_read' | 'reading' | 'read') {
  if (status === 'want_to_read') {
    return 'Want to Read';
  }

  if (status === 'reading') {
    return 'Reading';
  }

  return 'Read';
}

function LibraryCard({ item, textColor, mutedText, borderColor }: { item: LibraryItem; textColor: string; mutedText: string; borderColor: string }) {
  if (item.kind === 'entry') {
    return (
      <View style={[styles.card, { borderColor }]}>
        <Text style={[styles.badge, { color: mutedText }]}>ENTRY</Text>
        <Text style={[styles.cardTitle, { color: textColor }]}>{item.title}</Text>
        <Text numberOfLines={2} style={[styles.bodyText, { color: mutedText }]}>
          {item.body}
        </Text>
        <Text style={[styles.metaText, { color: mutedText }]}>
          {item.shelfCode} · {item.shelfLabel} · {item.visibility === 'public' ? 'Public' : 'Private'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { borderColor }]}>
      <Text style={[styles.badge, { color: mutedText }]}>BOOK</Text>
      <Text style={[styles.cardTitle, { color: textColor }]}>{item.bookRef.title}</Text>
      <Text numberOfLines={1} style={[styles.bodyText, { color: mutedText }]}>
        {item.bookRef.authors.join(', ')}
      </Text>
      <Text style={[styles.metaText, { color: mutedText }]}>
        {item.shelfCode} · {item.shelfLabel} · {statusLabel(item.readingStatus)}
      </Text>
    </View>
  );
}

export default function LibraryScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { libraryByShelf } = useLibraryStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Library</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>
          Personal shelves for entries and logged books.
        </Text>

        {libraryByShelf.map((section) => {
          return (
            <View key={section.shelf.code} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionCode, { color: colors.mutedText }]}>{section.shelf.code}</Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.shelf.label}</Text>
              </View>
              <Text style={[styles.sectionMeta, { color: colors.mutedText }]}>{section.items.length} item(s)</Text>
              <View style={styles.cardList}>
                {section.items.map((item) => {
                  return (
                    <LibraryCard
                      key={item.id}
                      item={item}
                      textColor={colors.text}
                      mutedText={colors.mutedText}
                      borderColor={colors.border}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}

        {libraryByShelf.length === 0 ? (
          <Text style={[styles.emptyState, { color: colors.mutedText }]}>No shelves yet. Create an Entry or log a Book from the Entry tab.</Text>
        ) : null}
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
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    marginBottom: 8,
  },
  section: {
    borderRadius: Literary.radius.lg,
    borderWidth: 1,
    padding: Literary.spacing.md,
    gap: Literary.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Literary.spacing.sm,
  },
  sectionCode: {
    fontFamily: Fonts.mono,
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
  },
  sectionMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  cardList: {
    gap: Literary.spacing.sm,
  },
  card: {
    borderWidth: 1,
    borderRadius: Literary.radius.md,
    padding: Literary.spacing.md,
    gap: 4,
  },
  badge: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 28,
  },
  bodyText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  metaText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  emptyState: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
