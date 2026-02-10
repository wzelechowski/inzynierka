import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
    Linking, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { DeliveryResponse } from '../types/delivery';
import { DeliveryStatus } from '../types/enums';

import { OrderService } from '../service/orderService';
import { MenuItemService } from '../service/menuItemService';
import { OrderResponse } from '../types/order';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DisplayItem {
    id: string;
    name: string;
    quantity: number;
    totalPrice: number;
}

interface ActiveDeliveryCardProps {
    delivery: DeliveryResponse;
    isProcessing: boolean;
    onStatusChange: (id: string, newStatus: DeliveryStatus) => void;
}

export default function ActiveDeliveryCard({ delivery, isProcessing, onStatusChange }: ActiveDeliveryCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    
    const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
    const [orderTotal, setOrderTotal] = useState<number>(0);

    const toggleDetails = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        if (!expanded && displayItems.length === 0) {
            setLoadingDetails(true);
            try {
                if (delivery.orderId) {
                    const order: OrderResponse = await OrderService.getOrderById(delivery.orderId);
                    setOrderTotal(order.totalPrice);

                    const enrichedItems = await Promise.all(
                        order.orderItems.map(async (item) => {
                            let itemName = "Produkt niedostępny";
                            try {
                                const menuItem = await MenuItemService.getMenuItemById(item.itemId);
                                if (menuItem) {
                                    itemName = menuItem.name as string;
                                }
                            } catch (e) {
                                console.log("Błąd pobierania nazwy produktu", e);
                            }

                            return {
                                id: item.itemId,
                                name: itemName,
                                quantity: item.quantity,
                                totalPrice: item.totalPrice
                            } as DisplayItem;
                        })
                    );

                    setDisplayItems(enrichedItems);
                }
            } catch (error) {
                console.error("Nie udało się pobrać szczegółów zamówienia", error);
            } finally {
                setLoadingDetails(false);
            }
        }
        setExpanded(!expanded);
    };

    const renderButtons = () => {
        if (delivery.status === DeliveryStatus.ASSIGNED) {
            return (
                <>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.btnAbandon]} 
                        onPress={() => onStatusChange(delivery.id, DeliveryStatus.PENDING)}
                        disabled={isProcessing}
                    >
                         <Ionicons name="return-up-back" size={18} color="#fff" />
                        <Text style={styles.btnText}>Porzuć</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.btnPickup]} 
                        onPress={() => onStatusChange(delivery.id, DeliveryStatus.PICKED_UP)}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <ActivityIndicator color="#fff" size="small"/> : (
                            <>
                                <Ionicons name="restaurant" size={18} color="#fff" />
                                <Text style={styles.btnText}>Odbierz</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </>
            );
        }

        if (delivery.status === DeliveryStatus.PICKED_UP) {
            return (
                <TouchableOpacity 
                    style={[styles.actionBtn, styles.btnDeliver]} 
                    onPress={() => onStatusChange(delivery.id, DeliveryStatus.DELIVERED)}
                    disabled={isProcessing}
                >
                      {isProcessing ? <ActivityIndicator color="#fff" size="small"/> : (
                        <>
                            <Ionicons name="checkmark-done-circle" size={18} color="#fff" />
                            <Text style={styles.btnText}>Dostarczone</Text>
                        </>
                      )}
                </TouchableOpacity>
            );
        }
        return null;
    };

const handleOpenNavigation = () => {
        const fullAddress = `${delivery.deliveryAddress}, ${delivery.deliveryCity}`;
        const encodedAddress = encodeURIComponent(fullAddress);
        
        if (Platform.OS === 'web') {
            const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            Linking.openURL(webUrl);
            return; 
        }

        const nativeUrl = Platform.select({
            ios: `maps:0,0?q=${encodedAddress}`,
            android: `google.navigation:q=${encodedAddress}`
        });

        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

        if (nativeUrl) {
            Linking.openURL(nativeUrl).catch((err) => {
                console.log("Błąd otwierania aplikacji mapy, otwieram przeglądarkę...");
                Linking.openURL(fallbackUrl);
            });
        } else {
            Linking.openURL(fallbackUrl);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Zlecenie #{delivery.orderId?.slice(0,6)}</Text>
                <View style={[styles.badge, 
                    delivery.status === DeliveryStatus.PICKED_UP ? { backgroundColor: '#E3F2FD' } : { backgroundColor: '#FFF3E0' }
                ]}>
                    <Text style={[
                        styles.badgeText, 
                        delivery.status === DeliveryStatus.PICKED_UP ? { color: '#1976D2' } : { color: '#E65100' }
                    ]}>
                        {delivery.status === DeliveryStatus.PICKED_UP ? 'W DRODZE' : 'PRZYPISANE'}
                    </Text>
                </View>
            </View>
            
            <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={styles.addressText}>{delivery.deliveryAddress}, {delivery.deliveryCity}</Text>
            </View>

            <TouchableOpacity onPress={toggleDetails} style={styles.detailsToggle}>
                <Text style={styles.detailsToggleText}>
                    {expanded ? "Ukryj szczegóły zamówienia" : "Pokaż co jest w zamówieniu"}
                </Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color="#666" />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.orderDetailsContainer}>
                    {loadingDetails ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : displayItems.length > 0 ? (
                        <View>
                            {displayItems.map((item, index) => (
                                <View key={index} style={styles.orderItemRow}>
                                    <Text style={styles.qtyBadge}>{item.quantity}x</Text>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>{item.totalPrice.toFixed(2)} zł</Text>
                                </View>
                            ))}
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Do pobrania:</Text>
                                <Text style={styles.totalValue}>{orderTotal.toFixed(2)} zł</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.errorText}>Brak szczegółów lub błąd pobierania.</Text>
                    )}
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={[styles.actionBtn, styles.btnMap]} 
                    onPress={handleOpenNavigation}
                >
                    <Ionicons name="map" size={18} color="#fff" />
                </TouchableOpacity>
                
                {renderButtons()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
        shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 3
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    title: { fontWeight: 'bold', fontSize: 15 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    addressText: { marginLeft: 8, color: '#444', fontSize: 14, flex: 1 },
    
    detailsToggle: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 5
    },
    detailsToggleText: { fontSize: 13, color: '#666', fontWeight: '500' },
    orderDetailsContainer: {
        backgroundColor: '#F8F9FA', padding: 10, borderRadius: 8, marginBottom: 10
    },
    orderItemRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'center' },
    qtyBadge: { fontWeight: 'bold', marginRight: 8, color: colors.primary },
    itemName: { fontSize: 13, color: '#333', fontWeight: '600' },
    itemPrice: { fontSize: 13, color: '#666', marginLeft: 10 },
    errorText: { color: '#999', fontStyle: 'italic', fontSize: 12 },
    totalRow: { 
        flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, 
        borderTopWidth: 1, borderTopColor: '#eee' 
    },
    totalLabel: { fontWeight: 'bold', color: '#444' },
    totalValue: { fontWeight: 'bold', color: colors.primary, fontSize: 15 },

    divider: { height: 1, backgroundColor: '#eee', marginBottom: 12 },

    actionsContainer: { flexDirection: 'row', gap: 8 },
    actionBtn: { 
        flex: 1, flexDirection: 'row', padding: 10, borderRadius: 10, 
        justifyContent: 'center', alignItems: 'center', gap: 6 
    },
    btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    btnMap: { flex: 0, width: 44, backgroundColor: '#9E9E9E' }, 
    btnPickup: { backgroundColor: colors.primary }, 
    btnAbandon: { backgroundColor: '#FF9800' }, 
    btnDeliver: { backgroundColor: '#4CAF50' }, 
});