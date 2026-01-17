import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { SupplierService } from '@/src/service/supplierService';
import { DeliveryService } from '@/src/service/deliveryService';
import { DeliveryResponse } from '../../src/types/delivery';
import { DeliveryStatus } from '../../src/types/enums';
import { colors } from '../../src/constants/colors';
import HistoryDeliveryCard from '../../src/components/HistoryDeliveryCard';
import { Ionicons } from '@expo/vector-icons';

export default function SupplierHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState<DeliveryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = useCallback(async () => {
        if (!user?.id) return;
        try {
            const supplier = await SupplierService.getSupplier(user.id);
            if (supplier?.id) {
                const allDeliveries = await DeliveryService.getMyDeliveries(supplier.id);
                const finished = allDeliveries.filter(d => 
                    d.status === DeliveryStatus.DELIVERED || 
                    d.status === DeliveryStatus.CANCELLED
                );
                finished.sort((a, b) => (b.assignedAt || '').localeCompare(a.assignedAt || ''));
                
                setHistory(finished);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <HistoryDeliveryCard delivery={item} />}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHistory(); }} tintColor={colors.primary}/>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="time-outline" size={60} color="#ddd" />
                            <Text style={styles.emptyText}>Brak historii zleceń</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F9FC' },
    listContent: { padding: 16, maxWidth: 600, width: '100%', alignSelf: 'center' },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#888', fontSize: 16, marginTop: 10 }
});