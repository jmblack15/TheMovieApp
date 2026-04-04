import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { Cast } from '../../types/index';
import { buildProfileUrl } from '../../utils/image';

interface CastCarouselProps {
  cast: Cast[];
}

interface CastItemProps {
  actor: Cast;
}

const CastItem = memo(function CastItem({ actor }: CastItemProps) {
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
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarFallbackEmoji}>👤</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {actor.name}
      </Text>
      <Text style={styles.character} numberOfLines={2}>
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
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    width: 90,
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
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackEmoji: {
    fontSize: 28,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  character: {
    color: '#9B9B9B',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
