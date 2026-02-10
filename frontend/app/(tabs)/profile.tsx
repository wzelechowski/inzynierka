import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/constants/colors';
import { UserService } from '../../src/service/userService';
import { OrderService } from '../../src/service/orderService';
import { MenuItemService } from '../../src/service/menuItemService';
import { DeliveryService } from '../../src/service/deliveryService';

import { UserProfileResponse } from '../../src/types/user';
import { OrderResponse } from '../../src/types/order';
import { DeliveryResponse } from '../../src/types/delivery';
import { OrderCard } from '../../src/components/OrderCard';

const FILTER_OPTIONS = [
  { label: 'Wszystkie', value: 'ALL' },
  { label: 'Nowe', value: 'NEW' },
  { label: 'W przygotowaniu', value: 'IN_PREPARATION' },
  { label: 'Gotowe', value: 'READY' },
  { label: 'W dostawie', value: 'DELIVERY' },
  { label: 'Zakończone', value: 'COMPLETED' },
  { label: 'Anulowane', value: 'CANCELLED' },
];

const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  if (cleaned.length === 11 && cleaned.startsWith('48')) {
     return `+48 ${cleaned.substring(2,5)} ${cleaned.substring(5,8)} ${cleaned.substring(8,11)}`;
  }
  return phone;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [menuMap, setMenuMap] = useState<Record<string, string>>({});
  const [deliveriesMap, setDeliveriesMap] = useState<Record<string, DeliveryResponse>>({});
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchData = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const [userData, ordersData, menuItemsData] = await Promise.all([
        UserService.getDetails(),
        OrderService.getOrders(),
        MenuItemService.getAvailableMenuItems()
      ]);
      
      setUser(userData);
      
      const map: Record<string, string> = {};
      menuItemsData.forEach(item => {
          map[String(item.id)] = String(item.name); 
      });
      setMenuMap(map);

      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);

      const deliveryOrders = sortedOrders.filter(o => o.type === 'DELIVERY');
      
      const promises = deliveryOrders.map(order => 
          DeliveryService.getDeliveryByOrderId(order.id)
            .then(res => ({ orderId: order.id, data: res }))
      );

      const deliveryResults = await Promise.all(promises);
      
      const newDeliveriesMap: Record<string, DeliveryResponse> = {};
      deliveryResults.forEach(item => {
          if (item.data) {
              newDeliveriesMap[item.orderId] = item.data;
          }
      });
      setDeliveriesMap(newDeliveriesMap);

    } catch (error) {
      console.log("Błąd pobierania danych profilu:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      fetchData();
    }
  }, [isLoggedIn]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'ALL') {
      return orders;
    }
    return orders.filter(order => order.status === filterStatus);
  }, [orders, filterStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const renderFilters = () => (
    <View style={styles.filtersWrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filtersContentContainer}
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = filterStatus === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterChip, 
                isActive && styles.filterChipActive
              ]}
              onPress={() => setFilterStatus(option.value)}
            >
              <Text style={[
                styles.filterText, 
                isActive && styles.filterTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
             <Text style={styles.avatarText}>
               {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
             </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            {user?.phoneNumber && (
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                <Text style={styles.userPhone}>{formatPhoneNumber(user.phoneNumber)}</Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Wyloguj się</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Moje zamówienia</Text>
      </View>
      
      {renderFilters()}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainBackground}>
      <View style={styles.constrainedContainer}>
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard 
                order={item} 
                menuMap={menuMap} 
                delivery={deliveriesMap[item.id]}
            />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="filter-outline" size={64} color="#ddd" />
              <Text style={styles.emptyText}>
                {filterStatus === 'ALL' 
                  ? "Nie masz jeszcze żadnych zamówień." 
                  : "Brak zamówień o tym statusie."}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: colors.background,
  },
  constrainedContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 900, 
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 30 },
  
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    marginBottom: 15,
    paddingBottom: 10
  },
  headerContainer: { padding: 20, paddingBottom: 5 },
  
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  userName: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
  userEmail: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  userPhone: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEBEE', padding: 12, borderRadius: 10, marginBottom: 20 },
  logoutText: { color: colors.error, fontWeight: 'bold', marginLeft: 8 },
  
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, marginTop: 10 },

  filtersWrapper: {
    paddingBottom: 5 
  },
  filtersContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 1,           
    justifyContent: 'center', 
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },

  emptyContainer: { alignItems: 'center', marginTop: 60, padding: 20 },
  emptyText: { marginTop: 15, color: colors.textSecondary, fontSize: 16, textAlign: 'center' }
});