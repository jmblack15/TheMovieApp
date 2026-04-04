import { Image } from "expo-image";
import React from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { buildBackdropUrl, buildPosterUrl } from "../../utils/image";

interface BackdropHeaderProps {
  backdropPath: string | null;
  posterPath: string | null;
  title: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const POSTER_HEIGHT = 165;
const POSTER_WIDTH = 110;
const POSTER_OVERLAP = 48;

export function BackdropHeader({
  backdropPath,
  posterPath,
}: BackdropHeaderProps) {
  const { top } = useSafeAreaInsets();
  const backdropHeight = SCREEN_WIDTH * 0.56 + top;

  return (
    <View>
      {backdropPath ? (
        <Image
          source={{ uri: buildBackdropUrl(backdropPath, "large") ?? undefined }}
          style={[styles.backdrop, { height: backdropHeight }]}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.backdropFallback, { height: backdropHeight }]} />
      )}

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.overlay} />
      </View>

      <View style={styles.posterRow}>
        <View
          style={[
            styles.posterWrapper,
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ]}
        >
          {posterPath ? (
            <Image
              source={{
                uri: buildPosterUrl(posterPath, "medium") ?? undefined,
              }}
              style={styles.posterImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.posterFallback}>
              <Text style={styles.posterFallbackEmoji}>🎬</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
  },
  backdropFallback: {
    width: "100%",
    backgroundColor: "#1a1a2e",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,13,26,0.55)",
  },
  posterRow: {
    paddingLeft: 16,
  },
  posterWrapper: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 12,
    marginTop: -POSTER_OVERLAP,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  androidShadow: {
    elevation: 8,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 12,
  },
  posterFallback: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallbackEmoji: {
    fontSize: 32,
  },
});
