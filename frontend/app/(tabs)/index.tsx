import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { PromotionService } from '../../src/service/promotionService';
import { MenuItemService } from '../../src/service/menuItemService';
import PromotionCard, { PromotionItem } from '../../src/components/PromotionCard';
import { useCart } from '@/src/context/CartContext';
import { colors } from '../../src/constants/colors';
import { CartItem } from '@/src/types/cart'
import { EffectType } from '@/src/types/enums';

interface MergedPromotionData {
  id: string;
  promotionName: string;
  effectType: EffectType;
  endDate: string;
  items: PromotionItem[];
}

export default function HomeScreen() {
  const router = useRouter();
  const { addItems } = useCart(); 

  const handleAddPromotionToCart = (promo: MergedPromotionData) => {
    const itemsToCart: CartItem[] = promo.items.map(item => ({
      id: item.id,
      name: item.productName,
      price: item.originalPrice,
      quantity: 1,
      description: item.description || '', 
    }));

    addItems(itemsToCart);
    alert(`Dodano zestaw "${promo.promotionName}" do koszyka!`);
  };

  const [data, setData] = useState<MergedPromotionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      setIsLoading(true);
      try {
        const promotions = await PromotionService.getActivePromotions();

        console.log(promotions);
        const mergedPromotions = await Promise.all(
          promotions.map(async (promo) => {
            const productsRefs = promo.proposal?.products;
            if (!productsRefs || productsRefs.length === 0) return null;

            const productsDetailsPromises = productsRefs.map(async (prodRef) => {
              const menuItem = await MenuItemService.getMenuItemById(prodRef.productId);
              if (!menuItem) return null;

              const isConsequent = prodRef.role === 'CONSEQUENT';
              const discountValue = isConsequent ? (promo.discount || 0) : 0;
              let finalPrice = menuItem.basePrice;

              if (promo.effectType === 'PERCENT' && isConsequent) {
                finalPrice = menuItem.basePrice * (1 - discountValue);
              }

              if (promo.effectType === 'FREE_PRODUCT' && isConsequent) {
                finalPrice = 0;
              }

              if (promo.effectType === 'FIXED' && isConsequent) {
                finalPrice = menuItem.basePrice - discountValue;
              }

              if (finalPrice < 0) finalPrice = 0;

              return {
                id: menuItem.id,
                productName: String(menuItem.name),
                description: String(menuItem.description),
                originalPrice: menuItem.basePrice,
                finalPrice: finalPrice,
                discountAmount: discountValue,
              } as PromotionItem;
            });

            const productsDetails = await Promise.all(productsDetailsPromises);
            const validProducts = productsDetails.filter((p): p is PromotionItem => p !== null);

            if (validProducts.length === 0) return null;

            return {
              id: promo.id,
              promotionName: String(promo.name),
              endDate: promo.endDate,
              effectType: promo.effectType,
              items: validProducts,
            } as MergedPromotionData;
          })
        );

        const validPromotions = mergedPromotions.filter((p): p is MergedPromotionData => p !== null);
        setData(validPromotions);

      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotions();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.textSecondary }}>Szukam pyszności...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Witaj w naszej restauracji!</Text>
        <Text style={styles.heroSubtitle}>Najlepsze smaki w mieście, specjalnie dla Ciebie.</Text>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/menu')}
        >
          <Text style={styles.menuButtonText}>Przeglądaj Pełne Menu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gorące Promocje 🔥</Text>
        <Text style={styles.sectionSubtitle}>Wybrane specjalnie dla Ciebie zestawy w niższej cenie.</Text>
      </View>
      
      <View style={styles.listContainer}>
        {data.length > 0 ? (
          data.map((promo) => (
          <PromotionCard
            key={promo.id}
            promotionName={promo.promotionName}
            items={promo.items}
            effectType={promo.effectType}
            endDate={promo.endDate}
            onPress={() => handleAddPromotionToCart(promo)}
          />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aktualnie brak promocji.</Text>
            <Text style={styles.emptySubText}>Ale w menu na pewno znajdziesz coś pysznego!</Text>
          </View>
        )}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  heroSection: {
    backgroundColor: colors.surface,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  menuButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },

  listContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: colors.textSecondary,
    marginTop: 5,
  }
});