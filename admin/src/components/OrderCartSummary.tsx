import { useEffect, useState, useCallback } from 'react';
import { useDataProvider } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { Box, Typography, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { CartService } from '../service/cartService'; 
import type { CartCalculateResponse } from '../types/cart';

export const OrderCartSummary = () => {
    const dataProvider = useDataProvider();
    const orderItems = useWatch({ name: 'orderItems' });
    
    const [calculation, setCalculation] = useState<CartCalculateResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [baseTotal, setBaseTotal] = useState(0);

    const calculateBaseTotal = useCallback(async (items: any[]) => {
        if (!items.length) {
            setBaseTotal(0); return;
        }
        const ids = items.map(i => i.itemId).filter(Boolean);
        const uniqueIds = Array.from(new Set(ids)) as string[];
        if (uniqueIds.length === 0) return;

        try {
            const { data } = await dataProvider.getMany('menuItems', { ids: uniqueIds });
            let sum = 0;
            items.forEach(item => {
                const product = data.find(p => p.id === item.itemId);
                if (product && item.quantity) {
                    sum += product.basePrice * Number(item.quantity);
                }
            });
            setBaseTotal(sum);
        } catch (e) {
            console.error(e);
        }
    }, [dataProvider]);

    useEffect(() => {
        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            setCalculation(null);
            setBaseTotal(0);
            return;
        }

        const validItems = orderItems
            .filter((i: any) => i.itemId && i.quantity > 0)
            .map((i: any) => ({
                itemId: i.itemId,
                quantity: Number(i.quantity)
            }));

        if (validItems.length === 0) return;

        setLoading(true);

        const handler = setTimeout(async () => {
            try {
                calculateBaseTotal(validItems);
                const response = await CartService.calculateCart({ orderItems: validItems });
                setCalculation(response);
            } catch (error) {
                console.error("Błąd kalkulacji:", error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [orderItems, calculateBaseTotal]);

    if (!calculation && !loading) return null;

    const finalPrice = calculation?.totalPrice || 0;
    const savings = baseTotal - finalPrice;
    const hasPromotions = (calculation?.promotionIds?.length || 0) > 0;

    return (
        <Card sx={{ mt: 2, mb: 2, bgcolor: hasPromotions ? '#e8f5e9' : '#f5f5f5', border: hasPromotions ? '1px solid #66bb6a' : '1px solid #ddd' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <AttachMoneyIcon color={hasPromotions ? "success" : "action"} />
                        <Typography variant="h6">Podsumowanie:</Typography>
                        {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </Box>

                    <Box textAlign="right">
                        {hasPromotions && savings > 0 && (
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {baseTotal.toFixed(2)} PLN
                            </Typography>
                        )}
                        <Typography variant="h4" color={hasPromotions ? "success.main" : "text.primary"} fontWeight="bold">
                            {finalPrice.toFixed(2)} PLN
                        </Typography>
                    </Box>
                </Box>

                {hasPromotions && (
                    <Box mt={1} pt={1} borderTop="1px dashed #a5d6a7">
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <LocalOfferIcon fontSize="small" color="success" />
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                                Aktywne promocje ({calculation?.promotionIds?.length}):
                            </Typography>
                        </Box>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {calculation?.promotionIds?.map((promoId) => (
                                <Chip key={promoId} label="Rabat aktywny" size="small" color="success" variant="outlined" />
                            ))}
                        </Box>
                        {savings > 0 && (
                            <Typography variant="caption" color="success.dark" sx={{ mt: 0.5, display: 'block' }}>
                                Klient oszczędza: {savings.toFixed(2)} PLN
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};