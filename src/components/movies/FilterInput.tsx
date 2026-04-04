import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';

interface FilterInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

function sanitize(text: string): string {
  return text.replace(/[^a-zA-ZÀ-ÿ]/g, '');
}

export function FilterInput({ value, onChangeText }: FilterInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        testID="filter-input"
        style={[styles.input, Platform.OS === 'android' && styles.inputAndroid]}
        value={value}
        onChangeText={(text) => onChangeText(sanitize(text))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Buscar películas..."
        placeholderTextColor={COLORS.textHint}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable
          testID="filter-clear-btn"
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
        >
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md + 2,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  containerFocused: {
    borderColor: COLORS.accent,
  },
  searchIcon: {
    fontSize: FONTS.sizes.lg,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 2,
  },
  inputAndroid: {
    paddingBottom: 2,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});
