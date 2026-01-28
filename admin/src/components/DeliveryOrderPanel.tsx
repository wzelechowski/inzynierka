// src/deliveries/DeliveryOrderPanel.tsx
import { useRecordContext, useGetOne, LoadingIndicator, RecordContextProvider } from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';
import { OrderItemsPanel } from '../components/OrderItemsPanel'; // <--- Importujemy Twój gotowy panel

export const DeliveryOrderPanel = () => {
    // 1. Pobieramy rekord DOSTAWY (ten wiersz, w który kliknąłeś)
    const deliveryRecord = useRecordContext();

    if (!deliveryRecord || !deliveryRecord.orderId) {
        return <Alert severity="warning">Brak ID zamówienia w tej dostawie.</Alert>;
    }

    // 2. Pobieramy dane ZAMÓWIENIA na podstawie ID
    const { data: orderData, isLoading, error } = useGetOne(
        'orders', 
        { id: deliveryRecord.orderId }
    );

    if (isLoading) return <Box p={2}><LoadingIndicator /></Box>;
    if (error) return <Alert severity="error">Nie udało się pobrać szczegółów zamówienia.</Alert>;
    if (!orderData) return <Alert severity="warning">Zamówienie nie istnieje.</Alert>;

    return (
        <Box sx={{ p: 1, backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ mb: 1, ml: 2 }}>
                Szczegóły zamówienia ({deliveryRecord.orderId})
            </Typography>

            {/* 3. KLUCZOWE: Podmieniamy kontekst! 
                Wewnątrz tego tagu "rekordem" staje się Zamówienie, a nie Dostawa. 
                Dzięki temu OrderItemsPanel zadziała bez żadnych zmian! */}
            <RecordContextProvider value={orderData}>
                <OrderItemsPanel />
            </RecordContextProvider>
        </Box>
    );
};