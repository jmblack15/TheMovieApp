import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';

interface FilterInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

function sanitize(text: string): string {
  return text.replace(/[^a-zA-ZÀ-ÿ]/g, '');
}

export function FilterInput({ value, onChangeText, onClear }: FilterInputProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: focused ? colors.accent : colors.border },
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={focused ? colors.accent : colors.textHint}
        style={styles.searchIcon}
      />
      <TextInput
        testID="filter-input"
        style={[
          styles.input,
          { color: colors.textPrimary },
          Platform.OS === 'android' && styles.inputAndroid,
        ]}
        value={value}
        onChangeText={(text) => onChangeText(sanitize(text))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t('home.filterPlaceholder')}
        placeholderTextColor={colors.textHint}
        accessibilityLabel={t('home.filterLabel')}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable
          testID="filter-clear-btn"
          style={[styles.clearButton, { backgroundColor: colors.border }]}
          onPress={() => { if (onClear) { onClear(); } else { onChangeText(''); } }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
          accessibilityLabel={t('home.clearFilter')}
        >
          <Ionicons name="close" size={14} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderRadius: RADIUS.md + 2,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 2,
  },
  inputAndroid: {
    paddingBottom: 2,
  },
  clearButton: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
});
