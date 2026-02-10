import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { OrderResponse } from '../types/order';
import { DeliveryResponse } from '../types/delivery';

interface OrderCardProps {
  order: OrderResponse;
  menuMap: Record<string, string>;
  delivery?: DeliveryResponse | null;
}

export const OrderCard = ({ order, menuMap, delivery }: OrderCardProps) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return colors.primary;
      case 'IN_PREPARATION': return '#F57C00';
      case 'READY': return '#1976D2';  
      case 'DELIVERY': return '#8E24AA';     
      case 'COMPLETED': return colors.success;
      case 'CANCELLED': return '#D32F2F';
      default: return '#757575';
    }
  };

  const translateStatus = (status: string) => {
    const map: Record<string, string> = {
      'NEW': 'Nowe',
      'IN_PREPARATION': 'W przygotowaniu',
      'READY': 'Gotowe do odbioru',
      'DELIVERY': 'W dostawie',
      'COMPLETED': 'Zakończone',
      'CANCELLED': 'Anulowane'
    };
    return map[status] || status;
  };

  const translateType = (type: string) => {
     if (type === 'DELIVERY') return 'Dostawa';
     if (type === 'TAKE_AWAY') return 'Na wynos';
     if (type === 'ON_SITE') return 'Na miejscu';
     return type;
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{order.id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
           <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
             {translateStatus(order.status)}
           </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" style={{marginRight: 6}} />
            <Text style={styles.infoText}>
                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
        </View>

        <View style={styles.infoRow}>
            <Ionicons name={order.type === 'DELIVERY' ? "bicycle-outline" : "bag-handle-outline"} size={16} color="#666" style={{marginRight: 6}} />
            <Text style={styles.infoText}>{translateType(order.type)}</Text>
        </View>

        {order.type === 'DELIVERY' && delivery && delivery.supplier && (
          <View style={styles.supplierContainer}>
             <Ionicons name="person-circle-outline" size={18} color={colors.primary} style={{marginRight: 6}} />
             <Text style={styles.supplierText}>
               Dostawca: <Text style={{fontWeight: 'bold'}}>{delivery.supplier.firstName} {delivery.supplier.lastName}</Text>
             </Text>
          </View>
        )}
      </View>
      
      {order.orderItems && order.orderItems.length > 0 && (
        <View style={styles.itemsListContainer}>
          <View style={styles.divider} />
          {order.orderItems.map((item, index) => {
            const productName = menuMap[item.itemId] || 'Produkt archiwalny';
            
            return (
              <View key={index} style={styles.itemRow}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{productName}</Text>
                </View>
                <Text style={styles.itemPrice}>{(item.finalPrice * item.quantity).toFixed(2)} zł</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Łącznie:</Text>
        <Text style={styles.totalPrice}>{order.totalPrice.toFixed(2)} PLN</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: { 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    marginBottom: 16, 
    borderRadius: 16, 
    padding: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 3 
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontWeight: 'bold', fontSize: 16, color: colors.textPrimary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardBody: { marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { color: '#555', fontSize: 14 },
  supplierContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4, 
    backgroundColor: '#F3E5F5', 
    padding: 6, 
    borderRadius: 6 
  },
  supplierText: { color: colors.primary, fontSize: 13 },
  itemsListContainer: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemQuantity: { fontWeight: 'bold', color: colors.primary, marginRight: 8, width: 24 },
  itemName: { color: colors.textPrimary, flex: 1, flexWrap: 'wrap' },
  itemPrice: { color: '#666', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 12 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#888' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
});