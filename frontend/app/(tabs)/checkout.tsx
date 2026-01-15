import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useCart } from '../../src/context/CartContext';
import { colors } from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { OrderService } from '../../src/service/orderService';

type LocalOrderType = 'DELIVERY' | 'TAKE_AWAY' | 'ON_SITE';

export default function CheckoutScreen() {
  const router = useRouter();
const { totalPrice, items, isLoading: isCartLoading, clearCart } = useCart();  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<LocalOrderType>('DELIVERY');

  const handleConfirmOrder = async () => {
    if (type === 'DELIVERY' && (!address || !city || !zip)) {
      Alert.alert("Błąd", "Proszę uzupełnić dane adresowe.");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseItems = items.map(i => ({ itemId: i.id, quantity: i.quantity }));
      
      let orderData: any = {
        type: type,
        orderItems: baseItems
      };

      if (type === 'DELIVERY') {
        orderData.deliveryAddress = address;
        orderData.deliveryCity = city;
        orderData.postalCode = zip;
      }

      console.log("Wysyłam zamówienie:", orderData);

      await OrderService.createOrder(orderData);
      clearCart();
      

   if (Platform.OS === 'web') {
      window.alert("Zamówienie przyjęte! 🍕");
      router.replace('/'); 
    } else {
      Alert.alert("Sukces!", "Zamówienie złożone.", [
        { text: "OK", onPress: () => router.replace('/') }
      ]);
    }

  } catch (err: any) {
    console.error("Błąd:", err);
    const errorMsg = err.message || "Błąd połączenia";
    
    if (Platform.OS === 'web') {
      window.alert(errorMsg);
    } else {
      Alert.alert("Błąd", errorMsg);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.constrainedContainer}>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sposób odbioru</Text>
          <View style={styles.typeSelector}>
            {(['DELIVERY', 'TAKE_AWAY', 'ON_SITE'] as LocalOrderType[]).map((t) => (
              <TouchableOpacity 
                key={t}
                style={[styles.typeButton, type === t && styles.typeButtonActive]}
                onPress={() => setType(t)}
              >
                <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                  {t === 'DELIVERY' ? 'Dostawa' : t === 'TAKE_AWAY' ? 'Wynos' : 'Na miejscu'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {type === 'DELIVERY' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Adres dostawy</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ulica i numer domu" 
              value={address}
              onChangeText={setAddress}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput 
                style={[styles.input, { width: '65%' }]} 
                placeholder="Miasto" 
                value={city}
                onChangeText={setCity}
              />
              <TextInput 
                style={[styles.input, { width: '30%' }]} 
                placeholder="Kod" 
                value={zip}
                onChangeText={setZip}
              />
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Metoda płatności</Text>
          <View style={styles.paymentOption}>
            <Ionicons name="cash-outline" size={24} color={colors.primary} />
            <Text style={styles.paymentText}>Gotówka przy odbiorze</Text>
            <Ionicons name="radio-button-on" size={20} color={colors.primary} />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.totalLabel}>Do zapłaty:</Text>
          <Text style={styles.totalValue}>{totalPrice.toFixed(2)} PLN</Text>
        </View>

        <TouchableOpacity 
          style={[styles.confirmButton, (isSubmitting || isCartLoading) && { backgroundColor: '#ccc' }]} 
          onPress={handleConfirmOrder}
          disabled={isSubmitting || isCartLoading}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Potwierdzam zamówienie</Text>}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.background },
  constrainedContainer: { padding: 20, width: '100%', maxWidth: 600, alignSelf: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: colors.textPrimary },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between' },
  typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginHorizontal: 4 },
  typeButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeButtonText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  typeButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#fbfbfb', borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 16 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  paymentText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
  summaryCard: { alignItems: 'center', marginVertical: 25 },
  totalLabel: { fontSize: 16, color: colors.textSecondary },
  totalValue: { fontSize: 36, fontWeight: '900', color: colors.primary },
  confirmButton: { backgroundColor: colors.success, padding: 20, borderRadius: 18, alignItems: 'center', marginBottom: 50 },
  confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});