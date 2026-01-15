import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../../src/context/CartContext';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  const { items, backendItems, removeItem, totalPrice, clearCart, isLoading, updateQuantity } = useCart();
  const { isLoggedIn } = useAuth();

  const displayItems = backendItems.map((bItem, index) => {
    const localInfo = items.find(i => i.id === bItem.itemId);
    return {
      ...bItem,
      name: localInfo?.name || 'Produkt',
      displayKey: `${bItem.itemId}-${bItem.discounted ? 'promo' : 'reg'}-${index}`
    };
  });

  const handleClearCart = () => {
    const message = "Czy na pewno chcesz wyczyścić koszyk?";
    if (Platform.OS === 'web') {
      if (window.confirm(message)) clearCart();
    } else {
      Alert.alert("Wyczyść koszyk", message, [
        { text: "Anuluj", style: "cancel" },
        { text: "Usuń", style: "destructive", onPress: clearCart }
      ]);
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      if (Platform.OS === 'web') {
        if (window.confirm("Musisz się zalogować, aby złożyć zamówienie. Przejść do logowania?")) {
          router.push('/login');
        }
      } else {
        Alert.alert(
          "Wymagane logowanie",
          "Musisz się zalogować, aby złożyć zamówienie.",
          [
            { text: "Anuluj", style: "cancel" },
            { text: "Zaloguj", onPress: () => router.push('/login') }
          ]
        );
      }
      return;
    }

    console.log("Przekierowanie do podsumowania...");
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>Twój koszyk jest pusty</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.constrainedContainer}>
        <FlatList
          data={displayItems}
          keyExtractor={(item) => item.displayKey}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isPromo = item.discounted;

            return (
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>
                  
                  <View style={styles.priceContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isPromo && (
                        <Text style={styles.originalPriceStrikethrough}>
                          {item.basePrice.toFixed(2)} PLN
                        </Text>
                      )}
                      <Text style={[
                        styles.itemQuantity, 
                        isPromo && { color: colors.success, fontWeight: 'bold' }
                      ]}>
                        {item.finalPrice.toFixed(2)} PLN
                      </Text>
                    </View>
                    
                    {isPromo && (
                      <Text style={styles.discountLabel}>Promocja naliczona!</Text>
                    )}

                    {!isPromo ? (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity onPress={() => updateQuantity(item.itemId, -1)}>
                          <Ionicons name="remove-circle-outline" size={26} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.itemId, 1)}>
                          <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.promoLockedInfo}>
                        <Ionicons name="lock-closed-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.lockedText}>Pozycja promocyjna</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <Text style={[styles.itemTotal, isPromo && { color: colors.success }]}>
                    {item.totalPrice.toFixed(2)} PLN
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => removeItem(item.itemId)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Do zapłaty:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />}
              <Text style={[styles.summaryValue, isLoading && { opacity: 0.5 }]}>
                {totalPrice.toFixed(2)} PLN
              </Text>
            </View>
          </View>

          {(() => {
             const baseTotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
             const savings = baseTotal - totalPrice;
             if (savings > 0.01 && !isLoading) {
               return (
                 <View style={styles.savingsContainer}>
                   <Ionicons name="pricetag" size={16} color={colors.success} />
                   <Text style={styles.savingsText}>Oszczędzasz {savings.toFixed(2)} PLN</Text>
                 </View>
               );
             }
             return null;
          })()}
          
          <TouchableOpacity 
            style={[styles.checkoutButton, isLoading && { backgroundColor: '#ccc' }]} 
            disabled={isLoading}
            // 4. Podmieniamy funkcję tutaj
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>
              {/* Opcjonalnie: Zmień tekst jeśli niezalogowany, ale zazwyczaj Alert wystarczy */}
              {isLoading ? 'Przeliczanie...' : 'Złóż zamówienie'}
            </Text>
            {!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <Text style={styles.clearText}>Wyczyść koszyk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.background },
  constrainedContainer: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: colors.textSecondary, marginTop: 15 },
  listContent: { padding: 16 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  priceContainer: { marginTop: 4 },
  itemQuantity: { fontSize: 14, color: colors.textSecondary },
  originalPriceStrikethrough: { textDecorationLine: 'line-through', color: '#999', fontSize: 12, marginRight: 6 },
  discountLabel: { color: colors.success, fontSize: 10, fontWeight: 'bold', backgroundColor: '#E8F5E9', padding: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  qtyText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 15 },
  itemActions: { alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 90 },
  itemTotal: { fontSize: 17, fontWeight: 'bold' },
  deleteButton: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8, marginTop: 10 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 18 },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  savingsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginBottom: 15 },
  savingsText: { color: colors.success, fontWeight: 'bold', marginLeft: 8 },
  checkoutButton: { backgroundColor: colors.success, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  clearButton: { marginTop: 15, alignItems: 'center' },
  clearText: { color: colors.textSecondary, textDecorationLine: 'underline' },
  promoLockedInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 6, borderRadius: 6, marginTop: 10, alignSelf: 'flex-start' },
  lockedText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4, fontStyle: 'italic' },
});