import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { Cast } from '../../types/index';
import { useTheme } from '../../hooks/useTheme';
import { buildProfileUrl } from '../../utils/image';
import { FONTS, SPACING } from '../../constants/theme';

interface CastCarouselProps {
  cast: Cast[];
}

interface CastItemProps {
  actor: Cast;
}

const CastItem = memo(function CastItem({ actor }: CastItemProps) {
  const { colors } = useTheme();
  const profileUri = actor.profile_path
    ? buildProfileUrl(actor.profile_path, 'medium')
    : null;

  return (
    <View testID={`cast-item-${actor.id}`} style={styles.item}>
      {profileUri ? (
        <Image
          source={{ uri: profileUri ?? undefined }}
          style={styles.avatar}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="low"
        />
      ) : (
        <View testID="avatar-placeholder" style={[styles.avatarFallback, { backgroundColor: colors.card }]}>
          <Ionicons name="person" size={28} color={colors.textHint} />
        </View>
      )}
      <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={2}>
        {actor.name}
      </Text>
      <Text style={[styles.character, { color: colors.textSecondary }]} numberOfLines={2}>
        {actor.character}
      </Text>
    </View>
  );
});

export function CastCarousel({ cast }: CastCarouselProps) {
  const visible = cast.slice(0, 20);

  return (
    <FlatList
      testID="cast-carousel"
      horizontal
      data={visible}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <CastItem actor={item} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  item: {
    width: 88,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginTop: SPACING.xs + 2,
  },
  character: {
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    marginTop: 2,
  },
});
