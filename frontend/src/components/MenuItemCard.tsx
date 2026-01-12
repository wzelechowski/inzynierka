import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  type: string;
  onAddToOrder: () => void;
}

export default function MenuItemCard({ 
  name, 
  description, 
  price, 
  type,
  onAddToOrder 
}: MenuItemCardProps) {
  
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{name}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        
        <Text style={styles.price}>{price.toFixed(2)} PLN</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={onAddToOrder}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2, 
  }
});