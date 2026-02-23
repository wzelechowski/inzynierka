import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { EffectType } from '../types/enums';

export interface PromotionItem {
  id: string;
  productName: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  effectType: EffectType;
  discountAmount: number;
}

interface PromotionCardProps {
  promotionName: string;
  endDate: string;
  effectType: EffectType;
  items: PromotionItem[];
  onPress: () => void;
}

export default function PromotionCard({ 
  promotionName,
  endDate,
  items,
  onPress 
}: PromotionCardProps) {
  
  const totalSetPrice = items.reduce((sum, item) => sum + item.finalPrice, 0);

  const formattedDate = new Date(endDate).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.promoName}>{promotionName}</Text>
          <Text style={styles.endDateText}>Ważna do: {formattedDate}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.totalPrice}>{totalSetPrice.toFixed(2)} PLN</Text>
        </View>
      </View>

      <View style={styles.content}>
        {items.map((item, index) => (
          <View key={index} style={[
            styles.itemContainer, 
            index < items.length - 1 && styles.separator
          ]}>
            
            <View style={styles.itemHeader}>
              <Text style={styles.productName}>{item.productName}</Text>
              
            <View style={styles.priceContainer}>
              <Text style={styles.itemPrice}>{item.finalPrice?.toFixed(2)} PLN</Text>
              
              {(() => {
                switch (item.effectType) {
                  case 'PERCENT':
                    return (
                      <Text style={styles.discountInfo}>
                        Taniej o {item.discountAmount}%
                      </Text>
                    );
                  case 'FIXED':
                    return (
                      <Text style={styles.discountInfo}>
                        Taniej o {item.discountAmount.toFixed(2)} PLN
                      </Text>
                    );
                  case 'FREE_PRODUCT':
                    return (
                      <Text style={[styles.discountInfo, { fontWeight: 'bold', color: '#27ae60' }]}>
                        GRATIS
                      </Text>
                    );
                  default:
                    return null;
                }
              })()}
            </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.ctaText}>Dodaj zestaw do koszyka &rarr;</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
    width: 340,
    maxWidth: '100%',
    alignSelf: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1, 
    marginRight: 10,
  },
  promoName: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  endDateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  priceBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalPrice: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  itemContainer: {
    paddingVertical: 8,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  discountInfo: {
    fontSize: 11,
    color: colors.success,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    backgroundColor: '#fafafa',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ctaText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  }
});