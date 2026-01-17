import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { DeliveryResponse } from '../types/delivery';
import { DeliveryStatus } from '../types/enums';

export default function HistoryDeliveryCard({ delivery }: { delivery: DeliveryResponse }) {
    const isDelivered = delivery.status === DeliveryStatus.DELIVERED;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.orderId}>#{delivery.orderId?.slice(0, 8)}</Text>
                <View style={[styles.badge, isDelivered ? styles.badgeSuccess : styles.badgeCancel]}>
                    <Text style={[styles.badgeText, isDelivered ? styles.textSuccess : styles.textCancel]}>
                        {isDelivered ? 'DOSTARCZONE' : 'ANULOWANE'}
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <Ionicons name="location-outline" size={18} color="#666" />
                <Text style={styles.address}>{delivery.deliveryAddress}, {delivery.deliveryCity}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <Text style={styles.dateLabel}>Zakończono:</Text>
                <Text style={styles.dateText}>
                    {delivery.deliveredAt 
                        ? new Date(delivery.deliveredAt).toLocaleDateString() + ' ' + new Date(delivery.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        : '---'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
        borderLeftWidth: 4, borderLeftColor: '#ccc'
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    orderId: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    badgeSuccess: { backgroundColor: '#E8F5E9' },
    badgeCancel: { backgroundColor: '#FFEBEE' },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    textSuccess: { color: '#2E7D32' },
    textCancel: { color: '#C62828' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    address: { marginLeft: 6, color: '#555', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },
    footer: { flexDirection: 'row', justifyContent: 'space-between' },
    dateLabel: { color: '#888', fontSize: 12 },
    dateText: { color: '#333', fontSize: 12, fontWeight: '600' }
});