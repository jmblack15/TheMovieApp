import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieGrid } from "../../src/components/MovieGrid";
import { FilterInput } from "../../src/components/movies/FilterInput";
import { SettingsMenu } from "../../src/components/SettingsMenu";
import { FONTS, SPACING } from "../../src/constants/theme";
import { useMovieFilter } from "../../src/hooks/useMovieFilter";
import { useTheme } from "../../src/hooks/useTheme";
import { useOfflineStore } from "../../src/store/offlineStore";
import type { Movie } from "../../src/types/index";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const loadCachedMovies = useOfflineStore((s) => s.loadCachedMovies);

  const {
    movies,
    letterInput,
    isFiltering,
    isLoading,
    isLoadingFilter,
    isOffline,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefreshing,
    handleLetterChange,
    clearFilter,
  } = useMovieFilter();

  useEffect(() => {
    loadCachedMovies();
  }, [loadCachedMovies]);

  const handleEndReached = useCallback(() => {
    if (!isFiltering && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFiltering]);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push({
        pathname: "/movie/[id]",
        params: { id: movie.id, title: movie.title },
      });
    },
    [router],
  );

  const filterEmptyComponent =
    isFiltering && !isLoadingFilter && movies.length === 0 ? (
      <View testID="empty-state" style={styles.emptyState}>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          {t("common.noResults", { letter: letterInput })}
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          {t("common.filterHint")}
        </Text>
      </View>
    ) : isFiltering && isLoadingFilter ? null : undefined;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ExpoStatusBar style={colors.statusBar} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t("home.title")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t("home.subtitle")}
          </Text>
        </View>
        <View style={styles.headerControls}>
          <Pressable
            onPress={() => SheetManager.show("settings-sheet")}
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <SettingsMenu />
        </View>
      </View>

      <FilterInput
        value={letterInput}
        onChangeText={handleLetterChange}
        onClear={clearFilter}
      />

      {isLoadingFilter && (
        <View style={styles.filterLoading}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text
            style={[styles.filterLoadingText, { color: colors.textSecondary }]}
          >
            {t("home.verifyingCast")}
          </Text>
        </View>
      )}

      <MovieGrid
        movies={movies}
        isOffline={isOffline}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isRefreshing={isRefreshing}
        onEndReached={handleEndReached}
        onRefresh={refetch}
        onMoviePress={handleMoviePress}
        emptyComponent={filterEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm + 1,
    marginTop: SPACING.xs,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  filterLoading: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  filterLoadingText: {
    fontSize: FONTS.sizes.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    textAlign: "center",
    paddingHorizontal: SPACING.xl,
    lineHeight: 18,
  },
});
