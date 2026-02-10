import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SectionList, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { MenuItemService } from '../../src/service/menuItemService';
import MenuItemCard from '../../src/components/MenuItemCard';
import CategoryFilter, { CategoryOption } from '../../src/components/CategoryFilter';
import { colors } from '../../src/constants/colors';
import { CartItem } from '@/src/types/cart'

import { useCart } from '../../src/context/CartContext';

export type ItemType = 'PIZZA' | 'DRINK' | 'EXTRA';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  itemType: ItemType;
  weight?: number;
  volume?: number;
}

interface SectionData {
  title: string;
  data: MenuItem[];
}

const CATEGORIES: CategoryOption[] = [
  { label: 'Pizza', value: 'PIZZA' },
  { label: 'Napoje', value: 'DRINK' },
  { label: 'Dodatki', value: 'EXTRA' },
];

const ORDERED_CATEGORIES: string[] = ['PIZZA', 'DRINK', 'EXTRA'];

export default function MenuScreen() {
  const router = useRouter();
  
  const { addItem } = useCart();

  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
        setIsLoading(true);
        try {
          const data = await MenuItemService.getAvailableMenuItems();
          
          const groupedMap = data.reduce((acc, item) => {
            const rawType = String(item.type || 'OTHER');
            const type = rawType.toUpperCase();

            if (!acc[type]) acc[type] = [];
            
            const apiItem = item as any; 

            acc[type].push({
              id: String(item.id),
              name: String(item.name),
              description: String(item.description),
              basePrice: item.basePrice,
              itemType: type as ItemType,
              weight: apiItem.weight, 
              volume: apiItem.volume 
            });
            return acc;
          }, {} as Record<string, MenuItem[]>);
  
          const itemsGrouped = ORDERED_CATEGORIES.reduce<SectionData[]>((acc, key) => {
            if (groupedMap[key] && groupedMap[key].length > 0) {
              acc.push({
                title: key,
                data: groupedMap[key]
              });
            }
            return acc;
          }, []);
          
          Object.keys(groupedMap).forEach(key => {
            if (!ORDERED_CATEGORIES.includes(key)) {
               itemsGrouped.push({ title: key, data: groupedMap[key] });
            }
          });

          setSections(itemsGrouped);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMenu();
  }, []);

  const filteredSections = selectedCategory 
    ? sections.filter(section => section.title === selectedCategory)
    : sections;

  const handleAddToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.basePrice,
      quantity: 1,
    };

    addItem(cartItem);
    console.log(`Dodano do koszyka: ${item.name} (${item.basePrice} PLN)`);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      <SectionList
        sections={filteredSections}
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={Platform.OS === 'ios'}
        
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{formatCategoryName(title)}</Text>
          </View>
        )}
        
        renderItem={({ item }) => (
          <MenuItemCard
            name={item.name}
            description={item.description}
            price={item.basePrice}
            type={item.itemType}
            weight={item.weight} 
            volume={item.volume}
            onAddToOrder={() => handleAddToCart(item)}
          />
        )}

        ListEmptyComponent={
           <Text style={styles.emptyText}>Brak produktów.</Text>
        }
      />
    </View>
  );
}

const formatCategoryName = (enumValue: string) => {
  const map: Record<string, string> = {
    'PIZZA': 'Pizza',
    'DRINK': 'Napoje',
    'EXTRA': 'Dodatki'
  };
  return map[enumValue] || enumValue;
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingHorizontal: 16, paddingBottom: 40 },
    sectionHeader: { backgroundColor: colors.background, paddingVertical: 12, marginTop: 5 },
    sectionHeaderText: {
      fontSize: 18, fontWeight: '800', color: colors.textPrimary,
      textTransform: 'uppercase', letterSpacing: 1,
      borderLeftWidth: 4, borderLeftColor: colors.warning, paddingLeft: 10,
    },
    emptyText: { textAlign: 'center', marginTop: 30, color: colors.textSecondary }
});