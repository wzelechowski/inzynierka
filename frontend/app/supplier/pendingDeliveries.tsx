import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    Alert, 
    RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { DeliveryService } from '@/src/service/deliveryService';
import { SupplierService } from '@/src/service/supplierService';
import { DeliveryResponse } from '../../src/types/delivery';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/constants/colors';

export default function PendingDeliveries() {
    const { user } = useAuth();
    const router = useRouter();
    
    const [deliveries, setDeliveries] = useState<DeliveryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    
    const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSupplierData = async () => {
            if (user?.id) {
                try {
                    const supplier = await SupplierService.getSupplier(user.id);
                    if (supplier && supplier.id) {
                        setCurrentSupplierId(supplier.id);
                    }
                } catch (e) {
                    console.error("Błąd pobierania danych dostawcy:", e);
                }
            }
        };
        fetchSupplierData();
    }, [user?.id]);

    const fetchPending = useCallback(async () => {
        try {
            const data = await DeliveryService.getPendingDeliveires();
            setDeliveries(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPending();
    };

    const handleTakeOrder = async (orderId: string) => {
        if (!currentSupplierId) {
            Alert.alert("Uwaga", "Trwa ładowanie profilu dostawcy...");
            return;
        }

        setActionLoading(orderId);
        
        try {
            await DeliveryService.updateSupplier(orderId, { supplierId: currentSupplierId });
            
            setDeliveries(prevDeliveries => prevDeliveries.filter(item => item.id !== orderId));

            Alert.alert("Sukces", "Zlecenie przyjęte!", [
                { text: "Wróć do Panelu", onPress: () => router.back() },
                { text: "Zostań tutaj", style: "cancel" }
            ]);

        } catch (error: any) {
            Alert.alert("Błąd", error.message || "Nie udało się przyjąć zlecenia.");
        } finally {
            setActionLoading(null);
        }
    };

    const renderItem = ({ item }: { item: DeliveryResponse }) => (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.orderId}>#{item.orderId?.slice(0, 8) || '???'}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
            </View>
            
            {/* Adres dostawy */}
            <View style={styles.row}>
                <View style={styles.iconContainer}>
                    <Ionicons name="location" size={18} color={colors.primary} />
                </View>
                <Text style={styles.address}>
                    {item.deliveryAddress}, {item.deliveryCity}
                </Text>
            </View>

            {/* Linia oddzielająca */}
            <View style={styles.divider} />

            {/* Stopka: Czas i Przycisk */}
            <View style={styles.footer}>
                <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={14} color="#888" />
                    <Text style={styles.timeText}>Nowe zlecenie</Text>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.btn, 
                        (actionLoading === item.id || !currentSupplierId) && styles.btnDisabled
                    ]} 
                    onPress={() => handleTakeOrder(item.id)}
                    disabled={actionLoading !== null || !currentSupplierId}
                >
                    {actionLoading === item.id ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.btnText}>Przyjmij</Text>
                            <Ionicons name="arrow-forward-circle" size={18} color="#fff" style={{ marginLeft: 6 }} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={deliveries}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconBg}>
                                    <Ionicons name="cube-outline" size={40} color={colors.primary} />
                                </View>
                                <Text style={styles.emptyText}>Brak zleceń w okolicy</Text>
                                <Text style={styles.subEmptyText}>Sprawdź ponownie za chwilę</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F7F9FC' 
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        maxWidth: 500, 
        alignSelf: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    
    card: { 
        backgroundColor: '#fff', 
        padding: 16, 
        borderRadius: 16, 
        marginBottom: 16, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    rowBetween: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12 
    },
    orderId: { 
        fontWeight: 'bold', 
        fontSize: 17,
        color: '#1a1a1a'
    },
    badge: { 
        backgroundColor: '#FFF3E0', // Delikatny pomarańcz
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFE0B2'
    },
    badgeText: { 
        color: '#E65100', 
        fontSize: 11, 
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    
    // Sekcja adresu
    row: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        marginBottom: 10 
    },
    iconContainer: {
        width: 28,
        height: 28,
        backgroundColor: '#F5F5F5',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    address: { 
        flex: 1,
        color: '#444', 
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4
    },
    
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12
    },
    
    // Stopka
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    timeText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '500'
    },
    
    // Przycisk
    btn: { 
        backgroundColor: colors.primary, 
        paddingVertical: 10, 
        paddingHorizontal: 16, 
        borderRadius: 12, 
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0
    },
    btnText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 14 
    },

    // Pusty stan
    emptyState: { 
        alignItems: 'center', 
        marginTop: 80, 
    },
    emptyIconBg: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    emptyText: { 
        fontWeight: 'bold', 
        color: '#333', 
        fontSize: 18 
    },
    subEmptyText: {
        color: '#888',
        marginTop: 6,
        fontSize: 14
    }
});