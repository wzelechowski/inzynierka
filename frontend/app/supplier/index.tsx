import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/constants/colors';
import { SupplierService } from '@/src/service/supplierService'; 
import { DeliveryService } from '@/src/service/deliveryService';
import { SupplierResponse } from '../../src/types/supplier';
import { DeliveryResponse } from '../../src/types/delivery';
import { DeliveryStatus } from '../../src/types/enums';
import ActiveDeliveryCard from '../../src/components/ActiveDeliveryCard';

export default function SupplierDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [supplierData, setSupplierData] = useState<SupplierResponse | null>(null);
  const [myDeliveries, setMyDeliveries] = useState<DeliveryResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const supplier = await SupplierService.getSupplier(user.id);
      if (supplier && supplier.id) {
        setSupplierData(supplier);
        setCurrentSupplierId(supplier.id);
        const deliveries = await DeliveryService.getMyDeliveries(supplier.id);
        const active = deliveries.filter(d => d.status !== DeliveryStatus.DELIVERED && d.status !== DeliveryStatus.CANCELLED);
        setMyDeliveries(active);
      }
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); 

  const toggleStatus = async () => {
    if (!supplierData || !currentSupplierId) {
        Alert.alert("Błąd", "Nie załadowano profilu dostawcy.");
        return;
    }
    const newStatus = supplierData.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    try {
        const updated = await SupplierService.changeSupplierStatus(currentSupplierId, { status: newStatus });
        setSupplierData(updated);
    } catch(e: any) { Alert.alert('Błąd', e.message) }
  };

const handleLogout = async () => {
    const performLogout = async () => {
        try {
            await logout();
            if (Platform.OS === 'web') {
                router.replace('/');
            }
        } catch (error) {
            console.error("Błąd wylogowania:", error);
        }
    };

    if (Platform.OS === 'web') {
        const confirmed = window.confirm("Czy na pewno chcesz zakończyć pracę?");
        if (confirmed) {
            await performLogout();
        }
    } 
    else {
        Alert.alert("Wylogowanie", "Czy na pewno chcesz zakończyć pracę?", [
            { text: "Anuluj", style: "cancel" },
            { 
                text: "Wyloguj", 
                style: "destructive", 
                onPress: performLogout 
            }
        ]);
    }
  };

  const handleDeliveryStatusChange = async (deliveryId: string, newStatus: DeliveryStatus) => {
      setActionLoading(deliveryId);
      try {
          await DeliveryService.updateStatus(deliveryId, {status: newStatus});
          
          if (newStatus === DeliveryStatus.DELIVERED || newStatus === DeliveryStatus.CANCELLED || newStatus === DeliveryStatus.PENDING) {
              setMyDeliveries(prev => prev.filter(d => d.id !== deliveryId));
              let msg = "Status zmieniony.";
              if (newStatus === DeliveryStatus.DELIVERED) msg = "Dostawa zakończona!";
              if (newStatus === DeliveryStatus.PENDING) msg = "Zlecenie porzucone.";
              Alert.alert("Sukces", msg);
          } else {
              setMyDeliveries(prev => prev.map(d => 
                  d.id === deliveryId ? { ...d, status: newStatus } : d
              ));
          }
      } catch (error: any) {
          Alert.alert("Błąd", "Nie można zmienić statusu.");
      } finally {
          setActionLoading(null);
      }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
        }
      >
        <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
            </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Twoje aktywne zlecenia</Text>

        {myDeliveries.length > 0 ? (
            myDeliveries.map(delivery => (
                <ActiveDeliveryCard 
                    key={delivery.id} 
                    delivery={delivery} 
                    isProcessing={actionLoading === delivery.id}
                    onStatusChange={handleDeliveryStatusChange}
                />
            ))
        ) : (
            <View style={styles.emptyState}>
                <Ionicons name="bicycle" size={50} color="#ddd" />
                <Text style={styles.emptyText}>Brak aktywnych zleceń</Text>
                <Text style={styles.subEmptyText}>Kliknij ikonę "+" w rogu, aby pobrać nowe.</Text>
            </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  
  profileSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 24, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center'
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  
  nameText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#666' },
  
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 10, marginLeft: 5 },
  scrollContent: { 
    paddingVertical: 20, paddingHorizontal: 20,
    width: '100%', maxWidth: 500, alignSelf: 'center', 
  },
  emptyState: { alignItems: 'center', marginTop: 40, opacity: 0.7 },
  emptyText: { fontWeight: 'bold', color: '#555', marginTop: 10 },
  subEmptyText: { fontSize: 12, color: '#888', marginTop: 5 },
});