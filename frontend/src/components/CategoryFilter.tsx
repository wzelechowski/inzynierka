import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

export interface CategoryOption {
  label: string;
  value: string;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: string | null;
  onSelectCategory: (categoryValue: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {

  const handlePress = (value: string) => {
    if (selectedCategory === value) {
      onSelectCategory(null);
    } else {
      onSelectCategory(value);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat, index) => {
          const isSelected = selectedCategory === cat.value;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected
              ]}
              onPress={() => handlePress(cat.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.text,
                isSelected ? styles.textSelected : styles.textUnselected
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    paddingVertical: 12,
  },
  container: {
    paddingHorizontal: 16,
    flexGrow: 1,
    justifyContent: 'center'
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    elevation: 1,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  textUnselected: {
    color: colors.textSecondary,
  },
  textSelected: {
    color: '#fff',
  }
});